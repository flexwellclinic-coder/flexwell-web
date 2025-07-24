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

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed - use POST'
      })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Analyze the received data
    const analysis = {
      receivedFields: Object.keys(data),
      fieldTypes: {},
      fieldValues: {},
      requiredFieldsPresent: [],
      missingRequiredFields: [],
      validationChecks: {}
    };

    // Required fields according to schema
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'date', 'time', 'service'];
    
    // Check each field
    requiredFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
        analysis.requiredFieldsPresent.push(field);
        analysis.fieldTypes[field] = typeof data[field];
        analysis.fieldValues[field] = data[field];
      } else {
        analysis.missingRequiredFields.push(field);
      }
    });

    // Validation checks
    if (data.email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      analysis.validationChecks.emailValid = emailRegex.test(data.email);
    }

    if (data.date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      analysis.validationChecks.dateFormatValid = dateRegex.test(data.date);
    }

    if (data.time) {
      const validTimes = ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      analysis.validationChecks.timeValid = validTimes.includes(data.time);
    }

    if (data.service) {
      const validServices = ['initial-consultation', 'manual-therapy', 'exercise-therapy', 'sports-rehab', 'womens-health'];
      analysis.validationChecks.serviceValid = validServices.includes(data.service);
    }

    if (data.phone) {
      analysis.validationChecks.phoneLength = {
        length: data.phone.length,
        minValid: data.phone.length >= 5,
        maxValid: data.phone.length <= 25
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Appointment data analysis',
        analysis: analysis,
        rawData: data
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Debug analysis failed',
        error: error.message
      })
    };
  }
}; 