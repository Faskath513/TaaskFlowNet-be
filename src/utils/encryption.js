const crypto = require('crypto');

// Replace with your actual stored secret key
const SECRET_KEY = crypto.randomBytes(32); // Use an environment variable to store this securely
const SECRET_IV = crypto.randomBytes(16);  // Same for the IV

// // Function to encrypt text
// const encrypt = (text) => {
//   const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, SECRET_IV);
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return { encrypted, iv: SECRET_IV.toString('hex') };
// };

// Function to decrypt text
const decrypt = (encryptedText, ivHex) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// const crypto = require('crypto');

// // Key for encryption (this should be securely stored in your environment)
// const SECRET_KEY = Buffer.from('your-secret-key-here', 'utf8'); // Example

// Function to encrypt text
const encrypt = (text) => {
  const iv = crypto.randomBytes(16); // Initialization Vector (IV)
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, iv: iv.toString('hex') };  // Return both the encrypted text and iv
};

// Example of how you'd use this:
const { encrypted, iv } = encrypt("mySecurePassword");

// Store 'encrypted' and 'iv' in the database

module.exports = { encrypt, decrypt };
