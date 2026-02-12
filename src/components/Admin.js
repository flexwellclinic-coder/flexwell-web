import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { appointmentsAPI, authAPI, localStorageBackup, notificationAPI } from '../services/api';

const TIME_SLOTS = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

const SERVICE_LABELS = {
  'initial-consultation': 'Initial Consultation',
  'manual-therapy': 'Manual Therapy',
  'exercise-therapy': 'Exercise Therapy',
  'sports-rehab': 'Sports Rehab',
  'womens-health': "Women's Health"
};

const Admin = ({ t }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [confirmedPatients, setConfirmedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reserve Again state
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reservePatient, setReservePatient] = useState(null);
  const [reserveForm, setReserveForm] = useState({ date: '', time: '', service: '' });

  // Reschedule state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Frontend-only check for production
      if (process.env.NODE_ENV === 'production') {
        if (token === 'frontend-admin-token') {
          setIsAuthenticated(true);
          return;
        } else {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
          return;
        }
      }

      // API verification for development
      const response = await authAPI.verify();
      if (response.success) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
    }
  };

  const getConfirmedPatientsDB = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('patientsDB') || '{}');
    } catch (error) {
      console.error('Failed to load patients database:', error);
      return {};
    }
  }, []);

  const saveConfirmedPatientsDB = useCallback((patientsDB) => {
    try {
      localStorage.setItem('patientsDB', JSON.stringify(patientsDB));
      return true;
    } catch (error) {
      console.error('Failed to save patients database:', error);
      return false;
    }
  }, []);

  const loadConfirmedPatients = useCallback(() => {
    try {
      const patientsDB = getConfirmedPatientsDB();
      const patientsList = Object.values(patientsDB);
      setConfirmedPatients(patientsList);
    } catch (error) {
      console.error('Failed to load confirmed patients:', error);
      setConfirmedPatients([]);
    }
  }, [getConfirmedPatientsDB]);

  const loadPendingAppointments = useCallback(async () => {
    setLoading(true);
    try {
      // Get all appointments from API
      let allAppointments = [];
      
      try {
        const response = await appointmentsAPI.getAll();
        if (response.success) {
          allAppointments = response.data || [];
        }
      } catch (apiError) {
        console.warn('API failed, using localStorage:', apiError);
        allAppointments = localStorageBackup.getAppointments();
      }

      // ===== SYNC: Build patient database from confirmed API appointments =====
      const confirmedFromAPI = allAppointments.filter(apt =>
        apt.status === 'confirmed' || apt.status === 'completed'
      );

      if (confirmedFromAPI.length > 0) {
        const patientsDB = getConfirmedPatientsDB();
        let updated = false;

        confirmedFromAPI.forEach(apt => {
          if (!apt.email || !apt.phone) return;
          const patientKey = `${apt.email.toLowerCase()}_${apt.phone}`;

          const appointmentRecord = {
            id: apt._id || apt.id,
            _id: apt._id,
            date: apt.date,
            time: apt.time,
            service: apt.service,
            notes: apt.notes || '',
            confirmedAt: apt.confirmedAt || apt.updatedAt || new Date().toISOString(),
            status: apt.status || 'confirmed'
          };

          if (patientsDB[patientKey]) {
            // Existing patient — check if this appointment is already tracked
            const exists = patientsDB[patientKey].appointments.some(a =>
              (a.id && a.id === appointmentRecord.id) ||
              (a._id && a._id === appointmentRecord._id) ||
              (a.id && a.id === appointmentRecord._id)
            );
            if (!exists) {
              patientsDB[patientKey].appointments.push(appointmentRecord);
              patientsDB[patientKey].totalAppointments = patientsDB[patientKey].appointments.length;
              patientsDB[patientKey].lastAppointmentDate = apt.date;
              patientsDB[patientKey].lastService = apt.service;
              patientsDB[patientKey].monthlyStats = calculateMonthlyStats(patientsDB[patientKey].appointments);
              updated = true;
            }
          } else {
            // New patient from API
            patientsDB[patientKey] = {
              id: patientKey,
              firstName: apt.firstName,
              lastName: apt.lastName,
              email: apt.email,
              phone: apt.phone,
              createdAt: apt.createdAt || new Date().toISOString(),
              lastAppointmentDate: apt.date,
              lastService: apt.service,
              lastConfirmedAt: apt.confirmedAt || new Date().toISOString(),
              totalAppointments: 1,
              appointments: [appointmentRecord],
              monthlyStats: calculateMonthlyStats([appointmentRecord])
            };
            updated = true;
          }
        });

        if (updated) {
          saveConfirmedPatientsDB(patientsDB);
          // Update confirmed patients state directly
          setConfirmedPatients(Object.values(patientsDB));
          console.log('🔄 Synced confirmed patients from API');
        }
      }
      // ===== END SYNC =====

      // Get confirmed appointment IDs to exclude them from pending
      const confirmedDB = getConfirmedPatientsDB();
      const confirmedAppointmentIds = new Set();
      
      Object.values(confirmedDB).forEach(patient => {
        patient.appointments.forEach(apt => {
          if (apt.id) confirmedAppointmentIds.add(apt.id);
          if (apt._id) confirmedAppointmentIds.add(apt._id);
        });
      });

      // Filter to only pending appointments that haven't been confirmed
      const pendingOnly = allAppointments.filter(apt => {
        const aptId = apt._id || apt.id;
        const isNotConfirmed = !confirmedAppointmentIds.has(aptId);
        const isPending = !apt.status || apt.status === 'pending';
        return isNotConfirmed && isPending;
      });

      setPendingAppointments(pendingOnly);
      console.log(`📋 Loaded ${pendingOnly.length} pending appointments`);
      
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setPendingAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [getConfirmedPatientsDB, saveConfirmedPatientsDB]);

  // NOW useEffect can use the functions since they're defined above
  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadPendingAppointments();
      loadConfirmedPatients();
    }
  }, [isAuthenticated, loadPendingAppointments, loadConfirmedPatients]);

  const calculateMonthlyStats = (appointments) => {
    const monthlyStats = {};
    
    appointments.forEach(apt => {
      const aptDate = new Date(apt.date);
      const monthKey = `${aptDate.getFullYear()}-${aptDate.getMonth() + 1}`;
      const monthName = aptDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          month: monthName,
          count: 0,
          appointments: []
        };
      }
      
      monthlyStats[monthKey].count++;
      monthlyStats[monthKey].appointments.push(apt);
    });

    return monthlyStats;
  };

  const addOrUpdatePatient = useCallback((appointment) => {
    try {
      const patientsDB = getConfirmedPatientsDB();
      const patientKey = `${appointment.email.toLowerCase()}_${appointment.phone}`;
      
      const appointmentRecord = {
        id: appointment._id || appointment.id || `apt_${Date.now()}`,
        date: appointment.date,
        time: appointment.time,
        service: appointment.service,
        notes: appointment.notes || '',
        confirmedAt: new Date().toISOString(),
        status: 'confirmed'
      };

      if (patientsDB[patientKey]) {
        // EXISTING PATIENT - Add new appointment
        const patient = patientsDB[patientKey];
        
        // Check if appointment already exists
        const exists = patient.appointments.some(apt => 
          apt.id === appointmentRecord.id || 
          (apt.date === appointmentRecord.date && apt.time === appointmentRecord.time)
        );

        if (!exists) {
          patient.appointments.push(appointmentRecord);
          patient.totalAppointments = patient.appointments.length;
          patient.lastAppointmentDate = appointment.date;
          patient.lastService = appointment.service;
          patient.lastConfirmedAt = new Date().toISOString();
          patient.monthlyStats = calculateMonthlyStats(patient.appointments);
          
          console.log(`✅ Added appointment #${patient.totalAppointments} for ${patient.firstName} ${patient.lastName}`);
        } else {
          console.log(`ℹ️ Appointment already exists for ${patient.firstName} ${patient.lastName}`);
        }
      } else {
        // NEW PATIENT - Create patient record
        const newPatient = {
          id: patientKey,
          firstName: appointment.firstName,
          lastName: appointment.lastName,
          email: appointment.email,
          phone: appointment.phone,
          createdAt: new Date().toISOString(),
          lastAppointmentDate: appointment.date,
          lastService: appointment.service,
          lastConfirmedAt: new Date().toISOString(),
          totalAppointments: 1,
          appointments: [appointmentRecord],
          monthlyStats: calculateMonthlyStats([appointmentRecord])
        };
        
        patientsDB[patientKey] = newPatient;
        console.log(`✅ Created new patient: ${newPatient.firstName} ${newPatient.lastName}`);
      }

      // Save database
      const saved = saveConfirmedPatientsDB(patientsDB);
      if (saved) {
        loadConfirmedPatients(); // Refresh the list
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to add/update patient:', error);
      return false;
    }
  }, [getConfirmedPatientsDB, saveConfirmedPatientsDB, loadConfirmedPatients]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      const { username, password } = loginForm;
      
      // Simple frontend-only check for production
      if (process.env.NODE_ENV === 'production') {
        if (username === 'admin' && password === '@Kumbulla&Shalq!(3024)') {
          localStorage.setItem('adminToken', 'frontend-admin-token');
          setIsAuthenticated(true);
          return;
        } else {
          setError('Invalid username or password');
          return;
        }
      }

      // API login for development
      const response = await authAPI.login(username, password);
      
      if (response.success) {
        setIsAuthenticated(true);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setPendingAppointments([]);
    setConfirmedPatients([]);
  };

  const handleConfirmAppointment = async (appointment) => {
    if (!window.confirm(`Confirm appointment for ${appointment.firstName} ${appointment.lastName}?`)) {
      return;
    }

    setLoading(true);
    
    try {
      const appointmentId = appointment._id || appointment.id;
      
      console.log(`🔄 Confirming appointment ${appointmentId}...`);
      
      // Step 1: Update appointment status in API/localStorage
      try {
        const response = await appointmentsAPI.updateStatus(appointmentId, 'confirmed');
        if (response.success) {
          console.log('✅ API status updated');
        }
      } catch (apiError) {
        console.warn('API failed, updating localStorage:', apiError);
        localStorageBackup.updateAppointment(appointmentId, { status: 'confirmed' });
      }

      // Step 2: Add patient to confirmed database
      const patientAdded = addOrUpdatePatient(appointment);
      
      if (patientAdded) {
        // Step 3: IMMEDIATELY remove from pending list
        setPendingAppointments(prev => {
          const filtered = prev.filter(apt => {
            const aptId = apt._id || apt.id;
            return aptId !== appointmentId;
          });
          console.log(`✅ Removed from pending. Remaining: ${filtered.length}`);
          return filtered;
        });

        // Step 4: Also remove from localStorage to prevent reappearing
        localStorageBackup.deleteAppointment(appointmentId);

        // Step 5: Success message
        const patientsDB = getConfirmedPatientsDB();
        const patientKey = `${appointment.email.toLowerCase()}_${appointment.phone}`;
        const patient = patientsDB[patientKey];
        
        alert(`✅ APPOINTMENT CONFIRMED!\n\nPatient: ${appointment.firstName} ${appointment.lastName}\nTotal appointments: ${patient?.totalAppointments || 1}\n\n🎉 Patient can book again anytime!`);
        
      } else {
        throw new Error('Failed to add patient to database');
      }
      
    } catch (error) {
      console.error('❌ Confirmation failed:', error);
      alert(`❌ FAILED TO CONFIRM\n\nError: ${error.message}\nPlease try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointment) => {
    if (!window.confirm(`Delete appointment for ${appointment.firstName} ${appointment.lastName}?\n\nThis action cannot be undone.`)) {
      return;
    }

    setLoading(true);

    try {
      const appointmentId = appointment._id || appointment.id;

      // Delete from API
      try {
        await appointmentsAPI.delete(appointmentId);
        console.log('✅ Deleted from API');
      } catch (apiError) {
        console.warn('API delete failed, removing from localStorage:', apiError);
      }

      // Delete from localStorage
      localStorageBackup.deleteAppointment(appointmentId);

      // Remove from pending list immediately
      setPendingAppointments(prev => prev.filter(apt => {
        const aptId = apt._id || apt.id;
        return aptId !== appointmentId;
      }));

      alert(`🗑️ Appointment deleted.\n\nPatient: ${appointment.firstName} ${appointment.lastName}`);

    } catch (error) {
      console.error('Delete failed:', error);
      alert('❌ Failed to delete appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = (appointment) => {
    setRescheduleAppointment(appointment);
    setRescheduleForm({ date: '', time: '' });
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleAppointment) return;

    if (!rescheduleForm.date || !rescheduleForm.time) {
      alert('Please select a new date and time.');
      return;
    }

    setLoading(true);

    try {
      const appointmentId = rescheduleAppointment._id || rescheduleAppointment.id;

      // Update in API
      try {
        await appointmentsAPI.update(appointmentId, {
          date: rescheduleForm.date,
          time: rescheduleForm.time
        });
        console.log('✅ Rescheduled in API');
      } catch (apiError) {
        console.warn('API update failed, updating localStorage:', apiError);
        localStorageBackup.updateAppointment(appointmentId, {
          date: rescheduleForm.date,
          time: rescheduleForm.time
        });
      }

      // Update in pending list immediately
      setPendingAppointments(prev => prev.map(apt => {
        const aptId = apt._id || apt.id;
        if (aptId === appointmentId) {
          return { ...apt, date: rescheduleForm.date, time: rescheduleForm.time };
        }
        return apt;
      }));

      setShowRescheduleModal(false);
      setRescheduleAppointment(null);
      setRescheduleForm({ date: '', time: '' });

      const newDate = new Date(rescheduleForm.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      alert(`📅 Appointment rescheduled!\n\nPatient: ${rescheduleAppointment.firstName} ${rescheduleAppointment.lastName}\nNew Date: ${newDate}\nNew Time: ${rescheduleForm.time}`);

    } catch (error) {
      console.error('Reschedule failed:', error);
      alert('❌ Failed to reschedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString.includes(':') ? `${timeString}:00` : timeString;
  };

  const getCurrentMonthStats = (patient) => {
    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
    return patient.monthlyStats?.[currentMonthKey]?.count || 0;
  };

  // ==============================
  // CALENDAR HELPERS
  // ==============================
  const getWeekDays = useCallback((startDate) => {
    const days = [];
    for (let i = 0; i < 6; i++) { // Mon-Sat
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  }, []);

  const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const calendarAppointments = useMemo(() => {
    const weekDays = getWeekDays(calendarDate);
    const startStr = weekDays[0].toISOString().split('T')[0];
    const endStr = weekDays[weekDays.length - 1].toISOString().split('T')[0];

    const allAppointments = [];

    // Add pending appointments
    pendingAppointments.forEach(apt => {
      allAppointments.push({
        ...apt,
        displayStatus: 'pending',
        patientName: `${apt.firstName} ${apt.lastName}`
      });
    });

    // Add confirmed appointments from patient database
    confirmedPatients.forEach(patient => {
      patient.appointments.forEach(apt => {
        allAppointments.push({
          ...apt,
          displayStatus: apt.status || 'confirmed',
          patientName: `${patient.firstName} ${patient.lastName}`,
          email: patient.email,
          phone: patient.phone
        });
      });
    });

    // Filter to current week
    return allAppointments.filter(apt => {
      return apt.date >= startStr && apt.date <= endStr;
    });
  }, [pendingAppointments, confirmedPatients, calendarDate, getWeekDays]);

  const getAppointmentForSlot = useCallback((date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarAppointments.find(apt => apt.date === dateStr && apt.time === time);
  }, [calendarAppointments]);

  const navigateCalendar = (direction) => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      return newDate;
    });
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    setCalendarDate(monday);
  };

  const getServiceLabel = (service) => {
    return SERVICE_LABELS[service] || service || 'N/A';
  };

  // ==============================
  // RESERVE AGAIN HANDLERS
  // ==============================
  const handleReserveAgain = (patient, e) => {
    if (e) e.stopPropagation();
    setReservePatient(patient);
    setReserveForm({
      date: '',
      time: '',
      service: patient.lastService || ''
    });
    setShowReserveModal(true);
  };

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    if (!reservePatient) return;

    if (!reserveForm.date || !reserveForm.time || !reserveForm.service) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        firstName: reservePatient.firstName,
        lastName: reservePatient.lastName,
        email: reservePatient.email,
        phone: reservePatient.phone,
        date: reserveForm.date,
        time: reserveForm.time,
        service: reserveForm.service,
        notes: 'Rebooked by admin',
        previousInjury: false,
        createdBy: 'admin'
      };

      let savedAppointment = { ...appointmentData, id: `apt_${Date.now()}` };

      // Save to API
      try {
        const response = await appointmentsAPI.create(appointmentData);
        if (response.success && response.data) {
          savedAppointment = { ...appointmentData, _id: response.data._id, id: response.data._id };
          // Update status to confirmed
          try {
            await appointmentsAPI.updateStatus(response.data._id, 'confirmed');
          } catch (statusErr) {
            console.warn('Could not update status:', statusErr);
          }
        }
      } catch (apiError) {
        console.warn('API failed, using localStorage:', apiError);
        const local = localStorageBackup.addAppointment(appointmentData);
        if (local) {
          savedAppointment = local;
        }
      }

      // Add to patient database (auto-confirm)
      addOrUpdatePatient(savedAppointment);

      setShowReserveModal(false);
      setShowPatientDetails(false);
      setReservePatient(null);
      setReserveForm({ date: '', time: '', service: '' });

      // Reload pending appointments
      await loadPendingAppointments();

      alert(`✅ Appointment booked!\n\nPatient: ${appointmentData.firstName} ${appointmentData.lastName}\nDate: ${new Date(appointmentData.date + 'T12:00:00').toLocaleDateString()}\nTime: ${appointmentData.time}\nService: ${getServiceLabel(appointmentData.service)}`);

    } catch (error) {
      console.error('Reserve failed:', error);
      alert('❌ Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // RENDER
  // ==============================

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <h2>🔐 Admin Login</h2>
            <p>Access the appointment confirmation panel</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
                disabled={isLoggingIn}
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
                disabled={isLoggingIn}
              />
            </div>
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? '🔄 Logging in...' : '🚀 Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  const weekDays = getWeekDays(calendarDate);
  const weekLabel = `${formatDateShort(weekDays[0])} — ${formatDateShort(weekDays[weekDays.length - 1])}`;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">
            📋 Appointment Management System
          </h1>
          <button 
            onClick={handleLogout}
            className="logout-btn"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-container">
          {/* Statistics */}
          <div className="admin-stats">
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pending Confirmations</h3>
                <span className="stat-number">{pendingAppointments.length}</span>
              </div>
            </div>
            <div className="stat-card confirmed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Registered Patients</h3>
                <span className="stat-number">{confirmedPatients.length}</span>
              </div>
            </div>
            <div className="stat-card appointments">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Total Appointments</h3>
                <span className="stat-number">
                  {confirmedPatients.reduce((total, patient) => total + patient.totalAppointments, 0)}
                </span>
              </div>
            </div>
            <div className="stat-card monthly">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>This Month</h3>
                <span className="stat-number">
                  {confirmedPatients.reduce((total, patient) => total + getCurrentMonthStats(patient), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="pending-appointments-section">
            <div className="section-header">
              <h2>⏳ Pending Appointments ({pendingAppointments.length})</h2>
              <button 
                onClick={loadPendingAppointments}
                className="refresh-btn"
                disabled={loading}
              >
                {loading ? '🔄' : '↻'} Refresh
              </button>
            </div>

            {loading ? (
              <div className="loading-message">
                <p>🔄 Loading appointments...</p>
              </div>
            ) : pendingAppointments.length === 0 ? (
              <div className="empty-appointments">
                <p>🎉 No pending appointments to confirm!</p>
              </div>
            ) : (
              <div className="appointments-grid">
                {pendingAppointments.map((appointment) => (
                  <div key={appointment._id || appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <h3>{appointment.firstName} {appointment.lastName}</h3>
                      <span className="appointment-status pending">⏳ PENDING</span>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="detail-row">
                        <span className="detail-label">📧 Email:</span>
                        <span className="detail-value">{appointment.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">📞 Phone:</span>
                        <span className="detail-value">{appointment.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">📅 Date:</span>
                        <span className="detail-value">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🕐 Time:</span>
                        <span className="detail-value">{formatTime(appointment.time)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">🏥 Service:</span>
                        <span className="detail-value">{getServiceLabel(appointment.service)}</span>
                      </div>
                      {appointment.notes && (
                        <div className="detail-row">
                          <span className="detail-label">📝 Notes:</span>
                          <span className="detail-value">{appointment.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="appointment-actions">
                      <button
                        onClick={() => handleConfirmAppointment(appointment)}
                        className="confirm-btn"
                        disabled={loading}
                      >
                        ✅ Confirm
                      </button>
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="reschedule-btn"
                        disabled={loading}
                      >
                        📅 Reschedule
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appointment)}
                        className="delete-btn"
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar View */}
          <div className="calendar-section">
            <div className="section-header">
              <h2>📅 Appointment Calendar</h2>
              <div className="calendar-nav">
                <button onClick={() => navigateCalendar('prev')} className="cal-nav-btn">◀</button>
                <button onClick={goToCurrentWeek} className="cal-nav-today">Today</button>
                <span className="cal-week-label">{weekLabel}</span>
                <button onClick={() => navigateCalendar('next')} className="cal-nav-btn">▶</button>
              </div>
            </div>

            <div className="calendar-table-wrapper">
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th className="cal-time-header">Time</th>
                    {weekDays.map((day, i) => (
                      <th key={i} className={`cal-day-header ${isToday(day) ? 'today' : ''}`}>
                        {formatDateShort(day)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((time, tIdx) => (
                    <React.Fragment key={time}>
                      {tIdx === 3 && (
                        <tr className="cal-break-row">
                          <td colSpan={weekDays.length + 1} className="cal-break-cell">
                            🍽️ Lunch Break
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="cal-time-cell">{time}</td>
                        {weekDays.map((day, dIdx) => {
                          const apt = getAppointmentForSlot(day, time);
                          return (
                            <td
                              key={dIdx}
                              className={`cal-slot ${isToday(day) ? 'today' : ''} ${apt ? (apt.displayStatus === 'pending' ? 'has-pending' : 'has-confirmed') : 'empty'}`}
                            >
                              {apt ? (
                                <div className="cal-appointment">
                                  <span className="cal-apt-name">{apt.patientName}</span>
                                  <span className="cal-apt-service">{getServiceLabel(apt.service)}</span>
                                  <span className={`cal-apt-badge ${apt.displayStatus}`}>
                                    {apt.displayStatus === 'pending' ? '⏳' : '✅'}
                                  </span>
                                </div>
                              ) : (
                                <span className="cal-empty">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Confirmed Patients Database */}
          {confirmedPatients.length > 0 && (
            <div className="confirmed-patients-section">
              <div className="section-header">
                <h2>✅ Patient Database ({confirmedPatients.length} patients)</h2>
              </div>
              <div className="confirmed-patients-list">
                {confirmedPatients.slice().reverse().map((patient, index) => (
                  <div 
                    key={patient.id} 
                    className="confirmed-patient clickable"
                    onClick={() => handlePatientClick(patient)}
                  >
                    <div className="patient-info">
                      <span className="patient-name">
                        {patient.firstName} {patient.lastName}
                      </span>
                      <span className="patient-email">{patient.email}</span>
                    </div>
                    <div className="patient-stats">
                      <span className="appointment-count">
                        Total: {patient.totalAppointments} appointments
                      </span>
                      <span className="monthly-count">
                        This month: {getCurrentMonthStats(patient)} appointments
                      </span>
                    </div>
                    <div className="patient-dates">
                      <span className="last-appointment">
                        Last: {new Date(patient.lastAppointmentDate).toLocaleDateString()}
                      </span>
                      <span className="last-service">{getServiceLabel(patient.lastService)}</span>
                    </div>
                    <div className="patient-actions-col">
                      <button
                        className="reserve-again-btn"
                        onClick={(e) => handleReserveAgain(patient, e)}
                        title="Book another appointment for this patient"
                      >
                        🔄 Reserve Again
                      </button>
                      <span className="click-indicator">👁️ View History</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <div className="modal-overlay" onClick={() => setShowPatientDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Patient History</h2>
              <button 
                className="close-btn"
                onClick={() => setShowPatientDetails(false)}
              >
                ✖️
              </button>
            </div>
            
            <div className="modal-body">
              <div className="patient-summary">
                <h3>{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                <div className="contact-details">
                  <p><strong>📧 Email:</strong> {selectedPatient.email}</p>
                  <p><strong>📞 Phone:</strong> {selectedPatient.phone}</p>
                  <p><strong>📅 Total Appointments:</strong> {selectedPatient.totalAppointments}</p>
                  <p><strong>👤 Patient Since:</strong> {new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  className="reserve-again-btn modal-reserve-btn"
                  onClick={(e) => handleReserveAgain(selectedPatient, e)}
                >
                  🔄 Reserve Again
                </button>
              </div>

              {/* Monthly Statistics */}
              <div className="monthly-stats">
                <h4>📊 Monthly Appointment Statistics</h4>
                <div className="monthly-grid">
                  {Object.values(selectedPatient.monthlyStats || {}).map((monthData, index) => (
                    <div key={index} className="month-stat">
                      <span className="month-name">{monthData.month}</span>
                      <span className="month-count">{monthData.count} appointments</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="appointment-history">
                <h4>📅 Complete Appointment History</h4>
                <div className="appointments-timeline">
                  {selectedPatient.appointments.slice().reverse().map((appointment, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker">
                        {index === 0 ? '🟢' : '✅'}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-date">
                            {formatDate(appointment.date)}
                          </span>
                          <span className="timeline-time">
                            {formatTime(appointment.time)}
                          </span>
                        </div>
                        <div className="timeline-details">
                          <p><strong>Service:</strong> {getServiceLabel(appointment.service)}</p>
                          <p><strong>Status:</strong> {appointment.status}</p>
                          <p><strong>Confirmed:</strong> {new Date(appointment.confirmedAt).toLocaleDateString()}</p>
                          {appointment.notes && (
                            <p><strong>Notes:</strong> {appointment.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reserve Again Modal */}
      {showReserveModal && reservePatient && (
        <div className="modal-overlay" onClick={() => setShowReserveModal(false)}>
          <div className="modal-content reserve-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔄 Reserve Again</h2>
              <button 
                className="close-btn"
                onClick={() => setShowReserveModal(false)}
              >
                ✖️
              </button>
            </div>
            
            <div className="modal-body">
              <div className="reserve-patient-info">
                <h3>{reservePatient.firstName} {reservePatient.lastName}</h3>
                <p>📧 {reservePatient.email} &nbsp;|&nbsp; 📞 {reservePatient.phone}</p>
                <p className="reserve-total">Total appointments: {reservePatient.totalAppointments}</p>
              </div>

              <form onSubmit={handleReserveSubmit} className="reserve-form">
                <div className="form-group">
                  <label>📅 Date *</label>
                  <input
                    type="date"
                    value={reserveForm.date}
                    onChange={(e) => setReserveForm({ ...reserveForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>🕐 Time *</label>
                  <select
                    value={reserveForm.time}
                    onChange={(e) => setReserveForm({ ...reserveForm, time: e.target.value })}
                    required
                  >
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>🏥 Service *</label>
                  <select
                    value={reserveForm.service}
                    onChange={(e) => setReserveForm({ ...reserveForm, service: e.target.value })}
                    required
                  >
                    <option value="">Select a service</option>
                    {Object.entries(SERVICE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="reserve-actions">
                  <button
                    type="button"
                    className="cancel-reserve-btn"
                    onClick={() => setShowReserveModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-reserve-btn"
                    disabled={loading}
                  >
                    {loading ? '🔄 Booking...' : '✅ Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && rescheduleAppointment && (
        <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
          <div className="modal-content reschedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📅 Reschedule Appointment</h2>
              <button 
                className="close-btn"
                onClick={() => setShowRescheduleModal(false)}
              >
                ✖️
              </button>
            </div>
            
            <div className="modal-body">
              <div className="reserve-patient-info">
                <h3>{rescheduleAppointment.firstName} {rescheduleAppointment.lastName}</h3>
                <p>📧 {rescheduleAppointment.email} &nbsp;|&nbsp; 📞 {rescheduleAppointment.phone}</p>
                <div className="current-schedule">
                  <p><strong>Current Date:</strong> {formatDate(rescheduleAppointment.date)}</p>
                  <p><strong>Current Time:</strong> {formatTime(rescheduleAppointment.time)}</p>
                  <p><strong>Service:</strong> {getServiceLabel(rescheduleAppointment.service)}</p>
                </div>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="reserve-form">
                <div className="form-group">
                  <label>📅 New Date *</label>
                  <input
                    type="date"
                    value={rescheduleForm.date}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>🕐 New Time *</label>
                  <select
                    value={rescheduleForm.time}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                    required
                  >
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div className="reserve-actions">
                  <button
                    type="button"
                    className="cancel-reserve-btn"
                    onClick={() => setShowRescheduleModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submit-reserve-btn"
                    disabled={loading}
                  >
                    {loading ? '🔄 Saving...' : '📅 Reschedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
