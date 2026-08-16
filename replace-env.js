const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInFiles(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;
      
      // Replace single quote strings
      if (content.match(/'https:\/\/mujungavu-parthasarathi\.onrender\.com\/api([^']*)'/)) {
        content = content.replace(/'https:\/\/mujungavu-parthasarathi\.onrender\.com\/api([^']*)'/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}/api$1`');
        updated = true;
      }
      
      // Replace template literals
      if (content.match(/`https:\/\/mujungavu-parthasarathi\.onrender\.com\/api([^`]*)`/)) {
        content = content.replace(/`https:\/\/mujungavu-parthasarathi\.onrender\.com\/api([^`]*)`/g, '`${import.meta.env.VITE_API_URL || \'http://localhost:5000\'}/api$1`');
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated to use env variables:', fullPath);
      }
    }
  }
}

replaceInFiles(srcDir);
