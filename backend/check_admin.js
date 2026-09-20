require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

async function checkAdmins() {
  await mongoose.connect(process.env.MONGO_URI);
  const admins = await Admin.find({});
  console.log("Admins in DB:");
  for (let admin of admins) {
    console.log("Username:", admin.username);
    console.log("Password hash:", admin.password);
    const isMatch = await bcrypt.compare('Mujungavu@2026!Secure', admin.password);
    console.log("Matches 'Mujungavu@2026!Secure':", isMatch);
  }
  mongoose.disconnect();
}
checkAdmins();
