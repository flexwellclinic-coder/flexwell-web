const { neon } = require('@netlify/neon');

const sql = neon();

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Store as integer YYYYMMDD - no parsing, no timezone, bulletproof
const toDateInt = (d) => {
  if (!d) return null;
  const s = String(d).split('T')[0];
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? parseInt(m[1] + m[2] + m[3], 10) : null;
};

const fromDateInt = (n) => {
  if (n == null || n === '') return '';
  const s = String(n);
  if (s.length !== 8) return '';
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
};

const validateAppointment = (data) => {
  const required = ['firstName', 'lastName', 'email', 'phone', 'date', 'time', 'service'];
  const missing = required.filter(field => !data[field]);
  if (missing.length > 0) throw new Error(`Missing required fields: ${missing.join(', ')}`);
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
        date_int INTEGER,
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
    
    try { await sql`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS date_int INTEGER`; } catch (e) {}
    try { await sql`ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctor VARCHAR(100) DEFAULT ''`; } catch (e) {}
    
    try {
      await sql`UPDATE appointments SET date_int = CAST(REPLACE(SUBSTRING(COALESCE(date::text, '') FROM 1 FOR 10), '-', '') AS INTEGER) WHERE date_int IS NULL AND LENGTH(COALESCE(date::text, '')) >= 10`;
    } catch (e) {}
    
    try { await sql`CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status)`; } catch (e) {}
    return true;
  } catch (error) {
    console.error('DB init error:', error);
    return false;
  }
};

const rowWithDate = (r) => {
  const d = r.date_int != null ? fromDateInt(r.date_int) : (r.date ? String(r.date).split('T')[0] : '');
  const { date_int, date, ...rest } = r;
  return { ...rest, date: d };
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    await initializeDatabase();
    const method = event.httpMethod;

    if (method === 'GET') {
      const raw = await sql`
        SELECT id as _id, id, first_name as "firstName", last_name as "lastName",
          email, phone, date_int, time, service, notes, admin_notes as "adminNotes",
          doctor, status, created_at as "createdAt", updated_at as "updatedAt"
        FROM appointments ORDER BY created_at DESC
      `;
      const appointments = raw.map(rowWithDate);

      const stats = await sql`
        SELECT COUNT(*) as total,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM appointments
      `;

      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          success: true, data: appointments,
          stats: {
            total: parseInt(stats[0].total),
            pending: parseInt(stats[0].pending),
            confirmed: parseInt(stats[0].confirmed),
            completed: parseInt(stats[0].completed)
          }
        })
      };
    }

    if (method === 'POST') {
      const data = JSON.parse(event.body);

      if (data.action === 'update') {
        const { id, action, ...updates } = data;
        const existing = await sql`SELECT id FROM appointments WHERE id = ${id}`;
        if (existing.length === 0) return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Not found' }) };

        if (updates.firstName) await sql`UPDATE appointments SET first_name = ${updates.firstName} WHERE id = ${id}`;
        if (updates.lastName) await sql`UPDATE appointments SET last_name = ${updates.lastName} WHERE id = ${id}`;
        if (updates.email) await sql`UPDATE appointments SET email = ${updates.email} WHERE id = ${id}`;
        if (updates.phone) await sql`UPDATE appointments SET phone = ${updates.phone} WHERE id = ${id}`;
        if (updates.date) await sql`UPDATE appointments SET date_int = ${toDateInt(updates.date)} WHERE id = ${id}`;
        if (updates.time) await sql`UPDATE appointments SET time = ${updates.time} WHERE id = ${id}`;
        if (updates.service) await sql`UPDATE appointments SET service = ${updates.service} WHERE id = ${id}`;
        if (updates.notes !== undefined) await sql`UPDATE appointments SET notes = ${updates.notes} WHERE id = ${id}`;
        if (updates.adminNotes !== undefined) await sql`UPDATE appointments SET admin_notes = ${updates.adminNotes} WHERE id = ${id}`;
        if (updates.status) await sql`UPDATE appointments SET status = ${updates.status} WHERE id = ${id}`;
        if (updates.doctor !== undefined) await sql`UPDATE appointments SET doctor = ${updates.doctor} WHERE id = ${id}`;
        await sql`UPDATE appointments SET updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`;

        const [updated] = await sql`
          SELECT id as _id, id, first_name as "firstName", last_name as "lastName",
            email, phone, date_int, time, service, notes, admin_notes as "adminNotes",
            doctor, status, created_at as "createdAt", updated_at as "updatedAt"
          FROM appointments WHERE id = ${id}
        `;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Updated', data: rowWithDate(updated) }) };
      }

      if (data.action === 'delete') {
        const { id } = data;
        const existing = await sql`SELECT id FROM appointments WHERE id = ${id}`;
        if (existing.length === 0) return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Not found' }) };
        await sql`DELETE FROM appointments WHERE id = ${id}`;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Deleted' }) };
      }

      validateAppointment(data);
      const appointmentId = generateId();
      const dateInt = toDateInt(data.date);
      const dateStr = fromDateInt(dateInt);
      if (dateInt == null) throw new Error('Invalid date format');

      try {
        await sql`
          INSERT INTO appointments (id, first_name, last_name, email, phone, date_int, time, service, notes, admin_notes, doctor, status)
          VALUES (${appointmentId}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone}, ${dateInt}, ${data.time}, ${data.service}, ${data.notes || ''}, ${data.adminNotes || ''}, ${data.doctor || ''}, ${data.status || 'pending'})
        `;
      } catch (e) {
        await sql`
          INSERT INTO appointments (id, first_name, last_name, email, phone, date, time, service, notes, admin_notes, doctor, status)
          VALUES (${appointmentId}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone}, ${dateStr}, ${data.time}, ${data.service}, ${data.notes || ''}, ${data.adminNotes || ''}, ${data.doctor || ''}, ${data.status || 'pending'})
        `;
      }

      const [created] = await sql`
        SELECT id as _id, id, first_name as "firstName", last_name as "lastName",
          email, phone, date_int, time, service, notes, admin_notes as "adminNotes",
          doctor, status, created_at as "createdAt", updated_at as "updatedAt"
        FROM appointments WHERE id = ${appointmentId}
      `;
      return { statusCode: 201, headers, body: JSON.stringify({ success: true, message: 'Created', data: rowWithDate(created) }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  } catch (error) {
    console.error('Neon error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: error.message }) };
  }
};
