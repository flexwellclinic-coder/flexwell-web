const { connectDB } = require('./utils/database');
const Appointment = require('./models/Appointment');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-auth-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format

    console.log('Checking for appointments on:', tomorrowStr);

    // Find all confirmed appointments for tomorrow that haven't been reminded
    const appointmentsToRemind = await Appointment.find({
      date: tomorrowStr,
      status: { $in: ['pending', 'confirmed'] },
      reminderSent: { $ne: true }
    });

    console.log('Found appointments to remind:', appointmentsToRemind.length);

    const results = [];

    for (const appointment of appointmentsToRemind) {
      try {
        // Send WhatsApp reminder
        const reminderResult = await sendWhatsAppReminder(appointment);
        
        if (reminderResult.success) {
          // Mark reminder as sent
          appointment.reminderSent = true;
          appointment.reminderSentAt = new Date();
          await appointment.save();
          
          results.push({
            appointmentId: appointment._id,
            success: true,
            message: 'Reminder sent successfully'
          });
        } else {
          results.push({
            appointmentId: appointment._id,
            success: false,
            message: reminderResult.error
          });
        }
      } catch (error) {
        console.error('Error sending reminder for appointment:', appointment._id, error);
        results.push({
          appointmentId: appointment._id,
          success: false,
          message: error.message
        });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Processed ${appointmentsToRemind.length} appointments`,
        results: results,
        summary: {
          total: appointmentsToRemind.length,
          sent: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      })
    };

  } catch (error) {
    console.error('WhatsApp reminder function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to process WhatsApp reminders',
        error: error.message
      })
    };
  }
};

// Function to send WhatsApp message using Ultramsg API
async function sendWhatsAppReminder(appointment) {
  try {
    const instanceId = process.env.WHATSAPP_INSTANCE_ID;
    const token = process.env.WHATSAPP_TOKEN;
    
    if (!instanceId || !token) {
      throw new Error('WhatsApp credentials not configured');
    }

    // Clean phone number (remove spaces, dashes, and ensure it starts with country code)
    let phone = appointment.phone.replace(/[\s\-\(\)]/g, '');
    if (phone.startsWith('0')) {
      phone = '353' + phone.substring(1); // Irish numbers
    } else if (!phone.startsWith('353') && !phone.startsWith('+')) {
      phone = '353' + phone; // Assume Irish if no country code
    }
    phone = phone.replace('+', '');

    // Format appointment time for display
    const formatTime = (timeStr) => {
      const [hour, minute] = timeStr.split(':');
      const hourNum = parseInt(hour);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum % 12 || 12;
      return `${displayHour}:${minute} ${ampm}`;
    };

    // Format date for display
    const formatDate = (dateStr) => {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-IE', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    // Create reminder message
    const message = `🏥 *Flex    Well Physiotherapy* 

Hi ${appointment.firstName}! 👋

This is a friendly reminder that you have an appointment scheduled for:

📅 *Date:* ${formatDate(appointment.date)}
⏰ *Time:* ${formatTime(appointment.time)}
🏥 *Service:* ${getServiceName(appointment.service)}

📍 *Location:* 123 Grafton Street, Dublin 2

Please arrive 10 minutes early for check-in.

If you need to reschedule or cancel, please call us at +353 1 234 5678 or reply to this message.

Thank you! 🙏
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
        to: phone,
        body: message,
        priority: '1'
      })
    });

    const result = await response.json();
    console.log('WhatsApp API response:', result);

    if (result.sent === 'true' || result.sent === true) {
      return { success: true, messageId: result.id };
    } else {
      return { success: false, error: result.error || 'Failed to send message' };
    }

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to get service display name
function getServiceName(service) {
  const services = {
    'initial-consultation': 'Initial Consultation',
    'manual-therapy': 'Manual Therapy',
    'exercise-therapy': 'Exercise Therapy',
    'sports-rehab': 'Sports Rehabilitation',
    'womens-health': 'Women\'s Health'
  };
  return services[service] || service;
} 