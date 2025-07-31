import React, { useState, useEffect, useCallback } from 'react';
import { appointmentsAPI, authAPI, localStorageBackup } from '../services/api';

const Admin = ({ t }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [confirmedPatients, setConfirmedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Get all appointments
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

      // Get confirmed appointment IDs to exclude them
      const confirmedDB = getConfirmedPatientsDB();
      const confirmedAppointmentIds = new Set();
      
      Object.values(confirmedDB).forEach(patient => {
        patient.appointments.forEach(apt => {
          confirmedAppointmentIds.add(apt.id);
          confirmedAppointmentIds.add(apt._id);
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
  }, [getConfirmedPatientsDB]);

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
        if (username === 'admin' && password === 'flexwell2024') {
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
                        <span className="detail-value">{appointment.service}</span>
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
                        ✅ CONFIRM APPOINTMENT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                      <span className="last-service">{patient.lastService}</span>
                    </div>
                    <div className="click-indicator">👁️ View Full History</div>
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
                          <p><strong>Service:</strong> {appointment.service}</p>
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
    </div>
  );
};

export default Admin; 