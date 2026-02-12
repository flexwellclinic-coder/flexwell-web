const { neon } = require('@netlify/neon');

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

  // Seed default doctors if table is empty
  const count = await sql`SELECT COUNT(*) as count FROM doctors`;
  if (parseInt(count[0].count) === 0) {
    await sql`INSERT INTO doctors (id, name, specialty) VALUES ('doc-paola', 'Paola', 'Physiotherapist')`;
    await sql`INSERT INTO doctors (id, name, specialty) VALUES ('doc-denis', 'Denis', 'Physiotherapist')`;
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

    // GET - list all doctors
    if (event.httpMethod === 'GET') {
      const doctors = await sql`SELECT id, name, specialty, created_at as "createdAt" FROM doctors ORDER BY created_at ASC`;
      return {
        statusCode: 200, headers,
        body: JSON.stringify({ success: true, data: doctors })
      };
    }

    // POST - create or delete
    if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);

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
      const { name, specialty } = data;
      if (!name) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Doctor name is required' }) };
      }

      const id = 'doc-' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
      await sql`INSERT INTO doctors (id, name, specialty) VALUES (${id}, ${name}, ${specialty || ''})`;

      const newDoctor = await sql`SELECT id, name, specialty, created_at as "createdAt" FROM doctors WHERE id = ${id}`;
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
