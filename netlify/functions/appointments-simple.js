// Simple appointments function that works without MongoDB
// Uses Netlify's built-in KV storage or falls back to a simple in-memory store

const appointments = new Map(); // In-memory fallback
let appointmentCounter = 1000;

// Helper to generate ID
const generateId = () => (++appointmentCounter).toString();

// Helper to validate appointment data
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

// Check if time slot is available
const isSlotAvailable = (date, time, excludeId = null) => {
  for (const [id, apt] of appointments) {
    if (id === excludeId) continue;
    if (apt.date === date && apt.time === time && (apt.status === 'pending' || apt.status === 'confirmed')) {
      return false;
    }
  }
  return true;
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
    const path = event.path;
    const method = event.httpMethod;

    // GET /appointments - List all appointments
    if (method === 'GET' && path.includes('/appointments-simple')) {
      const allAppointments = Array.from(appointments.values());
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          success: true,
          data: allAppointments,
          stats: {
            total: allAppointments.length,
            pending: allAppointments.filter(a => a.status === 'pending').length,
            confirmed: allAppointments.filter(a => a.status === 'confirmed').length
          }
        })
      };
    }

    // POST /appointments-simple - Create new appointment
    if (method === 'POST' && path.includes('/appointments-simple')) {
      const data = JSON.parse(event.body);
      
      // Handle different operations based on the action field
      if (data.action === 'update') {
        const { id, ...updates } = data;
        if (!appointments.has(id)) {
          return {
            statusCode: 404, headers,
            body: JSON.stringify({ success: false, message: 'Appointment not found' })
          };
        }

        const appointment = appointments.get(id);
        
        // Check slot availability if changing date/time
        if ((updates.date && updates.date !== appointment.date) || (updates.time && updates.time !== appointment.time)) {
          const newDate = updates.date || appointment.date;
          const newTime = updates.time || appointment.time;
          
          if (!isSlotAvailable(newDate, newTime, id)) {
            return {
              statusCode: 400, headers,
              body: JSON.stringify({ success: false, message: 'This time slot is already booked. Please choose another time.' })
            };
          }
        }

        // Update appointment
        const updated = { ...appointment, ...updates, updatedAt: new Date().toISOString() };
        appointments.set(id, updated);

        return {
          statusCode: 200, headers,
          body: JSON.stringify({ success: true, message: 'Appointment updated', data: updated })
        };
      }

      if (data.action === 'delete') {
        const { id } = data;
        if (!appointments.has(id)) {
          return {
            statusCode: 404, headers,
            body: JSON.stringify({ success: false, message: 'Appointment not found' })
          };
        }
        appointments.delete(id);
        return {
          statusCode: 200, headers,
          body: JSON.stringify({ success: true, message: 'Appointment deleted' })
        };
      }

      // Create new appointment
      validateAppointment(data);
      
      if (!isSlotAvailable(data.date, data.time)) {
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

      appointments.set(appointment._id, appointment);

      return {
        statusCode: 201, headers,
        body: JSON.stringify({ success: true, message: 'Appointment created', data: appointment })
      };
    }

    return {
      statusCode: 404, headers,
      body: JSON.stringify({ success: false, message: 'Endpoint not found' })
    };

  } catch (error) {
    console.error('Simple appointments error:', error);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};