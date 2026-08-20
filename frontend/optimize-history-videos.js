import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const PUBLIC_DIR = path.resolve('public');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

function optimizeVideo(input, output) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(input)) {
      console.log(`Skipping: ${input} does not exist.`);
      resolve();
      return;
    }

    console.log(`Optimizing ${path.basename(input)}...`);
    let command = ffmpeg(input)
      .outputOptions([
        '-vcodec libx264',
        '-crf 26', // Good quality, high compression
        '-preset fast',
        '-movflags +faststart' // Crucial for web playback (starts playing before fully downloaded)
      ])
      .size('?x720') // Max 720p for web
      .on('end', () => {
        console.log(`Finished optimizing ${path.basename(output)}!`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error optimizing ${path.basename(input)}:`, err);
        reject(err);
      })
      .save(output);
  });
}

async function run() {
  try {
    const videoNames = ['history1', 'history2', 'history3'];

    for (const name of videoNames) {
      const input = path.join(VIDEOS_DIR, `${name}-orig.mp4`);
      const output = path.join(VIDEOS_DIR, `${name}.mp4`);
      
      await optimizeVideo(input, output);
      
      // Optionally clean up the original file to save space
      // if (fs.existsSync(output) && fs.existsSync(input)) {
      //   fs.unlinkSync(input);
      // }
    }

    console.log('All history videos processed successfully!');
  } catch (err) {
    console.error('Error in optimization script:', err);
  }
}

run();
