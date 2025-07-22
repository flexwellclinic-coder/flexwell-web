import React, { useState, useEffect } from 'react';
import { appointmentsAPI, authAPI, localStorageBackup } from '../services/api';

const Admin = ({ t }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newAppointment, setNewAppointment] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    status: 'confirmed',
    notes: ''
  });

  useEffect(() => {
    checkAuthentication();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated, currentPage, searchTerm, filterDate, filterStatus, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: appointmentsPerPage,
        sortBy,
        sortOrder,
        search: searchTerm,
        status: filterStatus,
        date: filterDate
      };

      const response = await appointmentsAPI.getAll(params);
      if (response.success) {
        setAppointments(response.data);
        setStats(response.stats);
      }
    } catch (error) {
      console.warn('Failed to load appointments from API, using localStorage backup:', error);
      // Fallback to localStorage
      const localAppointments = localStorageBackup.getAppointments();
      setAppointments(localAppointments);
      
      // Calculate local stats
      const localStats = {
        total: localAppointments.length,
        pending: localAppointments.filter(apt => apt.status === 'pending').length,
        confirmed: localAppointments.filter(apt => apt.status === 'confirmed').length,
        completed: localAppointments.filter(apt => apt.status === 'completed').length,
        cancelled: localAppointments.filter(apt => apt.status === 'cancelled').length
      };
      setStats(localStats);
    } finally {
      setLoading(false);
    }
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
      const response = await authAPI.login({ username, password });
      
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
    // Frontend-only logout for production
    if (process.env.NODE_ENV === 'production') {
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      setAppointments([]);
      return;
    }

    // API logout for development
    authAPI.logout();
    setIsAuthenticated(false);
    setAppointments([]);
  };

  const refreshAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAll();
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.warn('Failed to refresh appointments:', error);
      // Keep current state if refresh fails
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const appointmentData = {
        ...newAppointment,
        createdBy: 'admin'
      };
      
      const response = await appointmentsAPI.create(appointmentData);
      if (response.success) {
        await refreshAppointments();
        setNewAppointment({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          service: '',
          status: 'confirmed',
          notes: ''
        });
        setShowAddForm(false);
        alert('Appointment created successfully!');
      }
    } catch (error) {
      console.error('Failed to create appointment:', error);
      alert(error.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setNewAppointment(appointment);
    setShowAddForm(true);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const appointmentId = editingAppointment._id || editingAppointment.id;
      const response = await appointmentsAPI.update(appointmentId, newAppointment);
      
      if (response.success) {
        await refreshAppointments();
        setEditingAppointment(null);
        setNewAppointment({
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          service: '',
          status: 'confirmed',
          notes: ''
        });
        setShowAddForm(false);
        alert('Appointment updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      alert(error.message || 'Failed to update appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setLoading(true);
      
      try {
        const appointmentId = id._id || id;
        const response = await appointmentsAPI.delete(appointmentId);
        
        if (response.success) {
          await refreshAppointments();
          alert('Appointment deleted successfully!');
        }
      } catch (error) {
        console.error('Failed to delete appointment:', error);
        alert(error.message || 'Failed to delete appointment');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const appointmentId = id._id || id;
      const response = await appointmentsAPI.updateStatus(appointmentId, newStatus);
      
      if (response.success) {
        await refreshAppointments();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error.message || 'Failed to update status');
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'completed': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getServiceName = (service) => {
    const services = {
      'initial-consultation': 'Initial Consultation',
      'manual-therapy': 'Manual Therapy',
      'exercise-therapy': 'Exercise Therapy',
      'sports-rehab': 'Sports Rehabilitation',
      'womens-health': 'Women\'s Health'
    };
    return services[service] || service;
  };

  // Pagination logic
  const totalPages = Math.ceil(stats.total / appointmentsPerPage);
  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const endIndex = Math.min(startIndex + appointmentsPerPage, stats.total);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterDate('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <div className="login-header">
            <h1>Flex Well Admin Panel</h1>
            <p>Enter password to access appointment management</p>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-message" style={{ color: '#ef4444', marginBottom: '16px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Enter username"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="admin-container">
          <div className="admin-title">
            <h1>Flex Well Admin Panel</h1>
            <p>Appointment Management System</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-container">
          {/* Statistics */}
          <div className="admin-stats">
            <div className="stat-card total">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Appointments</h3>
                <span className="stat-number">{stats.total}</span>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pending</h3>
                <span className="stat-number">{stats.pending}</span>
              </div>
            </div>
            <div className="stat-card confirmed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Confirmed</h3>
                <span className="stat-number">{stats.confirmed}</span>
              </div>
            </div>
            <div className="stat-card completed">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>Completed</h3>
                <span className="stat-number">{stats.completed}</span>
              </div>
            </div>
            <div className="stat-card cancelled">
              <div className="stat-icon">❌</div>
              <div className="stat-content">
                <h3>Cancelled</h3>
                <span className="stat-number">{stats.cancelled}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="admin-controls">
            <div className="filters-section">
              <div className="search-group">
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>

              <div className="filter-group">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="filter-date"
                  title="Filter by date"
                />

                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="sort-select"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="date-asc">Date (Earliest)</option>
                  <option value="date-desc">Date (Latest)</option>
                  <option value="firstName-asc">Name (A-Z)</option>
                  <option value="firstName-desc">Name (Z-A)</option>
                  <option value="status-asc">Status (A-Z)</option>
                </select>

                <button 
                  onClick={clearAllFilters}
                  className="clear-filters-btn"
                  title="Clear all filters"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="action-group">
              <button 
                onClick={() => loadAppointments()}
                className="refresh-btn"
                disabled={loading}
                title="Refresh appointments"
              >
                {loading ? '🔄' : '↻'} Refresh
              </button>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="add-appointment-btn"
                disabled={loading}
              >
                {showAddForm ? '❌ Cancel' : '➕ Add New Appointment'}
              </button>
            </div>
          </div>

          {/* Add/Edit Appointment Form */}
          {showAddForm && (
            <div className="appointment-form-container">
              <h3>{editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}</h3>
              <form onSubmit={editingAppointment ? handleUpdateAppointment : handleAddAppointment} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={newAppointment.firstName}
                      onChange={(e) => setNewAppointment({...newAppointment, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={newAppointment.lastName}
                      onChange={(e) => setNewAppointment({...newAppointment, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={newAppointment.email}
                      onChange={(e) => setNewAppointment({...newAppointment, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={newAppointment.phone}
                      onChange={(e) => setNewAppointment({...newAppointment, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <select
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                      required
                    >
                      <option value="">Select time</option>
                      <option value="9:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Service</label>
                    <select
                      value={newAppointment.service}
                      onChange={(e) => setNewAppointment({...newAppointment, service: e.target.value})}
                      required
                    >
                      <option value="">Select service</option>
                      <option value="initial-consultation">Initial Consultation</option>
                      <option value="manual-therapy">Manual Therapy</option>
                      <option value="exercise-therapy">Exercise Therapy</option>
                      <option value="sports-rehab">Sports Rehabilitation</option>
                      <option value="womens-health">Women's Health</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={newAppointment.status}
                      onChange={(e) => setNewAppointment({...newAppointment, status: e.target.value})}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    rows="3"
                    placeholder="Additional notes..."
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingAppointment(null);
                      setNewAppointment({
                        id: '', firstName: '', lastName: '', email: '', phone: '',
                        date: '', time: '', service: '', status: 'confirmed', notes: ''
                      });
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Appointments List */}
          <div className="appointments-list">
            <div className="list-header">
              <h3>Appointments</h3>
              <div className="pagination-info">
                {stats.total > 0 && (
                  <span>
                    Showing {startIndex + 1}-{endIndex} of {stats.total} appointments
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="loading-appointments">
                <div className="loading-spinner">🔄</div>
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="no-appointments">
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h4>No appointments found</h4>
                  <p>Try adjusting your filters or add a new appointment</p>
                </div>
              </div>
            ) : (
              <>
                <div className="appointments-grid">
                  {appointments.map(appointment => (
                    <div key={appointment._id || appointment.id} className="appointment-card">
                      <div className="card-header">
                        <div className="patient-name">
                          <strong>{appointment.firstName} {appointment.lastName}</strong>
                        </div>
                        <div 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(appointment.status) }}
                        >
                          {appointment.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="card-body">
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
                            <span className="detail-label">⏰ Time:</span>
                            <span className="detail-value">{formatTime(appointment.time)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">🏥 Service:</span>
                            <span className="detail-value">{getServiceName(appointment.service)}</span>
                          </div>
                          {appointment.notes && (
                            <div className="detail-row">
                              <span className="detail-label">📝 Notes:</span>
                              <span className="detail-value">{appointment.notes}</span>
                            </div>
                          )}
                          {appointment.createdAt && (
                            <div className="detail-row">
                              <span className="detail-label">📅 Created:</span>
                              <span className="detail-value">{formatDate(appointment.createdAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="status-update">
                          <label>Status:</label>
                          <select
                            value={appointment.status}
                            onChange={(e) => handleStatusChange(appointment._id || appointment.id, e.target.value)}
                            className="status-select-card"
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="confirmed">✅ Confirmed</option>
                            <option value="completed">🎯 Completed</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                        
                        <div className="card-actions">
                          <button 
                            onClick={() => handleEditAppointment(appointment)}
                            className="edit-btn-card"
                            title="Edit appointment"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(appointment._id || appointment.id)}
                            className="delete-btn-card"
                            title="Delete appointment"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      ← Previous
                    </button>
                    
                    <div className="pagination-numbers">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin; 