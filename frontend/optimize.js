import fs from 'fs';
import path from 'path';
import https from 'https';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const PUBLIC_DIR = path.resolve('public');
const VIDEOS_DIR = path.join(PUBLIC_DIR, 'videos');

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

const desktopVideoUrl = "https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/hero-lap.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvaGVyby1sYXAubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4Njg5Mjk0MCwiZXhwIjoyMTAyMjUyOTQwfQ.Tcw1fdflPVB-S7QPppbrymOuhhbEXKaIubBON8P01Og";
const mobileVideoUrl = "https://aingapwqyhtvjygwtiat.supabase.co/storage/v1/object/sign/videos/hero-mbl.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZDI3ODZmMS1iNmU5LTRlZGYtOWIzNy0zOWJjM2Q0YmU4MDQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvaGVyby1tYmwubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4Njg5MzA3NywiZXhwIjoyMTAyMjUzMDc3fQ.WUgNtRcS9ynOMeMevXIkdmi3268s3YfVDV9YPhPuAug";

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function optimizeVideo(input, output, isMobile) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(input)
      .outputOptions([
        '-vcodec libx264',
        '-crf 24', // Good quality
        '-preset fast',
        '-movflags +faststart'
      ]);

    if (isMobile) {
      command = command.size('?x720'); // max 720p for mobile
    } else {
      command = command.size('?x1080'); // max 1080p for desktop
    }

    command
      .on('end', resolve)
      .on('error', reject)
      .save(output);
  });
}

function extractFrame(input, outputDir, filename) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .on('end', resolve)
      .on('error', reject)
      .screenshots({
        count: 1,
        folder: outputDir,
        filename: filename,
        timestamps: ['00:00:01.000'] // capture at 1 second to avoid black frame
      });
  });
}

async function run() {
  try {
    console.log('Downloading desktop video...');
    const desktopInput = path.join(VIDEOS_DIR, 'hero-lap-orig.mp4');
    await downloadFile(desktopVideoUrl, desktopInput);

    console.log('Downloading mobile video...');
    const mobileInput = path.join(VIDEOS_DIR, 'hero-mbl-orig.mp4');
    await downloadFile(mobileVideoUrl, mobileInput);

    console.log('Optimizing desktop video...');
    const desktopOutput = path.join(VIDEOS_DIR, 'hero-lap.mp4');
    await optimizeVideo(desktopInput, desktopOutput, false);

    console.log('Optimizing mobile video...');
    const mobileOutput = path.join(VIDEOS_DIR, 'hero-mbl.mp4');
    await optimizeVideo(mobileInput, mobileOutput, true);

    console.log('Extracting poster frames...');
    await extractFrame(desktopOutput, VIDEOS_DIR, 'hero-lap-poster.jpg');
    await extractFrame(mobileOutput, VIDEOS_DIR, 'hero-mbl-poster.jpg');

    // Clean up original files
    fs.unlinkSync(desktopInput);
    fs.unlinkSync(mobileInput);

    console.log('Videos optimized successfully!');
  } catch (err) {
    console.error('Error optimizing videos:', err);
  }
}

run();
