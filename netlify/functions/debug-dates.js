const { neon } = require('@netlify/neon');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const sql = neon();
    
    // Check column type
    const colInfo = await sql`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'appointments' AND column_name = 'date'
    `;

    // Get raw data from first 5 appointments
    const raw = await sql`SELECT id, date, time, first_name FROM appointments LIMIT 5`;
    
    // Get server timezone
    const tz = await sql`SHOW timezone`;
    
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        timezone: tz,
        column_info: colInfo,
        raw_appointments: raw,
        note: 'Check if date column is VARCHAR(10) and dates are YYYY-MM-DD strings'
      }, null, 2)
    };
  } catch (error) {
    return {
      statusCode: 500, headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
