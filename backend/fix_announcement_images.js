require('dotenv').config();
const mongoose = require('mongoose');
const Announcement = require('./models/Announcement');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://harikiranm70:hari2002@cluster0.zowx6.mongodb.net/templeDB?retryWrites=true&w=majority')
  .then(async () => {
    const announcements = await Announcement.find({ imageUrl: /drive\.google\.com\/file\/d\// });
    for (let ann of announcements) {
      const match = ann.imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        ann.imageUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
        await ann.save();
        console.log('Fixed', ann.title);
      }
    }
    console.log('Done');
    process.exit(0);
  })
  .catch(console.error);
