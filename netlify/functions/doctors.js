const { neon } = require('@netlify/neon');
const bcrypt = require('bcryptjs');

const sql = neon();

const initDoctorsTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS doctors (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      specialty VARCHAR(100) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try { await sql`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`; } catch (e) {}
  try { await sql`ALTER TABLE doctors ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'doctor'`; } catch (e) {}

  // Seed default doctors if table is empty
  const count = await sql`SELECT COUNT(*) as count FROM doctors`;
  if (parseInt(count[0].count) === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await sql`INSERT INTO doctors (id, name, specialty, password_hash, role) VALUES ('doc-paola', 'Paola', 'Physiotherapist', ${hash}, 'doctor')`;
    await sql`INSERT INTO doctors (id, name, specialty, password_hash, role) VALUES ('doc-denis', 'Denis', 'Physiotherapist', ${hash}, 'doctor')`;
  }
};

exports.handler = async (event) => {
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
    await initDoctorsTable();

    // GET - list all doctors (never return password_hash)
    if (event.httpMethod === 'GET') {
      const doctors = await sql`SELECT id, name, specialty, role, created_at as "createdAt" FROM doctors ORDER BY created_at ASC`;
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ success: true, data: doctors })
      };
    }

    // POST - create, delete, or login
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);

      // LOGIN - doctor login by name + password
      if (data.action === 'login') {
        const { name, password } = data;
        if (!name || !password) {
          return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Name and password required' }) };
        }
        const rows = await sql`SELECT id, name, specialty, password_hash, role FROM doctors WHERE LOWER(name) = LOWER(${name})`;
        if (rows.length === 0) {
          return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid credentials' }) };
        }
        const doc = rows[0];
        if (!doc.password_hash) {
          return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid credentials' }) };
        }
        const match = await bcrypt.compare(password, doc.password_hash);
        if (!match) {
          return { statusCode: 401, headers, body: JSON.stringify({ success: false, message: 'Invalid credentials' }) };
        }
        return {
          statusCode: 200, headers,
          body: JSON.stringify({
            success: true,
            data: { type: 'doctor', id: doc.id, name: doc.name, role: doc.role || 'doctor' }
          })
        };
      }

      // DELETE doctor
      if (data.action === 'delete') {
        const { id } = data;
        const existing = await sql`SELECT id FROM doctors WHERE id = ${id}`;
        if (existing.length === 0) {
          return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'Doctor not found' }) };
        }
        await sql`DELETE FROM doctors WHERE id = ${id}`;
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Doctor deleted' }) };
      }

      // CREATE doctor
      const { name, specialty, password, role } = data;
      if (!name) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Doctor name is required' }) };
      }
      if (!password || password.length < 4) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Password must be at least 4 characters' }) };
      }
      const roleVal = role === 'admin' ? 'admin' : 'doctor';

      const passwordHash = await bcrypt.hash(password, 10);
      const id = 'doc-' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
      await sql`INSERT INTO doctors (id, name, specialty, password_hash, role) VALUES (${id}, ${name}, ${specialty || ''}, ${passwordHash}, ${roleVal})`;

      const newDoctor = await sql`SELECT id, name, specialty, role, created_at as "createdAt" FROM doctors WHERE id = ${id}`;
      return {
        statusCode: 201, headers,
        body: JSON.stringify({ success: true, data: newDoctor[0], message: 'Doctor created' })
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  } catch (error) {
    console.error('Doctors error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: error.message }) };
  }
};
