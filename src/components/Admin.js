import React, { useState, useEffect } from 'react';
import { appointmentsAPI, authAPI, localStorageBackup } from '../services/api';

const Admin = ({ t }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [confirmedPatients, setConfirmedPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadPendingAppointments();
      loadConfirmedPatients();
    }
  }, [isAuthenticated]);

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

  const loadPendingAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentsAPI.getAll({ status: 'pending' });
      if (response.success) {
        setPendingAppointments(response.data || []);
      }
    } catch (error) {
      console.warn('Failed to load appointments from API, using localStorage backup:', error);
      // Fallback to localStorage
      const localAppointments = localStorageBackup.getAppointments();
      const pendingOnly = localAppointments.filter(apt => apt.status === 'pending');
      setPendingAppointments(pendingOnly);
    } finally {
      setLoading(false);
    }
  };

  const loadConfirmedPatients = () => {
    // Load confirmed patients from localStorage (acts as our patient database)
    const confirmed = JSON.parse(localStorage.getItem('confirmedPatients') || '[]');
    setConfirmedPatients(confirmed);
  };

  const saveConfirmedPatient = (appointment) => {
    // Save to localStorage as our patient database
    const confirmed = JSON.parse(localStorage.getItem('confirmedPatients') || '[]');
    const patientRecord = {
      id: appointment._id || appointment.id,
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      email: appointment.email,
      phone: appointment.phone,
      service: appointment.service,
      confirmedAt: new Date().toISOString(),
      appointments: [appointment]
    };

    // Check if patient already exists
    const existingPatientIndex = confirmed.findIndex(p => 
      p.email === appointment.email || p.phone === appointment.phone
    );

    if (existingPatientIndex !== -1) {
      // Add appointment to existing patient
      confirmed[existingPatientIndex].appointments.push(appointment);
    } else {
      // Add new patient
      confirmed.push(patientRecord);
    }

    localStorage.setItem('confirmedPatients', JSON.stringify(confirmed));
    setConfirmedPatients(confirmed);
  };

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
      
      // Try to update status via API first
      try {
        const response = await appointmentsAPI.updateStatus(appointmentId, 'confirmed');
        if (response.success) {
          console.log('Appointment confirmed via API');
        }
      } catch (apiError) {
        console.warn('API update failed, using localStorage fallback:', apiError);
        // Update localStorage fallback
        localStorageBackup.updateAppointment(appointmentId, { status: 'confirmed' });
      }

      // Save patient to our confirmed patients database
      saveConfirmedPatient({
        ...appointment,
        status: 'confirmed',
        confirmedAt: new Date().toISOString()
      });

      // Remove from pending list
      setPendingAppointments(prev => 
        prev.filter(apt => (apt._id || apt.id) !== appointmentId)
      );

      alert(`✅ Patient ${appointment.firstName} ${appointment.lastName} has been confirmed and registered in the database!`);
      
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
      alert('Failed to confirm appointment. Please try again.');
    } finally {
      setLoading(false);
    }
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
    return timeString.includes(':') ? 
      `${timeString}:00` : 
      timeString;
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
            📋 Appointment Confirmations
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
                <h3>Confirmed Patients</h3>
                <span className="stat-number">{confirmedPatients.length}</span>
              </div>
            </div>
          </div>

          {/* Pending Appointments */}
          <div className="pending-appointments-section">
            <div className="section-header">
              <h2>⏳ Pending Appointments</h2>
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
                      <span className="appointment-status pending">⏳ Pending</span>
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
                      <div className="detail-row">
                        <span className="detail-label">📅 Submitted:</span>
                        <span className="detail-value">
                          {new Date(appointment.createdAt || appointment.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="appointment-actions">
                      <button
                        onClick={() => handleConfirmAppointment(appointment)}
                        className="confirm-btn"
                        disabled={loading}
                      >
                        ✅ Confirm & Register Patient
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmed Patients Summary */}
          {confirmedPatients.length > 0 && (
            <div className="confirmed-patients-section">
              <div className="section-header">
                <h2>✅ Recently Confirmed Patients</h2>
              </div>
              <div className="confirmed-patients-list">
                {confirmedPatients.slice(-5).reverse().map((patient, index) => (
                  <div key={index} className="confirmed-patient">
                    <span className="patient-name">
                      {patient.firstName} {patient.lastName}
                    </span>
                    <span className="patient-service">{patient.service}</span>
                    <span className="patient-date">
                      {new Date(patient.confirmedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {confirmedPatients.length > 5 && (
                  <p className="more-patients">
                    ...and {confirmedPatients.length - 5} more confirmed patients
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin; 