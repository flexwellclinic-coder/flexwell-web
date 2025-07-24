const { connectDB } = require('./utils/database');
const Appointment = require('./models/Appointment');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Connect to database
    await connectDB();

    if (event.httpMethod === 'GET') {
      // Return available test options
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'WhatsApp Test Function',
          options: [
            'POST /test-whatsapp - Send test message to a specific phone number',
            'POST /test-whatsapp?mode=tomorrow - Test tomorrow\'s reminders (dry run)',
            'POST /test-whatsapp?mode=send - Actually send tomorrow\'s reminders'
          ],
          usage: {
            testMessage: {
              method: 'POST',
              body: {
                phone: '+353123456789',
                firstName: 'John',
                message: 'Custom test message'
              }
            }
          }
        })
      };
    }

    const queryParams = event.queryStringParameters || {};
    const mode = queryParams.mode;

    if (mode === 'tomorrow') {
      // Test mode - show what reminders would be sent tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const appointmentsToRemind = await Appointment.find({
        date: tomorrowStr,
        status: { $in: ['pending', 'confirmed'] },
        reminderSent: { $ne: true }
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: `Found ${appointmentsToRemind.length} appointments for tomorrow (${tomorrowStr})`,
          appointments: appointmentsToRemind.map(apt => ({
            id: apt._id,
            name: `${apt.firstName} ${apt.lastName}`,
            phone: apt.phone,
            time: apt.time,
            service: apt.service,
            reminderSent: apt.reminderSent
          })),
          note: 'This is a dry run - no messages were sent'
        })
      };
    }

    if (mode === 'send') {
      // Actually trigger the reminder function
      const reminderFunction = require('./whatsapp-reminder');
      return await reminderFunction.handler(event, context);
    }

    // Default: Send test message
    const requestBody = event.body ? JSON.parse(event.body) : {};
    const { phone, firstName = 'Test User', message } = requestBody;

    if (!phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Phone number is required for test message'
        })
      };
    }

    // Send test WhatsApp message
    const testResult = await sendTestWhatsAppMessage(phone, firstName, message);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: testResult.success,
        message: testResult.success ? 'Test message sent successfully' : 'Failed to send test message',
        details: testResult,
        sentTo: phone
      })
    };

  } catch (error) {
    console.error('Test WhatsApp function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Test function failed',
        error: error.message
      })
    };
  }
};

// Function to send test WhatsApp message
async function sendTestWhatsAppMessage(phone, firstName, customMessage) {
  try {
    const instanceId = process.env.WHATSAPP_INSTANCE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    
    if (!instanceId || !token) {
      return { success: false, error: 'WhatsApp credentials not configured' };
    }

    // Clean phone number
    let cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '353' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('353') && !cleanPhone.startsWith('+')) {
      cleanPhone = '353' + cleanPhone;
    }
    cleanPhone = cleanPhone.replace('+', '');

    // Create test message
    const message = customMessage || `🧪 *Test Message from Flex    Well* 

Hi ${firstName}! 👋

This is a test message from the Flex    Well WhatsApp reminder system.

✅ Your WhatsApp number is correctly configured to receive appointment reminders.

📱 System Status: Operational
⏰ Time Sent: ${new Date().toLocaleString('en-IE')}

*Flex    Well Physiotherapy Team*`;

    // Send WhatsApp message via Ultramsg API
    const apiUrl = `https://api.ultramsg.com/${instanceId}/messages/chat`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: token,
        to: cleanPhone,
        body: message,
        priority: '1'
      })
    });

    const result = await response.json();
    console.log('Test WhatsApp API response:', result);

    if (result.sent === 'true' || result.sent === true) {
      return { 
        success: true, 
        messageId: result.id,
        sentTo: cleanPhone,
        originalPhone: phone
      };
    } else {
      return { 
        success: false, 
        error: result.error || 'Failed to send test message',
        apiResponse: result
      };
    }

  } catch (error) {
    console.error('Error sending test WhatsApp message:', error);
    return { success: false, error: error.message };
  }
} 