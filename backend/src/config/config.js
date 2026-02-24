require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 7,
  
  // Third-party API configurations (for future use)
  emailService: {
    apiKey: process.env.EMAIL_API_KEY,
    from: process.env.EMAIL_FROM || 'noreply@shareplate.com'
  },
  
  smsService: {
    apiKey: process.env.SMS_API_KEY,
    accountSid: process.env.SMS_ACCOUNT_SID
  }
};
