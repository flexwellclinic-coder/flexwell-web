const { neon } = require('@netlify/neon');

const sql = neon();

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Force any date value into YYYY-MM-DD string, no matter what format comes in
const fixDate = (d) => {
  if (!d) return '';
  const s = String(d);
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // Has T (ISO timestamp) - just take the date part
  if (s.includes('T')) return s.split('T')[0];
  // Try parsing but force to UTC to avoid shift
  try {
    const parsed = new Date(s + 'T12:00:00Z');
    const y = parsed.getUTCFullYear();
    const m = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const day = String(parsed.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch (e) {
    return s;
  }
};

// Fix all date fields in an appointment row
const fixRow = (row) => {
  if (!row) return row;
  return { ...row, date: fixDate(row.date) };
};

const validateAppointment = (data) => {
  const required = ['firstName', 'lastName', 'email', 'phone', 'date', 'time', 'service'];
  const missing = required.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
};

const initializeDatabase = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        date VARCHAR(10) NOT NULL,
        time VARCHAR(10) NOT NULL,
        service VARCHAR(50) NOT NULL,
        notes TEXT,
        admin_notes TEXT,
        doctor VARCHAR(100) DEFAULT '',
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Migrate: if date column is still DATE type, convert to VARCHAR
    try {
      await sql`ALTER TABLE appointments ALTER COLUMN date TYPE VARCHAR(10) USING TO_CHAR(date, 'YYYY-MM-DD')`;
    } catch (e) { /* already VARCHAR */ }
    
    try {
      await sql`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor VARCHAR(100) DEFAULT ''`;
    } catch (e) { /* already exists */ }
    
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)`;
    } catch (e) { /* ignore */ }
    
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

const SELECT_FIELDS = `
  id as _id, id,
  first_name as "firstName", last_name as "lastName",
  email, phone,
  CAST(date AS TEXT) as date,
  time, service, notes,
  admin_notes as "adminNotes",
  doctor, status,
  created_at as "createdAt",
  updated_at as "updatedAt"
`;

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
    await initializeDatabase();
    const method = event.httpMethod;

    // GET - List all appointments
    if (method === 'GET') {
      const raw = await sql`
        SELECT 
          id as _id, id,
          first_name as "firstName", last_name as "lastName",
          email, phone,
          CAST(date AS TEXT) as date,
          time, service, notes,
          admin_notes as "adminNotes",
          doctor, status,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM appointments ORDER BY created_at DESC
      `;
      
      // Force-fix every single date
      const appointments = raw.map(fixRow);

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

    // POST
    if (method === 'POST') {
      const data = JSON.parse(event.body);

      // UPDATE
      if (data.action === 'update') {
        const { id, action, ...updates } = data;
        
        const existing = await sql`SELECT id FROM appointments WHERE id = ${id}`;
        if (existing.length === 0) {
          return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Appointment not found' }) };
        }

        if (updates.firstName) await sql`UPDATE appointments SET first_name = ${updates.firstName} WHERE id = ${id}`;
        if (updates.lastName) await sql`UPDATE appointments SET last_name = ${updates.lastName} WHERE id = ${id}`;
        if (updates.email) await sql`UPDATE appointments SET email = ${updates.email} WHERE id = ${id}`;
        if (updates.phone) await sql`UPDATE appointments SET phone = ${updates.phone} WHERE id = ${id}`;
        if (updates.date) await sql`UPDATE appointments SET date = ${fixDate(updates.date)} WHERE id = ${id}`;
        if (updates.time) await sql`UPDATE appointments SET time = ${updates.time} WHERE id = ${id}`;
        if (updates.service) await sql`UPDATE appointments SET service = ${updates.service} WHERE id = ${id}`;
        if (updates.notes !== undefined) await sql`UPDATE appointments SET notes = ${updates.notes} WHERE id = ${id}`;
        if (updates.adminNotes !== undefined) await sql`UPDATE appointments SET admin_notes = ${updates.adminNotes} WHERE id = ${id}`;
        if (updates.status) await sql`UPDATE appointments SET status = ${updates.status} WHERE id = ${id}`;
        if (updates.doctor !== undefined) await sql`UPDATE appointments SET doctor = ${updates.doctor} WHERE id = ${id}`;
        await sql`UPDATE appointments SET updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;

        const updated = await sql`
          SELECT 
            id as _id, id,
            first_name as "firstName", last_name as "lastName",
            email, phone,
            CAST(date AS TEXT) as date,
            time, service, notes,
            admin_notes as "adminNotes",
            doctor, status,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM appointments WHERE id = ${id}
        `;

        return {
          statusCode: 200, headers,
          body: JSON.stringify({ success: true, message: 'Appointment updated successfully', data: fixRow(updated[0]) })
        };
      }

      // DELETE
      if (data.action === 'delete') {
        const { id } = data;
        const existing = await sql`SELECT id FROM appointments WHERE id = ${id}`;
        if (existing.length === 0) {
          return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Appointment not found' }) };
        }
        await sql`DELETE FROM appointments WHERE id = ${id}`;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Appointment deleted successfully' }) };
      }

      // CREATE
      validateAppointment(data);
      const appointmentId = generateId();
      const safeDate = fixDate(data.date);
      
      await sql`
        INSERT INTO appointments (id, first_name, last_name, email, phone, date, time, service, notes, admin_notes, doctor, status)
        VALUES (${appointmentId}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone}, ${safeDate}, ${data.time}, ${data.service}, ${data.notes || ''}, ${data.adminNotes || ''}, ${data.doctor || ''}, ${data.status || 'pending'})
      `;

      const created = await sql`
        SELECT 
          id as _id, id,
          first_name as "firstName", last_name as "lastName",
          email, phone,
          CAST(date AS TEXT) as date,
          time, service, notes,
          admin_notes as "adminNotes",
          doctor, status,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM appointments WHERE id = ${appointmentId}
      `;

      return {
        statusCode: 201, headers,
        body: JSON.stringify({ success: true, message: 'Appointment created successfully', data: fixRow(created[0]) })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };

  } catch (error) {
    console.error('Neon database error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: error.message }) };
  }
};
