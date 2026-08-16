const mongoose = require('mongoose');
const Festival = require('./models/Festival');
require('dotenv').config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    
    const festivals = [
      {
        titleEn: 'Annual Utsava',
        titleKn: 'ವಾರ್ಷಿಕ ಉತ್ಸವ',
        descEn: 'The grand annual festival of Sri Parthasarathi temple celebrated with immense devotion and traditional rituals.',
        descKn: 'ಶ್ರೀ ಪಾರ್ಥಸಾರಥಿ ದೇವಸ್ಥಾನದ ಭವ್ಯ ವಾರ್ಷಿಕ ಉತ್ಸವವನ್ನು ಅಪಾರ ಭಕ್ತಿ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಆಚರಣೆಗಳೊಂದಿಗೆ ಆಚರಿಸಲಾಗುತ್ತದೆ.',
        imageUrl: 'https://images.unsplash.com/photo-1596499351025-a1c6a6f68c74?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      },
      {
        titleEn: 'Krishna Janmashtami',
        titleKn: 'ಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿ',
        descEn: 'A spectacular celebration of Lord Krishnas birth with midnight poojas and special alankaram.',
        descKn: 'ಮಧ್ಯರಾತ್ರಿಯ ಪೂಜೆಗಳು ಮತ್ತು ವಿಶೇಷ ಅಲಂಕಾರದೊಂದಿಗೆ ಭಗವಾನ್ ಕೃಷ್ಣನ ಜನ್ಮದ ಅದ್ಭುತ ಆಚರಣೆ.',
        imageUrl: 'https://images.unsplash.com/photo-1601058269784-90e6e7887e5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      }
    ];

    for (let fest of festivals) {
      const exists = await Festival.findOne({ titleEn: fest.titleEn });
      if (!exists) {
        await Festival.create(fest);
        console.log('Added:', fest.titleEn);
      }
    }

    console.log('Done');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
