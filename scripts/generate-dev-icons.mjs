
import sharp from "sharp";

const size = 1024;

async function makeIcon(source, destination, badgeY) {
  const badge = Buffer.from(`
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <rect x="342" y="${badgeY}" width="340" height="142"
            rx="32" fill="#9E1749" stroke="white" stroke-width="12"/>
      <text x="512" y="${badgeY + 99}"
            font-family="Arial, sans-serif"
            font-size="95" font-weight="bold"
            text-anchor="middle" fill="white">DEV</text>
    </svg>
  `);

  await sharp(source)
    .resize(size, size)
    .composite([{ input: badge }])
    .png()
    .toFile(destination);
}

await makeIcon(
  "assets/flower-icon.png",
  "assets/flower-icon-dev.png",
  745
);

await makeIcon(
  "assets/flower-adaptive-foreground.png",
  "assets/flower-adaptive-foreground-dev.png",
  615
);

console.log("Development icons generated");
