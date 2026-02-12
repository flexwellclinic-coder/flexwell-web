import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/.netlify/functions'
    : 'http://localhost:8888/.netlify/functions',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminAuth');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Admin login
  login: async (username, password) => {
    try {
      const response = await api.post('/auth-login', { username, password });
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('adminToken', response.data.data.token);
        localStorage.setItem('adminAuth', 'true');
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  // Verify token
  verify: async () => {
    try {
      const response = await api.post('/auth-verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Token verification failed' };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminAuth');
  },

  // Get admin profile (using verify endpoint for now)
  getProfile: async () => {
    try {
      const response = await api.post('/auth-verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to get profile' };
    }
  }
};

// Appointments API
export const appointmentsAPI = {
  // Get all appointments with optional filtering
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/appointments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch appointments' };
    }
  },

  // Get single appointment by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch appointment' };
    }
  },

  // Create new appointment
  create: async (appointmentData) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to create appointment' };
    }
  },

  // Update appointment
  update: async (id, appointmentData) => {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update appointment' };
    }
  },

  // Delete appointment
  delete: async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to delete appointment' };
    }
  },

  // Update appointment status (uses PUT since Netlify functions handle PUT)
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/appointments/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update status' };
    }
  },

  // Get available time slots for a date
  getAvailableSlots: async (date) => {
    try {
      const response = await api.get(`/available-slots/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch available slots' };
    }
  }
};

// Notification API
export const notificationAPI = {
  // Send email notification for new appointment
  sendAppointmentNotification: async (appointmentData) => {
    try {
      const response = await api.post('/send-notification', appointmentData);
      return response.data;
    } catch (error) {
      console.warn('Email notification failed (non-blocking):', error.message);
      return { success: false, message: 'Notification failed' };
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Health check failed' };
  }
};

// Fallback for localStorage (if server is down)
export const localStorageBackup = {
  getAppointments: () => {
    try {
      return JSON.parse(localStorage.getItem('appointments') || '[]');
    } catch (error) {
      console.error('Failed to parse appointments from localStorage:', error);
      return [];
    }
  },
  
  saveAppointments: (appointments) => {
    try {
      localStorage.setItem('appointments', JSON.stringify(appointments));
      return true;
    } catch (error) {
      console.error('Failed to save appointments to localStorage:', error);
      return false;
    }
  },
  
  addAppointment: (appointment) => {
    try {
      const appointments = localStorageBackup.getAppointments();
      const newAppointment = {
        ...appointment,
        _id: appointment._id || Date.now().toString(),
        id: appointment.id || Date.now().toString(),
        status: appointment.status || 'pending',
        createdAt: appointment.createdAt || new Date().toISOString()
      };
      appointments.push(newAppointment);
      const success = localStorageBackup.saveAppointments(appointments);
      return success ? newAppointment : null;
    } catch (error) {
      console.error('Failed to add appointment:', error);
      return null;
    }
  },
  
  updateAppointment: (id, updates) => {
    try {
      const appointments = localStorageBackup.getAppointments();
      const index = appointments.findIndex(apt => 
        apt._id === id || apt.id === id || 
        apt._id === id.toString() || apt.id === id.toString()
      );
      
      if (index !== -1) {
        appointments[index] = { 
          ...appointments[index], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        const success = localStorageBackup.saveAppointments(appointments);
        console.log(`📝 Updated appointment ${id} with status: ${updates.status || 'N/A'} - Success: ${success}`);
        return success;
      } else {
        console.warn(`⚠️ Appointment ${id} not found in localStorage`);
        return false;
      }
    } catch (error) {
      console.error('Failed to update appointment:', error);
      return false;
    }
  },
  
  deleteAppointment: (id) => {
    try {
      const appointments = localStorageBackup.getAppointments();
      const filtered = appointments.filter(apt => 
        apt._id !== id && apt.id !== id &&
        apt._id !== id.toString() && apt.id !== id.toString()
      );
      const success = localStorageBackup.saveAppointments(filtered);
      console.log(`🗑️ Deleted appointment ${id} - Success: ${success}`);
      return success;
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      return false;
    }
  },

  // Get appointments by status
  getAppointmentsByStatus: (status) => {
    try {
      const appointments = localStorageBackup.getAppointments();
      return appointments.filter(apt => 
        apt.status === status || (!apt.status && status === 'pending')
      );
    } catch (error) {
      console.error('Failed to get appointments by status:', error);
      return [];
    }
  },

  // Clear confirmed appointments from pending list
  removeConfirmedFromPending: () => {
    try {
      const appointments = localStorageBackup.getAppointments();
      const pendingOnly = appointments.filter(apt => 
        apt.status === 'pending' || !apt.status
      );
      const success = localStorageBackup.saveAppointments(pendingOnly);
      console.log(`🧹 Cleaned up confirmed appointments - Success: ${success}`);
      return success;
    } catch (error) {
      console.error('Failed to clean up appointments:', error);
      return false;
    }
  }
};

export default api; 