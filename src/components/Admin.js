import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { appointmentsAPI, authAPI, localStorageBackup, doctorsAPI } from '../services/api';

const TIME_SLOTS = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
const CALENDAR_SLOTS = [
  '9:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const SERVICE_LABELS = {
  'initial-consultation': 'Initial Consultation',
  'manual-therapy': 'Manual Therapy',
  'exercise-therapy': 'Exercise Therapy',
  'sports-rehab': 'Sports Rehab',
  'womens-health': "Women's Health"
};

const getServiceLabel = (service) => SERVICE_LABELS[service] || service || 'N/A';

const USER_KEY = 'flexwell_user';

const Admin = ({ t }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // { type: 'admin' } | { type: 'doctor', id, name, role }
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Patient detail modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  // Reserve Again state
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reservePatient, setReservePatient] = useState(null);
  const [reserveForm, setReserveForm] = useState({ date: '', time: '', service: '', doctor: '' });

  // Reschedule state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleAppointment, setRescheduleAppointment] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });

  // Manual Booking state
  const [showManualBookModal, setShowManualBookModal] = useState(false);
  const [manualBookForm, setManualBookForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', date: '', time: '', service: '', notes: '', doctor: ''
  });

  // Edit Appointment state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', date: '', time: '', service: '', notes: '', adminNotes: ''
  });

  // Doctors state
  const [doctors, setDoctors] = useState([]);
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [addDoctorForm, setAddDoctorForm] = useState({ name: '', specialty: '', password: '', role: 'doctor' });

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  // ==============================
  // AUTH
  // ==============================
  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const userJson = localStorage.getItem(USER_KEY);
      if (!token) { setIsAuthenticated(false); setCurrentUser(null); return; }

      if (token === 'frontend-admin-token') {
        setIsAuthenticated(true);
        setCurrentUser({ type: 'admin' });
        return;
      }
      if (token.startsWith('doctor-') && userJson) {
        try {
          const user = JSON.parse(userJson);
          if (user.type === 'doctor' && user.id) {
            setIsAuthenticated(true);
            setCurrentUser(user);
            return;
          }
        } catch (e) {}
      }

      if (process.env.NODE_ENV === 'production') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem(USER_KEY);
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }

      const response = await authAPI.verify();
      if (response.success) {
        setIsAuthenticated(true);
        setCurrentUser({ type: 'admin' });
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem(USER_KEY);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('adminToken');
      localStorage.removeItem(USER_KEY);
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    try {
      const { username, password } = loginForm;
      if (process.env.NODE_ENV === 'production') {
        if (username === 'admin' && password === '@Kumbulla&Shalq!(3024)') {
          localStorage.setItem('adminToken', 'frontend-admin-token');
          localStorage.setItem(USER_KEY, JSON.stringify({ type: 'admin' }));
          setIsAuthenticated(true);
          setCurrentUser({ type: 'admin' });
          return;
        }
        const docRes = await doctorsAPI.login(username, password);
        if (docRes.success && docRes.data) {
          const d = docRes.data;
          localStorage.setItem('adminToken', 'doctor-' + d.id);
          localStorage.setItem(USER_KEY, JSON.stringify({ type: 'doctor', id: d.id, name: d.name, role: d.role || 'doctor' }));
          setIsAuthenticated(true);
          setCurrentUser({ type: 'doctor', id: d.id, name: d.name, role: d.role || 'doctor' });
          return;
        }
      } else {
        const response = await authAPI.login(username, password);
        if (response.success) {
          localStorage.setItem(USER_KEY, JSON.stringify({ type: 'admin' }));
          setCurrentUser({ type: 'admin' });
          setIsAuthenticated(true);
          return;
        }
        const docRes = await doctorsAPI.login(username, password);
        if (docRes.success && docRes.data) {
          const d = docRes.data;
          localStorage.setItem('adminToken', 'doctor-' + d.id);
          localStorage.setItem(USER_KEY, JSON.stringify({ type: 'doctor', id: d.id, name: d.name, role: d.role || 'doctor' }));
          setIsAuthenticated(true);
          setCurrentUser({ type: 'doctor', id: d.id, name: d.name, role: d.role || 'doctor' });
          return;
        }
      }
      setError('Invalid username or password');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem(USER_KEY);
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAllAppointments([]);
  };

  // ==============================
  // DATA LOADING (ALL FROM API)
  // ==============================
  const toDateString = useCallback((val) => {
    if (val == null || val === '') return '';
    return String(val).split('T')[0];
  }, []);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let appointments = [];
      try {
        const response = await appointmentsAPI.getAll({ limit: 500 });
        if (response.success) {
          appointments = response.data || [];
        }
      } catch (apiError) {
        console.warn('API failed, trying localStorage fallback:', apiError);
        appointments = localStorageBackup.getAppointments();
      }
      const normalized = appointments.map(apt => ({
        ...apt,
        date: toDateString(apt.date) || String(apt.date || '').split('T')[0]
      }));
      setAllAppointments(normalized);
      console.log(`📋 Loaded ${appointments.length} total appointments from database`);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setAllAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [toDateString]);

  const loadDoctors = useCallback(async () => {
    try {
      const response = await doctorsAPI.getAll();
      if (response.success) {
        setDoctors(response.data || []);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    }
  }, []);

  useEffect(() => { checkAuthentication(); }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
      loadDoctors();
    }
  }, [isAuthenticated, loadAppointments, loadDoctors]);

  // ==============================
  // DERIVED DATA (from API response)
  // ==============================
  const isAdmin = currentUser?.type === 'admin' || (currentUser?.type === 'doctor' && currentUser?.role === 'admin');
  const isDoctor = currentUser?.type === 'doctor' && currentUser?.role !== 'admin';
  const doctorName = currentUser?.type === 'doctor' ? currentUser.name : null;

  const filteredAppointments = useMemo(() => allAppointments, [allAppointments]);

  const canModifyAppointment = (appointment) => {
    if (isAdmin) return true;
    if (isDoctor && doctorName) {
      return (appointment.doctor || '').toLowerCase() === doctorName.toLowerCase();
    }
    return false;
  };

  const pendingAppointments = useMemo(() => {
    return filteredAppointments.filter(apt => !apt.status || apt.status === 'pending');
  }, [filteredAppointments]);

  const confirmedAppointments = useMemo(() => {
    return filteredAppointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed');
  }, [filteredAppointments]);

  // Build patient list by grouping confirmed appointments by email+phone
  const confirmedPatients = useMemo(() => {
    const patientsMap = {};

    confirmedAppointments.forEach(apt => {
      if (!apt.email || !apt.phone) return;
      const key = `${apt.email.toLowerCase()}_${apt.phone}`;

      if (!patientsMap[key]) {
        patientsMap[key] = {
          id: key,
          firstName: apt.firstName,
          lastName: apt.lastName,
          email: apt.email,
          phone: apt.phone,
          createdAt: apt.createdAt,
          appointments: [],
          totalAppointments: 0,
          lastAppointmentDate: null,
          lastService: null,
          monthlyStats: {}
        };
      }

      patientsMap[key].appointments.push({
        id: apt._id || apt.id,
        _id: apt._id,
        date: apt.date,
        time: apt.time,
        service: apt.service,
        notes: apt.notes || '',
        confirmedAt: apt.confirmedAt || apt.updatedAt || apt.createdAt,
        status: apt.status,
        doctor: apt.doctor
      });
    });

    // Calculate stats
    Object.values(patientsMap).forEach(patient => {
      patient.totalAppointments = patient.appointments.length;
      patient.appointments.sort((a, b) => {
        const dateA = typeof a.date === 'string' ? a.date.split('T')[0] : a.date;
        const dateB = typeof b.date === 'string' ? b.date.split('T')[0] : b.date;
        return dateB > dateA ? 1 : dateB < dateA ? -1 : 0;
      });
      patient.lastAppointmentDate = patient.appointments[0]?.date;
      patient.lastService = patient.appointments[0]?.service;
      patient.monthlyStats = calculateMonthlyStats(patient.appointments);
    });

    return Object.values(patientsMap);
  }, [confirmedAppointments]);

  // ==============================
  // HELPERS
  // ==============================
  function calculateMonthlyStats(appointments) {
    const monthlyStats = {};
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    appointments.forEach(apt => {
      const dateStr = typeof apt.date === 'string' ? apt.date.split('T')[0] : '';
      const [year, month] = dateStr.split('-').map(Number);
      if (!year || !month) return;
      const monthKey = `${year}-${month}`;
      const monthName = `${monthNames[month - 1]} ${year}`;
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { month: monthName, count: 0, appointments: [] };
      }
      monthlyStats[monthKey].count++;
      monthlyStats[monthKey].appointments.push(apt);
    });
    return monthlyStats;
  }

  const formatDate = (dateString) => {
    const d = toDateString(dateString);
    if (!d) return 'N/A';
    const [year, month, day] = d.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString && timeString.includes(':') ? `${timeString}:00` : timeString;
  };

  const getCurrentMonthStats = (patient) => {
    const d = new Date();
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    return patient.monthlyStats?.[key]?.count || 0;
  };

  // ==============================
  // CALENDAR
  // ==============================
  const getWeekDays = useCallback((startDate) => {
    const days = [];
    for (let i = 0; i < 6; i++) {
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

  // Normalize date to YYYY-MM-DD (handles both "2026-02-12" and "2026-02-12T00:00:00.000Z")
  const normalizeDate = useCallback((dateVal) => {
    if (!dateVal) return '';
    const str = typeof dateVal === 'string' ? dateVal : new Date(dateVal).toISOString();
    return str.split('T')[0];
  }, []);

  const calendarAppointments = useMemo(() => {
    const weekDays = getWeekDays(calendarDate);
    const startStr = weekDays[0].toISOString().split('T')[0];
    const endStr = weekDays[weekDays.length - 1].toISOString().split('T')[0];

    return filteredAppointments
      .filter(apt => {
        const aptDate = normalizeDate(apt.date);
        return aptDate >= startStr && aptDate <= endStr;
      })
      .map(apt => ({
        ...apt,
        date: normalizeDate(apt.date),
        displayStatus: apt.status || 'pending',
        patientName: `${apt.firstName} ${apt.lastName}`
      }));
  }, [filteredAppointments, calendarDate, getWeekDays, normalizeDate]);

  const getAppointmentsForSlot = useCallback((date, time) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarAppointments.filter(apt => apt.date === dateStr && apt.time === time);
  }, [calendarAppointments]);

  const navigateCalendar = (direction) => {
    setCalendarDate(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      return d;
    });
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dow = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
    monday.setHours(0, 0, 0, 0);
    setCalendarDate(monday);
  };

  // ==============================
  // ACTIONS
  // ==============================
  const handleConfirmAppointment = async (appointment) => {
    if (!window.confirm(`Confirm appointment for ${appointment.firstName} ${appointment.lastName}?`)) return;

    setLoading(true);
    try {
      const id = appointment._id || appointment.id;
      try {
        await appointmentsAPI.updateStatus(id, 'confirmed');
      } catch (apiErr) {
        console.warn('API status update failed:', apiErr);
        localStorageBackup.updateAppointment(id, { status: 'confirmed' });
      }
      // Reload everything from DB
      await loadAppointments();
      alert(`✅ Appointment confirmed for ${appointment.firstName} ${appointment.lastName}!`);
    } catch (err) {
      console.error('Confirmation failed:', err);
      alert(`❌ Failed to confirm: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointment) => {
    if (!window.confirm(`Delete appointment for ${appointment.firstName} ${appointment.lastName}?\n\nThis cannot be undone.`)) return;

    setLoading(true);
    try {
      const id = appointment._id || appointment.id;
      try {
        await appointmentsAPI.delete(id);
      } catch (apiErr) {
        console.warn('API delete failed:', apiErr);
        localStorageBackup.deleteAppointment(id);
      }
      await loadAppointments();
      alert(`🗑️ Appointment deleted.`);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('❌ Failed to delete. Please try again.');
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
    if (!rescheduleAppointment || !rescheduleForm.date || !rescheduleForm.time) {
      alert('Please select a new date and time.');
      return;
    }

    setLoading(true);
    try {
      const id = rescheduleAppointment._id || rescheduleAppointment.id;
      try {
        const res = await appointmentsAPI.update(id, {
          date: rescheduleForm.date,
          time: rescheduleForm.time
        });
        if (!res.success) {
          throw new Error(res.message || 'Update failed');
        }
      } catch (apiErr) {
        // Show the actual error (e.g. "time slot already booked")
        const msg = apiErr.message || apiErr?.response?.data?.message || 'Unknown error';
        alert(`❌ Could not reschedule: ${msg}`);
        setLoading(false);
        return;
      }

      setShowRescheduleModal(false);
      setRescheduleAppointment(null);
      await loadAppointments();

      const newDate = new Date(rescheduleForm.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      alert(`📅 Rescheduled!\n\n${rescheduleAppointment.firstName} ${rescheduleAppointment.lastName}\nNew: ${newDate} at ${rescheduleForm.time}`);
    } catch (err) {
      console.error('Reschedule failed:', err);
      alert('❌ Failed to reschedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reserve Again
  const handleReserveAgain = (patient, e) => {
    if (e) e.stopPropagation();
    setReservePatient(patient);
    setReserveForm({ date: '', time: '', service: patient.lastService || '', doctor: '' });
    setShowReserveModal(true);
  };

  const handleReserveSubmit = async (e) => {
    e.preventDefault();
    if (!reservePatient || !reserveForm.date || !reserveForm.time || !reserveForm.service) {
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
        doctor: reserveForm.doctor || '',
        previousInjury: false,
        createdBy: 'admin'
      };

      // Create appointment
      let newId = null;
      try {
        const res = await appointmentsAPI.create(appointmentData);
        if (res.success && res.data) {
          newId = res.data._id;
        }
      } catch (apiErr) {
        const msg = apiErr.message || 'Could not create appointment';
        alert(`❌ ${msg}`);
        setLoading(false);
        return;
      }

      // Auto-confirm it
      if (newId) {
        try {
          await appointmentsAPI.updateStatus(newId, 'confirmed');
        } catch (statusErr) {
          console.warn('Could not auto-confirm:', statusErr);
        }
      }

      setShowReserveModal(false);
      setShowPatientDetails(false);
      setReservePatient(null);
      await loadAppointments();

      alert(`✅ Appointment booked for ${appointmentData.firstName} ${appointmentData.lastName}!\nDate: ${new Date(appointmentData.date + 'T12:00:00').toLocaleDateString()}\nTime: ${appointmentData.time}`);
    } catch (err) {
      console.error('Reserve failed:', err);
      alert('❌ Failed to create appointment.');
    } finally {
      setLoading(false);
    }
  };

  // Doctor Management
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    if (!addDoctorForm.name) {
      alert('Please enter a doctor name.');
      return;
    }
    if (!addDoctorForm.password || addDoctorForm.password.length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await doctorsAPI.create(addDoctorForm);
      if (res.success) {
        setShowAddDoctorModal(false);
        setAddDoctorForm({ name: '', specialty: '', password: '', role: 'doctor' });
        await loadDoctors();
        alert(`Doctor ${addDoctorForm.name} added! They can log in with their name and password.`);
      } else {
        alert(`Failed: ${res.message}`);
      }
    } catch (err) {
      alert(`Error: ${err.message || 'Failed to add doctor'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    if (!window.confirm(`Remove Dr. ${doctor.name} from the team?`)) return;
    setLoading(true);
    try {
      await doctorsAPI.delete(doctor.id);
      await loadDoctors();
      alert(`Dr. ${doctor.name} removed.`);
    } catch (err) {
      alert(`Error: ${err.message || 'Failed to delete doctor'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDoctor = async (appointment, doctorName) => {
    const id = appointment._id || appointment.id;
    try {
      await appointmentsAPI.update(id, { doctor: doctorName });
      await loadAppointments();
    } catch (err) {
      console.error('Failed to assign doctor:', err);
      alert('Failed to assign doctor.');
    }
  };

  // Manual Booking
  const handleManualBook = () => {
    setManualBookForm({
      firstName: '', lastName: '', email: '', phone: '', date: '', time: '', service: '', notes: '',
      doctor: isDoctor ? doctorName : ''
    });
    setShowManualBookModal(true);
  };

  const handleManualBookSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, date, time, service } = manualBookForm;
    if (!firstName || !lastName || !email || !phone || !date || !time || !service) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const doctorVal = isDoctor ? doctorName : (manualBookForm.doctor || '');
      const appointmentData = {
        firstName, lastName, email, phone, date, time, service,
        notes: manualBookForm.notes || (isDoctor ? 'Booked by doctor' : 'Booked by admin'),
        doctor: doctorVal,
        previousInjury: false,
        createdBy: isDoctor ? 'doctor' : 'admin'
      };

      let newId = null;
      try {
        const res = await appointmentsAPI.create(appointmentData);
        if (res.success && res.data) {
          newId = res.data._id || res.data.id;
        } else {
          throw new Error(res.message || 'Failed to create');
        }
      } catch (apiErr) {
        const msg = apiErr.message || 'Could not create appointment';
        alert(`Could not book: ${msg}`);
        setLoading(false);
        return;
      }

      // Auto-confirm since admin is booking
      if (newId) {
        try {
          await appointmentsAPI.updateStatus(newId, 'confirmed');
        } catch (statusErr) {
          console.warn('Could not auto-confirm:', statusErr);
        }
      }

      setShowManualBookModal(false);
      await loadAppointments();
      alert(`Appointment booked for ${firstName} ${lastName}!\nDate: ${new Date(date + 'T12:00:00').toLocaleDateString()}\nTime: ${time}`);
    } catch (err) {
      console.error('Manual booking failed:', err);
      alert('Failed to create appointment.');
    } finally {
      setLoading(false);
    }
  };

  // Edit Appointment
  const handleEditAppointment = (appointment, e) => {
    if (e) e.stopPropagation();
    const dateNormalized = appointment.date ? (typeof appointment.date === 'string' ? appointment.date.split('T')[0] : appointment.date) : '';
    setEditAppointment(appointment);
    setEditForm({
      firstName: appointment.firstName || '',
      lastName: appointment.lastName || '',
      email: appointment.email || '',
      phone: appointment.phone || '',
      date: dateNormalized,
      time: appointment.time || '',
      service: appointment.service || '',
      notes: appointment.notes || '',
      adminNotes: appointment.adminNotes || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editAppointment) return;

    const { firstName, lastName, email, phone, date, time, service } = editForm;
    if (!firstName || !lastName || !email || !phone || !date || !time || !service) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const id = editAppointment._id || editAppointment.id;
      const updates = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        date: editForm.date,
        time: editForm.time,
        service: editForm.service,
        notes: editForm.notes,
        adminNotes: editForm.adminNotes
      };

      try {
        const res = await appointmentsAPI.update(id, updates);
        if (!res.success) {
          throw new Error(res.message || 'Update failed');
        }
      } catch (apiErr) {
        const msg = apiErr.message || apiErr?.response?.data?.message || 'Unknown error';
        alert(`Could not update: ${msg}`);
        setLoading(false);
        return;
      }

      setShowEditModal(false);
      setEditAppointment(null);
      await loadAppointments();
      alert(`Updated appointment for ${firstName} ${lastName}!`);
    } catch (err) {
      console.error('Edit failed:', err);
      alert('Failed to update appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  // ==============================
  // RENDER
  // ==============================

  // Login
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <h2>🔐 Admin / Doctor Login</h2>
            <p>Admins: use admin credentials. Doctors: use your name and password.</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required disabled={isLoggingIn} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required disabled={isLoggingIn} />
            </div>
            <button type="submit" className="login-btn" disabled={isLoggingIn}>
              {isLoggingIn ? '🔄 Logging in...' : '🚀 Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  const weekDays = getWeekDays(calendarDate);
  const weekLabel = `${formatDateShort(weekDays[0])} — ${formatDateShort(weekDays[weekDays.length - 1])}`;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1 className="admin-title">
            {isDoctor ? `👨‍⚕️ Dr. ${doctorName}'s Panel` : '📋 Appointment Management System'}
          </h1>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-container">
          {/* Statistics */}
          <div className="admin-stats">
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pending</h3>
                <span className="stat-number">{pendingAppointments.length}</span>
              </div>
            </div>
            <div className="stat-card confirmed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Patients</h3>
                <span className="stat-number">{confirmedPatients.length}</span>
              </div>
            </div>
            <div className="stat-card appointments">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Total Appointments</h3>
                <span className="stat-number">{confirmedAppointments.length}</span>
              </div>
            </div>
            <div className="stat-card monthly">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>This Month</h3>
                <span className="stat-number">
                  {confirmedPatients.reduce((t, p) => t + getCurrentMonthStats(p), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="pending-appointments-section">
            <div className="section-header">
              <h2>⏳ Pending Appointments ({pendingAppointments.length})</h2>
              <div className="section-header-actions">
                <button onClick={handleManualBook} className="manual-book-btn" disabled={loading}>
                  ➕ Manual Booking
                </button>
                {isAdmin && (
                  <button onClick={() => { setAddDoctorForm({ name: '', specialty: '', password: '', role: 'doctor' }); setShowAddDoctorModal(true); }} className="manage-doctors-btn" disabled={loading}>
                    👨‍⚕️ Add Doctor
                  </button>
                )}
                <button onClick={loadAppointments} className="refresh-btn" disabled={loading}>
                  {loading ? '🔄' : '↻'} Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-message"><p>🔄 Loading appointments...</p></div>
            ) : pendingAppointments.length === 0 ? (
              <div className="empty-appointments"><p>🎉 No pending appointments to confirm!</p></div>
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
                      {isAdmin && (
                        <div className="detail-row doctor-assign-row">
                          <span className="detail-label">👨‍⚕️ Doctor:</span>
                          <select
                            className="doctor-select"
                            value={appointment.doctor || ''}
                            onChange={(e) => handleAssignDoctor(appointment, e.target.value)}
                          >
                            <option value="">Select a doctor</option>
                            {doctors.map(doc => (
                              <option key={doc.id} value={doc.name}>{doc.name}{doc.specialty ? ` (${doc.specialty})` : ''}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className="appointment-actions">
                      {canModifyAppointment(appointment) ? (
                        <>
                          <button onClick={() => handleConfirmAppointment(appointment)}
                            className="confirm-btn" disabled={loading}>
                            ✅ Confirm
                          </button>
                          <button onClick={() => handleReschedule(appointment)}
                            className="reschedule-btn" disabled={loading}>
                            📅 Reschedule
                          </button>
                          {isAdmin && (
                            <>
                              <button onClick={(e) => handleEditAppointment(appointment, e)}
                                className="edit-btn" disabled={loading}>
                                ✏️ Edit
                              </button>
                              <button onClick={() => handleDeleteAppointment(appointment)}
                                className="delete-btn" disabled={loading}>
                                🗑️ Delete
                              </button>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="apt-readonly-hint">View only</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calendar */}
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
                  {CALENDAR_SLOTS.map((time) => (
                    <tr key={time}>
                      <td className="cal-time-cell">{time}</td>
                      {weekDays.map((day, dIdx) => {
                        const apts = getAppointmentsForSlot(day, time);
                        const hasAny = apts.length > 0;
                        const hasPending = apts.some(a => a.displayStatus === 'pending');
                        return (
                          <td key={dIdx}
                            className={`cal-slot ${isToday(day) ? 'today' : ''} ${hasAny ? (hasPending ? 'has-pending' : 'has-confirmed') : 'empty'}`}>
                            {hasAny ? (
                              <div className="cal-slot-appointments">
                                {apts.map((apt, aIdx) => (
                                  <div key={aIdx} className={`cal-appointment ${apts.length > 1 ? 'multi' : ''}`}>
                                    <div className="cal-apt-info">
                                      <span className="cal-apt-name">{apt.patientName}</span>
                                      <span className="cal-apt-doctor">{apt.doctor ? `👨‍⚕️ ${apt.doctor}` : '⏳ No doctor'}</span>
                                    </div>
                                    {canModifyAppointment(apt) && (
                                      <button
                                        type="button"
                                        className="cal-apt-delete-btn"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteAppointment(apt); }}
                                        title="Delete appointment"
                                      >
                                        🗑️
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="cal-empty">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctors Team - admin only */}
          {isAdmin && doctors.length > 0 && (
            <div className="doctors-section">
              <div className="section-header">
                <h2>👨‍⚕️ Doctors ({doctors.length})</h2>
                <button onClick={() => { setAddDoctorForm({ name: '', specialty: '', password: '', role: 'doctor' }); setShowAddDoctorModal(true); }}
                  className="manage-doctors-btn">
                  ➕ Add Doctor
                </button>
              </div>
              <div className="doctors-grid">
                {doctors.map(doc => (
                  <div key={doc.id} className="doctor-card">
                    <div className="doctor-avatar">👨‍⚕️</div>
                    <div className="doctor-info">
                      <span className="doctor-name">{doc.name}</span>
                      <span className="doctor-specialty">{doc.specialty || 'Physiotherapist'}</span>
                      {doc.role && <span className="doctor-role-badge">{doc.role === 'admin' ? '🔑 Admin' : '👨‍⚕️ Doctor'}</span>}
                    </div>
                    <button className="doctor-delete-btn" onClick={() => handleDeleteDoctor(doc)} title="Remove doctor">
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Database */}
          {confirmedPatients.length > 0 && (
            <div className="confirmed-patients-section">
              <div className="section-header">
                <h2>✅ Patient Database ({confirmedPatients.length} patients)</h2>
              </div>
              <div className="confirmed-patients-list">
                {confirmedPatients.map((patient) => (
                  <div key={patient.id} className="confirmed-patient clickable"
                    onClick={() => handlePatientClick(patient)}>
                    <div className="patient-info">
                      <span className="patient-name">{patient.firstName} {patient.lastName}</span>
                      <span className="patient-email">{patient.email}</span>
                    </div>
                    <div className="patient-stats">
                      <span className="appointment-count">Total: {patient.totalAppointments} appointments</span>
                      <span className="monthly-count">This month: {getCurrentMonthStats(patient)}</span>
                    </div>
                    <div className="patient-dates">
                      <span className="last-appointment">Last: {formatDate(patient.lastAppointmentDate)}</span>
                      <span className="last-service">{getServiceLabel(patient.lastService)}</span>
                    </div>
                    <div className="patient-actions-col">
                      {isAdmin && (
                        <button className="reserve-again-btn"
                          onClick={(e) => handleReserveAgain(patient, e)}
                          title="Book another appointment">
                          🔄 Reserve Again
                        </button>
                      )}
                      {patient.appointments && patient.appointments[0] && canModifyAppointment(patient.appointments[0]) && (
                        <>
                          {isAdmin && (
                            <button className="edit-patient-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                const latestApt = patient.appointments[0];
                                handleEditAppointment({
                                  ...latestApt,
                                  firstName: patient.firstName,
                                  lastName: patient.lastName,
                                  email: patient.email,
                                  phone: patient.phone
                                }, e);
                              }}
                              title="Edit patient info">
                              ✏️ Edit Info
                            </button>
                          )}
                          <button className="delete-booking-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAppointment({
                                ...patient.appointments[0],
                                firstName: patient.firstName,
                                lastName: patient.lastName
                              });
                            }}
                            title="Delete this booking">
                            🗑️ Delete
                          </button>
                        </>
                      )}
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
              <button className="close-btn" onClick={() => setShowPatientDetails(false)}>✖️</button>
            </div>
            <div className="modal-body">
              <div className="patient-summary">
                <h3>{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                <div className="contact-details">
                  <p><strong>📧 Email:</strong> {selectedPatient.email}</p>
                  <p><strong>📞 Phone:</strong> {selectedPatient.phone}</p>
                  <p><strong>📅 Total Appointments:</strong> {selectedPatient.totalAppointments}</p>
                </div>
                {isAdmin && (
                  <button className="reserve-again-btn modal-reserve-btn"
                    onClick={(e) => handleReserveAgain(selectedPatient, e)}>
                    🔄 Reserve Again
                  </button>
                )}
              </div>

              <div className="monthly-stats">
                <h4>📊 Monthly Statistics</h4>
                <div className="monthly-grid">
                  {Object.values(selectedPatient.monthlyStats || {}).map((m, i) => (
                    <div key={i} className="month-stat">
                      <span className="month-name">{m.month}</span>
                      <span className="month-count">{m.count} appointments</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="appointment-history">
                <h4>📅 Appointment History</h4>
                <div className="appointments-timeline">
                  {selectedPatient.appointments.map((apt, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-marker">{i === 0 ? '🟢' : '✅'}</div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-date">{formatDate(apt.date)}</span>
                          <span className="timeline-time">{formatTime(apt.time)}</span>
                          {canModifyAppointment(apt) && (
                            <button
                              type="button"
                              className="timeline-delete-btn"
                              onClick={() => handleDeleteAppointment({ ...apt, firstName: selectedPatient.firstName, lastName: selectedPatient.lastName })}
                              title="Delete this booking"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                        <div className="timeline-details">
                          <p><strong>Service:</strong> {getServiceLabel(apt.service)}</p>
                          <p><strong>Status:</strong> {apt.status}</p>
                          {apt.notes && <p><strong>Notes:</strong> {apt.notes}</p>}
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
              <button className="close-btn" onClick={() => setShowReserveModal(false)}>✖️</button>
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
                  <input type="date" value={reserveForm.date}
                    onChange={(e) => setReserveForm({ ...reserveForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div className="form-group">
                  <label>🕐 Time *</label>
                  <select value={reserveForm.time}
                    onChange={(e) => setReserveForm({ ...reserveForm, time: e.target.value })} required>
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>🏥 Service *</label>
                  <select value={reserveForm.service}
                    onChange={(e) => setReserveForm({ ...reserveForm, service: e.target.value })} required>
                    <option value="">Select a service</option>
                    {Object.entries(SERVICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>👨‍⚕️ Doctor</label>
                  <select value={reserveForm.doctor}
                    onChange={(e) => setReserveForm({ ...reserveForm, doctor: e.target.value })}>
                    <option value="">Select a doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.name}>{doc.name}{doc.specialty ? ` (${doc.specialty})` : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="reserve-actions">
                  <button type="button" className="cancel-reserve-btn"
                    onClick={() => setShowReserveModal(false)}>Cancel</button>
                  <button type="submit" className="submit-reserve-btn" disabled={loading}>
                    {loading ? '🔄 Booking...' : '✅ Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="modal-overlay" onClick={() => setShowAddDoctorModal(false)}>
          <div className="modal-content add-doctor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👨‍⚕️ Add New Doctor</h2>
              <button className="close-btn" onClick={() => setShowAddDoctorModal(false)}>✖️</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddDoctor} className="reserve-form">
                <div className="form-group">
                  <label>👤 Doctor Name *</label>
                  <input type="text" value={addDoctorForm.name}
                    onChange={(e) => setAddDoctorForm({ ...addDoctorForm, name: e.target.value })}
                    placeholder="e.g. Xhavi" required />
                </div>
                <div className="form-group">
                  <label>🔒 Password *</label>
                  <input type="password" value={addDoctorForm.password}
                    onChange={(e) => setAddDoctorForm({ ...addDoctorForm, password: e.target.value })}
                    placeholder="Min 4 characters" required minLength={4} />
                </div>
                <div className="form-group">
                  <label>👔 Role *</label>
                  <select value={addDoctorForm.role}
                    onChange={(e) => setAddDoctorForm({ ...addDoctorForm, role: e.target.value })}>
                    <option value="doctor">Normal Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>🏥 Specialty</label>
                  <input type="text" value={addDoctorForm.specialty}
                    onChange={(e) => setAddDoctorForm({ ...addDoctorForm, specialty: e.target.value })}
                    placeholder="e.g. Physiotherapist" />
                </div>
                <div className="reserve-actions">
                  <button type="button" className="cancel-reserve-btn"
                    onClick={() => setShowAddDoctorModal(false)}>Cancel</button>
                  <button type="submit" className="submit-reserve-btn" disabled={loading}>
                    {loading ? '🔄 Adding...' : '✅ Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Modal */}
      {showManualBookModal && (
        <div className="modal-overlay" onClick={() => setShowManualBookModal(false)}>
          <div className="modal-content manual-book-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Manual Booking</h2>
              <button className="close-btn" onClick={() => setShowManualBookModal(false)}>✖️</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleManualBookSubmit} className="reserve-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>👤 First Name *</label>
                    <input type="text" value={manualBookForm.firstName}
                      onChange={(e) => setManualBookForm({ ...manualBookForm, firstName: e.target.value })}
                      placeholder="First name" required />
                  </div>
                  <div className="form-group">
                    <label>👤 Last Name *</label>
                    <input type="text" value={manualBookForm.lastName}
                      onChange={(e) => setManualBookForm({ ...manualBookForm, lastName: e.target.value })}
                      placeholder="Last name" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>📧 Email *</label>
                    <input type="email" value={manualBookForm.email}
                      onChange={(e) => setManualBookForm({ ...manualBookForm, email: e.target.value })}
                      placeholder="email@example.com" required />
                  </div>
                  <div className="form-group">
                    <label>📞 Phone *</label>
                    <input type="tel" value={manualBookForm.phone}
                      onChange={(e) => setManualBookForm({ ...manualBookForm, phone: e.target.value })}
                      placeholder="+355..." required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>📅 Date *</label>
                    <input type="date" value={manualBookForm.date}
                      onChange={(e) => setManualBookForm({ ...manualBookForm, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="form-group">
                    <label>🕐 Time *</label>
                    <select value={manualBookForm.time}
                      onChange={(e) => setManualBookForm({ ...manualBookForm, time: e.target.value })} required>
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>🏥 Service *</label>
                  <select value={manualBookForm.service}
                    onChange={(e) => setManualBookForm({ ...manualBookForm, service: e.target.value })} required>
                    <option value="">Select a service</option>
                    {Object.entries(SERVICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                {isAdmin ? (
                  <div className="form-group">
                    <label>👨‍⚕️ Doctor</label>
                    <select value={manualBookForm.doctor}
                      onChange={(e) => setManualBookForm({ ...manualBookForm, doctor: e.target.value })}>
                      <option value="">Select a doctor</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.name}>{doc.name}{doc.specialty ? ` (${doc.specialty})` : ''}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>👨‍⚕️ Doctor</label>
                    <input type="text" value={manualBookForm.doctor || doctorName} readOnly disabled
                      style={{ opacity: 0.8 }} />
                  </div>
                )}
                <div className="form-group">
                  <label>📝 Notes (optional)</label>
                  <textarea value={manualBookForm.notes}
                    onChange={(e) => setManualBookForm({ ...manualBookForm, notes: e.target.value })}
                    placeholder="Any notes about the appointment..."
                    rows="3" />
                </div>
                <div className="reserve-actions">
                  <button type="button" className="cancel-reserve-btn"
                    onClick={() => setShowManualBookModal(false)}>Cancel</button>
                  <button type="submit" className="submit-reserve-btn" disabled={loading}>
                    {loading ? '🔄 Booking...' : '✅ Book & Confirm'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Appointment Modal */}
      {showEditModal && editAppointment && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Edit Appointment</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✖️</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit} className="reserve-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>👤 First Name *</label>
                    <input type="text" value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      required />
                  </div>
                  <div className="form-group">
                    <label>👤 Last Name *</label>
                    <input type="text" value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>📧 Email *</label>
                    <input type="email" value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      required />
                  </div>
                  <div className="form-group">
                    <label>📞 Phone *</label>
                    <input type="tel" value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>📅 Date *</label>
                    <input type="date" value={editForm.date}
                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      required />
                  </div>
                  <div className="form-group">
                    <label>🕐 Time *</label>
                    <select value={editForm.time}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} required>
                      <option value="">Select a time</option>
                      {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>🏥 Service *</label>
                  <select value={editForm.service}
                    onChange={(e) => setEditForm({ ...editForm, service: e.target.value })} required>
                    <option value="">Select a service</option>
                    {Object.entries(SERVICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>📝 Patient Notes</label>
                  <textarea value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Patient notes..."
                    rows="2" />
                </div>
                <div className="form-group">
                  <label>🔒 Admin Notes (only visible to admin)</label>
                  <textarea value={editForm.adminNotes}
                    onChange={(e) => setEditForm({ ...editForm, adminNotes: e.target.value })}
                    placeholder="Private admin notes - diagnoses, treatment plan, etc."
                    rows="3" />
                </div>
                <div className="reserve-actions">
                  <button type="button" className="cancel-reserve-btn"
                    onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="submit-reserve-btn" disabled={loading}>
                    {loading ? '🔄 Saving...' : '💾 Save Changes'}
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
              <button className="close-btn" onClick={() => setShowRescheduleModal(false)}>✖️</button>
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
                  <input type="date" value={rescheduleForm.date}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]} required />
                </div>
                <div className="form-group">
                  <label>🕐 New Time *</label>
                  <select value={rescheduleForm.time}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })} required>
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="reserve-actions">
                  <button type="button" className="cancel-reserve-btn"
                    onClick={() => setShowRescheduleModal(false)}>Cancel</button>
                  <button type="submit" className="submit-reserve-btn" disabled={loading}>
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
