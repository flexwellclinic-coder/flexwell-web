const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const appointment = JSON.parse(event.body);

    const {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      service,
      notes
    } = appointment;

    // Validate required fields
    if (!firstName || !lastName || !email || !date || !time) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Missing required appointment fields' })
      };
    }

    // Service label map
    const serviceLabels = {
      'initial-consultation': 'Initial Consultation',
      'manual-therapy': 'Manual Therapy',
      'exercise-therapy': 'Exercise Therapy',
      'sports-rehab': 'Sports Rehabilitation',
      'womens-health': "Women's Health"
    };

    const serviceLabel = serviceLabels[service] || service || 'N/A';
    const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Check for required environment variables
    const gmailUser = process.env.GMAIL_USER || 'flexwellclinic@gmail.com';
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailAppPassword) {
      console.warn('GMAIL_APP_PASSWORD not set. Email notification skipped.');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Email notification skipped (GMAIL_APP_PASSWORD not configured)',
          skipped: true
        })
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      }
    });

    // Build email HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #064e3b, #10b981); padding: 32px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
          .body { padding: 32px; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 24px; }
          .details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 16px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { color: #64748b; font-weight: 500; }
          .detail-value { color: #1e293b; font-weight: 600; text-align: right; }
          .notes { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0; }
          .notes p { margin: 0; color: #78350f; font-size: 14px; }
          .footer { background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0; }
          .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
          .cta { display: inline-block; background: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Appointment Request</h1>
            <p>Flex Well Physiotherapy Clinic</p>
          </div>
          <div class="body">
            <span class="badge">⏳ Pending Confirmation</span>
            <h2 style="margin: 0 0 8px; color: #1e293b;">New appointment from ${firstName} ${lastName}</h2>
            <p style="color: #64748b; margin: 0 0 24px;">A new appointment request has been submitted and is waiting for your confirmation.</p>
            
            <div class="details">
              <div class="detail-row">
                <span class="detail-label">👤 Patient</span>
                <span class="detail-value">${firstName} ${lastName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📧 Email</span>
                <span class="detail-value">${email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📞 Phone</span>
                <span class="detail-value">${phone || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">📅 Date</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🕐 Time</span>
                <span class="detail-value">${time}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">🏥 Service</span>
                <span class="detail-value">${serviceLabel}</span>
              </div>
            </div>

            ${notes ? `
            <div class="notes">
              <strong>📝 Patient Notes:</strong>
              <p style="margin-top: 8px;">${notes}</p>
            </div>
            ` : ''}

            <p style="color: #64748b; font-size: 14px; margin-top: 24px;">
              Please log in to the admin panel to review and confirm this appointment.
            </p>
          </div>
          <div class="footer">
            <p>Flex Well Physiotherapy Clinic — Dublin, Ireland</p>
            <p style="margin-top: 4px;">This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const mailOptions = {
      from: `"Flex Well Clinic" <${gmailUser}>`,
      to: 'flexwellclinic@gmail.com',
      subject: `🔔 New Appointment: ${firstName} ${lastName} — ${formattedDate} at ${time}`,
      html: htmlContent,
      text: `New Appointment Request\n\nPatient: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nDate: ${formattedDate}\nTime: ${time}\nService: ${serviceLabel}\n${notes ? 'Notes: ' + notes : ''}\n\nPlease log in to the admin panel to confirm.`
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email notification sent for ${firstName} ${lastName}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email notification sent successfully'
      })
    };

  } catch (error) {
    console.error('Email notification error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to send email notification',
        error: error.message
      })
    };
  }
};
