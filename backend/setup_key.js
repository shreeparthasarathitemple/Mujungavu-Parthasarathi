its coming like this i nee require('dotenv').config();
const mongoose = require('mongoose');
const Setting = require('./models/Setting');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mujungavu-temple';

async function setupKey() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    const apiKey = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
    
    // Check if the setting exists
    let setting = await Setting.findOne({ key: 'geminiApiKey' });
    if (setting) {
      setting.value = apiKey;
      await setting.save();
      console.log('Updated existing API key in DB');
    } else {
      setting = new Setting({
        key: 'geminiApiKey',
        value: apiKey
      });
      await setting.save();
      console.log('Created new API key in DB');
    }
    
    mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
    mongoose.disconnect();
  }
}

setupKey();
