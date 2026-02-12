const { neon } = require('@netlify/neon');

// Initialize Neon database connection
const sql = neon(process.env.NETLIFY_DATABASE_URL);

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

// Initialize database table if it doesn't exist
const initializeDatabase = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(10) NOT NULL,
        service VARCHAR(50) NOT NULL,
        notes TEXT,
        admin_notes TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_appointments_date_time 
      ON appointments(date, time)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_appointments_status 
      ON appointments(status)
    `;
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

const isSlotAvailable = async (date, time, excludeId = null) => {
  try {
    let result;
    if (excludeId) {
      result = await sql`
        SELECT COUNT(*) as count 
        FROM appointments 
        WHERE date = ${date} 
        AND time = ${time} 
        AND id != ${excludeId}
        AND status IN ('pending', 'confirmed')
      `;
    } else {
      result = await sql`
        SELECT COUNT(*) as count 
        FROM appointments 
        WHERE date = ${date} 
        AND time = ${time} 
        AND status IN ('pending', 'confirmed')
      `;
    }
    
    return parseInt(result[0].count) === 0;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    return false;
  }
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
    // Initialize database
    await initializeDatabase();
    
    const method = event.httpMethod;

    // GET - List all appointments
    if (method === 'GET') {
      const appointments = await sql`
        SELECT 
          id as _id,
          id,
          first_name as "firstName",
          last_name as "lastName",
          email,
          phone,
          date,
          time,
          service,
          notes,
          admin_notes as "adminNotes",
          status,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM appointments 
        ORDER BY created_at DESC
      `;

      const stats = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM appointments
      `;

      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          success: true,
          data: appointments,
          stats: {
            total: parseInt(stats[0].total),
            pending: parseInt(stats[0].pending),
            confirmed: parseInt(stats[0].confirmed),
            completed: parseInt(stats[0].completed)
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
        
        // Check if appointment exists
        const existing = await sql`
          SELECT * FROM appointments WHERE id = ${id}
        `;
        
        if (existing.length === 0) {
          return {
            statusCode: 404, headers,
            body: JSON.stringify({ success: false, message: 'Appointment not found' })
          };
        }

        const appointment = existing[0];
        
        // Check slot availability if changing date/time
        if ((updates.date && updates.date !== appointment.date) || (updates.time && updates.time !== appointment.time)) {
          const newDate = updates.date || appointment.date;
          const newTime = updates.time || appointment.time;
          
          const available = await isSlotAvailable(newDate, newTime, id);
          if (!available) {
            return {
              statusCode: 400, headers,
              body: JSON.stringify({ success: false, message: 'This time slot is already booked. Please choose another time.' })
            };
          }
        }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        
        if (updates.firstName) {
          updateFields.push('first_name = $' + (updateFields.length + 1));
          updateValues.push(updates.firstName);
        }
        if (updates.lastName) {
          updateFields.push('last_name = $' + (updateFields.length + 1));
          updateValues.push(updates.lastName);
        }
        if (updates.email) {
          updateFields.push('email = $' + (updateFields.length + 1));
          updateValues.push(updates.email);
        }
        if (updates.phone) {
          updateFields.push('phone = $' + (updateFields.length + 1));
          updateValues.push(updates.phone);
        }
        if (updates.date) {
          updateFields.push('date = $' + (updateFields.length + 1));
          updateValues.push(updates.date);
        }
        if (updates.time) {
          updateFields.push('time = $' + (updateFields.length + 1));
          updateValues.push(updates.time);
        }
        if (updates.service) {
          updateFields.push('service = $' + (updateFields.length + 1));
          updateValues.push(updates.service);
        }
        if (updates.notes !== undefined) {
          updateFields.push('notes = $' + (updateFields.length + 1));
          updateValues.push(updates.notes);
        }
        if (updates.adminNotes !== undefined) {
          updateFields.push('admin_notes = $' + (updateFields.length + 1));
          updateValues.push(updates.adminNotes);
        }
        if (updates.status) {
          updateFields.push('status = $' + (updateFields.length + 1));
          updateValues.push(updates.status);
        }
        
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);

        await sql`
          UPDATE appointments 
          SET ${sql.unsafe(updateFields.join(', '))}
          WHERE id = ${id}
        `;

        const updatedAppointment = await sql`
          SELECT 
            id as _id,
            id,
            first_name as "firstName",
            last_name as "lastName",
            email,
            phone,
            date,
            time,
            service,
            notes,
            admin_notes as "adminNotes",
            status,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM appointments 
          WHERE id = ${id}
        `;

        return {
          statusCode: 200, headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Appointment updated successfully', 
            data: updatedAppointment[0] 
          })
        };
      }

      // DELETE operation
      if (data.action === 'delete') {
        const { id } = data;
        
        const result = await sql`
          DELETE FROM appointments WHERE id = ${id}
        `;
        
        if (result.count === 0) {
          return {
            statusCode: 404, headers,
            body: JSON.stringify({ success: false, message: 'Appointment not found' })
          };
        }

        return {
          statusCode: 200, headers,
          body: JSON.stringify({ success: true, message: 'Appointment deleted successfully' })
        };
      }

      // CREATE operation (default)
      validateAppointment(data);
      
      const available = await isSlotAvailable(data.date, data.time);
      if (!available) {
        return {
          statusCode: 400, headers,
          body: JSON.stringify({ success: false, message: 'This time slot is already booked' })
        };
      }

      const appointmentId = generateId();
      
      await sql`
        INSERT INTO appointments (
          id, first_name, last_name, email, phone, date, time, 
          service, notes, admin_notes, status
        ) VALUES (
          ${appointmentId},
          ${data.firstName},
          ${data.lastName},
          ${data.email},
          ${data.phone},
          ${data.date},
          ${data.time},
          ${data.service},
          ${data.notes || ''},
          ${data.adminNotes || ''},
          ${data.status || 'pending'}
        )
      `;

      const newAppointment = await sql`
        SELECT 
          id as _id,
          id,
          first_name as "firstName",
          last_name as "lastName",
          email,
          phone,
          date,
          time,
          service,
          notes,
          admin_notes as "adminNotes",
          status,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM appointments 
        WHERE id = ${appointmentId}
      `;

      return {
        statusCode: 201, headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Appointment created successfully', 
          data: newAppointment[0] 
        })
      };
    }

    return {
      statusCode: 405, headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };

  } catch (error) {
    console.error('Neon database error:', error);
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};