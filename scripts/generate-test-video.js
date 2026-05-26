// Run: node scripts/generate-test-video.js
// Generates a 60-second test video with a color test pattern

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const ffmpegPath = require("ffmpeg-static");
const outputDir = path.resolve("test-assets");
const outputPath = path.join(outputDir, "podcast.mp4");

fs.mkdirSync(outputDir, { recursive: true });

console.log("Generating test video...");

execSync(
  `"${ffmpegPath}" -y -f lavfi -i testsrc=duration=60:size=1280x720:rate=30 ` +
    `-f lavfi -i sine=frequency=440:duration=60 ` +
    `-c:v libx264 -preset ultrafast -crf 28 -c:a aac -shortest ` +
    `"${outputPath}"`,
  { stdio: "inherit" },
);

console.log(`Test video created: ${outputPath}`);
