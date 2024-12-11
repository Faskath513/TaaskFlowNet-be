require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

// config/environment.js
module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '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',
  // Add other constants here (Mongo URI, etc.)
};
