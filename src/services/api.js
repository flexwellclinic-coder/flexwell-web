import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api',
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
      const response = await api.post('/auth/login', { username, password });
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
      const response = await api.post('/auth/verify');
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

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
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

  // Update appointment status
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to update status' };
    }
  },

  // Get available time slots for a date
  getAvailableSlots: async (date) => {
    try {
      const response = await api.get(`/appointments/available/${date}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch available slots' };
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
    return JSON.parse(localStorage.getItem('appointments') || '[]');
  },
  
  saveAppointments: (appointments) => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  },
  
  addAppointment: (appointment) => {
    const appointments = localStorageBackup.getAppointments();
    const newAppointment = {
      ...appointment,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    appointments.push(newAppointment);
    localStorageBackup.saveAppointments(appointments);
    return newAppointment;
  },
  
  updateAppointment: (id, updates) => {
    const appointments = localStorageBackup.getAppointments();
    const index = appointments.findIndex(apt => apt._id === id || apt.id === id);
    if (index !== -1) {
      appointments[index] = { ...appointments[index], ...updates, updatedAt: new Date().toISOString() };
      localStorageBackup.saveAppointments(appointments);
      return appointments[index];
    }
    return null;
  },
  
  deleteAppointment: (id) => {
    const appointments = localStorageBackup.getAppointments();
    const filtered = appointments.filter(apt => apt._id !== id && apt.id !== id);
    localStorageBackup.saveAppointments(filtered);
    return true;
  }
};

export default api; 