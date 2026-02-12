const { getStore } = require('@netlify/blobs');

// Initialize Netlify Blobs store
const getAppointmentStore = () => getStore('appointments');

// Helper functions
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const validateAppointment = (data) => {
  const required = ['firstName', 'lastName', 'email', 'phone', 'date', 'time', 'service'];
  const missing = required.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  const validTimes = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  if (!validTimes.includes(data.time)) {
    throw new Error('Invalid time slot');
  }
  
  const validServices = ['initial-consultation', 'manual-therapy', 'exercise-therapy', 'sports-rehab', 'womens-health'];
  if (!validServices.includes(data.service)) {
    throw new Error('Invalid service type');
  }
};

const getAllAppointments = async () => {
  try {
    const store = getAppointmentStore();
    const appointmentsData = await store.get('all-appointments');
    return appointmentsData ? JSON.parse(appointmentsData) : [];
  } catch (error) {
    console.error('Error getting appointments:', error);
    return [];
  }
};

const saveAllAppointments = async (appointments) => {
  try {
    const store = getAppointmentStore();
    await store.set('all-appointments', JSON.stringify(appointments));
    return true;
  } catch (error) {
    console.error('Error saving appointments:', error);
    return false;
  }
};

const isSlotAvailable = (appointments, date, time, excludeId = null) => {
  return !appointments.some(apt => 
    apt._id !== excludeId && 
    apt.date === date && 
    apt.time === time && 
    (apt.status === 'pending' || apt.status === 'confirmed')
  );
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const method = event.httpMethod;
    const appointments = await getAllAppointments();

    // GET - List all appointments
    if (method === 'GET') {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          success: true,
          data: appointments,
          stats: {
            total: appointments.length,
            pending: appointments.filter(a => a.status === 'pending').length,
            confirmed: appointments.filter(a => a.status === 'confirmed').length,
            completed: appointments.filter(a => a.status === 'completed').length
          }
        })
      };
    }

    // POST - Handle different operations
    if (method === 'POST') {
      const data = JSON.parse(event.body);

      // UPDATE operation
      if (data.action === 'update') {
        const { id, ...updates } = data;
        const appointmentIndex = appointments.findIndex(a => a._id === id);
        
        if (appointmentIndex === -1) {
          return {
            statusCode: 404, headers,
            body: JSON.stringify({ success: false, message: 'Appointment not found' })
          };
        }

        const appointment = appointments[appointmentIndex];
        
        // Check slot availability if changing date/time
        if ((updates.date && updates.date !== appointment.date) || (updates.time && updates.time !== appointment.time)) {
          const newDate = updates.date || appointment.date;
          const newTime = updates.time || appointment.time;
          
          if (!isSlotAvailable(appointments, newDate, newTime, id)) {
            return {
              statusCode: 400, headers,
              body: JSON.stringify({ success: false, message: 'This time slot is already booked. Please choose another time.' })
            };
          }
        }

        // Update appointment
        appointments[appointmentIndex] = {
          ...appointment,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        await saveAllAppointments(appointments);

        return {
          statusCode: 200, headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Appointment updated successfully', 
            data: appointments[appointmentIndex] 
          })
        };
      }

      // DELETE operation
      if (data.action === 'delete') {
        const { id } = data;
        const appointmentIndex = appointments.findIndex(a => a._id === id);
        
        if (appointmentIndex === -1) {
          return {
            statusCode: 404, headers,
            body: JSON.stringify({ success: false, message: 'Appointment not found' })
          };
        }

        appointments.splice(appointmentIndex, 1);
        await saveAllAppointments(appointments);

        return {
          statusCode: 200, headers,
          body: JSON.stringify({ success: true, message: 'Appointment deleted successfully' })
        };
      }

      // CREATE operation (default)
      validateAppointment(data);
      
      if (!isSlotAvailable(appointments, data.date, data.time)) {
        return {
          statusCode: 400, headers,
          body: JSON.stringify({ success: false, message: 'This time slot is already booked' })
        };
      }

      const appointment = {
        _id: generateId(),
        id: generateId(),
        ...data,
        status: data.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      appointments.push(appointment);
      await saveAllAppointments(appointments);

      return {
        statusCode: 201, headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Appointment created successfully', 
          data: appointment 
        })
      };
    }

    return {
      statusCode: 405, headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Netlify appointments error:', error);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};