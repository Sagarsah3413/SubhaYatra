/**
 * Script to create remaining Nepali month SVG images
 * This creates placeholder SVG images for all 12 Nepali months
 */

import fs from 'fs';
import path from 'path';

const monthSVGs = {
  'shrawan-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Shrawan - Peak monsoon -->
    <rect width="120" height="80" fill="#2F4F4F"/>
    <ellipse cx="40" cy="15" rx="20" ry="8" fill="#696969"/>
    <ellipse cx="80" cy="20" rx="25" ry="10" fill="#696969"/>
    <!-- Heavy rain -->
    <g stroke="#4169E1" stroke-width="2">
      <line x1="20" y1="23" x2="15" y2="40"/>
      <line x1="30" y1="25" x2="25" y2="42"/>
      <line x1="40" y1="23" x2="35" y2="40"/>
      <line x1="60" y1="28" x2="55" y2="45"/>
      <line x1="70" y1="30" x2="65" y2="47"/>
      <line x1="80" y1="28" x2="75" y2="45"/>
      <line x1="90" y1="30" x2="85" y2="47"/>
      <line x1="100" y1="28" x2="95" y2="45"/>
    </g>
    <polygon points="0,55 30,40 60,50 90,35 120,45 120,80 0,80" fill="#006400"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#F0F8FF">SHRAWAN</text>
  </svg>`,

  'bhadra-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Bhadra - Late monsoon -->
    <defs>
      <linearGradient id="lateMonsoon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="120" height="80" fill="url(#lateMonsoon)"/>
    <ellipse cx="60" cy="20" rx="15" ry="6" fill="#B0C4DE"/>
    <!-- Light rain -->
    <g stroke="#6495ED" stroke-width="1">
      <line x1="50" y1="26" x2="48" y2="35"/>
      <line x1="60" y1="26" x2="58" y2="35"/>
      <line x1="70" y1="26" x2="68" y2="35"/>
    </g>
    <polygon points="0,60 25,45 55,55 85,40 120,50 120,80 0,80" fill="#32CD32"/>
    <circle cx="90" cy="25" r="6" fill="#FFD700" opacity="0.7"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#2F4F4F">BHADRA</text>
  </svg>`,

  'ashwin-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Ashwin - Clear autumn -->
    <defs>
      <linearGradient id="autumn" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#E0F6FF;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="120" height="80" fill="url(#autumn)"/>
    <circle cx="100" cy="15" r="8" fill="#FFD700"/>
    <polygon points="0,65 20,25 50,40 80,20 120,35 120,80 0,80" fill="#228B22"/>
    <!-- Clear mountain peaks -->
    <polygon points="15,25 25,15 35,25" fill="#FFFFFF"/>
    <polygon points="75,20 85,10 95,20" fill="#FFFFFF"/>
    <!-- Festival elements -->
    <circle cx="30" cy="55" r="2" fill="#FF6347"/>
    <circle cx="70" cy="50" r="2" fill="#FFD700"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#2F4F4F">ASHWIN</text>
  </svg>`,

  'kartik-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Kartik - Festival of lights -->
    <rect width="120" height="80" fill="#191970"/>
    <circle cx="90" cy="20" r="6" fill="#F5F5DC"/>
    <polygon points="0,60 25,35 55,50 85,30 120,45 120,80 0,80" fill="#2F4F4F"/>
    <!-- Festival lights -->
    <circle cx="20" cy="65" r="2" fill="#FFD700"/>
    <circle cx="40" cy="62" r="2" fill="#FFA500"/>
    <circle cx="60" cy="68" r="2" fill="#FFD700"/>
    <circle cx="80" cy="65" r="2" fill="#FFA500"/>
    <circle cx="100" cy="63" r="2" fill="#FFD700"/>
    <!-- Light rays -->
    <circle cx="20" cy="65" r="4" fill="#FFD700" opacity="0.3"/>
    <circle cx="40" cy="62" r="4" fill="#FFA500" opacity="0.3"/>
    <circle cx="60" cy="68" r="4" fill="#FFD700" opacity="0.3"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#F0F8FF">KARTIK</text>
  </svg>`,

  'mangsir-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Mangsir - Early winter -->
    <defs>
      <linearGradient id="earlyWinter" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#B0E0E6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#87CEEB;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="120" height="80" fill="url(#earlyWinter)"/>
    <circle cx="85" cy="20" r="7" fill="#FFD700"/>
    <polygon points="0,65 30,40 60,55 90,35 120,50 120,80 0,80" fill="#8FBC8F"/>
    <!-- Cool weather indicators -->
    <path d="M20 30 Q25 25 30 30" stroke="#B0C4DE" stroke-width="2" fill="none"/>
    <path d="M70 35 Q75 30 80 35" stroke="#B0C4DE" stroke-width="2" fill="none"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#2F4F4F">MANGSIR</text>
  </svg>`,

  'poush-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Poush - Cold winter -->
    <rect width="120" height="80" fill="#4682B4"/>
    <circle cx="80" cy="25" r="6" fill="#F0F8FF"/>
    <polygon points="0,65 25,45 55,60 85,40 120,55 120,80 0,80" fill="#696969"/>
    <!-- Frost/snow on peaks -->
    <polygon points="20,45 30,35 40,45" fill="#FFFFFF"/>
    <polygon points="80,40 90,30 100,40" fill="#FFFFFF"/>
    <!-- Cold indicators -->
    <circle cx="30" cy="20" r="1" fill="#E6E6FA"/>
    <circle cx="50" cy="15" r="1" fill="#E6E6FA"/>
    <circle cx="70" cy="18" r="1" fill="#E6E6FA"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#F0F8FF">POUSH</text>
  </svg>`,

  'magh-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Magh - Coldest month -->
    <rect width="120" height="80" fill="#2F4F4F"/>
    <circle cx="75" cy="30" r="5" fill="#E6E6FA" opacity="0.8"/>
    <polygon points="0,65 20,50 50,65 80,45 120,60 120,80 0,80" fill="#556B2F"/>
    <!-- Heavy frost -->
    <polygon points="15,50 25,40 35,50" fill="#FFFFFF"/>
    <polygon points="45,65 55,55 65,65" fill="#FFFFFF"/>
    <polygon points="75,45 85,35 95,45" fill="#FFFFFF"/>
    <!-- Fog -->
    <ellipse cx="60" cy="55" rx="20" ry="5" fill="#F5F5F5" opacity="0.6"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#F0F8FF">MAGH</text>
  </svg>`,

  'falgun-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Falgun - Spring transition -->
    <defs>
      <linearGradient id="springTransition" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#98FB98;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="120" height="80" fill="url(#springTransition)"/>
    <circle cx="90" cy="20" r="7" fill="#FFD700"/>
    <polygon points="0,60 25,40 55,55 85,35 120,50 120,80 0,80" fill="#228B22"/>
    <!-- Early flowers -->
    <circle cx="30" cy="50" r="2" fill="#FF69B4"/>
    <circle cx="50" cy="45" r="2" fill="#FFB6C1"/>
    <circle cx="70" cy="48" r="2" fill="#FF1493"/>
    <!-- Holi colors -->
    <circle cx="20" cy="30" r="3" fill="#FF6347" opacity="0.7"/>
    <circle cx="100" cy="35" r="3" fill="#32CD32" opacity="0.7"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#2F4F4F">FALGUN</text>
  </svg>`,

  'chaitra-month': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80">
    <!-- Chaitra - Full spring -->
    <defs>
      <linearGradient id="fullSpring" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#90EE90;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="120" height="80" fill="url(#fullSpring)"/>
    <circle cx="95" cy="18" r="8" fill="#FFD700"/>
    <polygon points="0,58 30,35 60,50 90,30 120,45 120,80 0,80" fill="#228B22"/>
    <!-- Full bloom -->
    <circle cx="25" cy="48" r="6" fill="#32CD32"/>
    <circle cx="55" cy="43" r="8" fill="#32CD32"/>
    <circle cx="85" cy="45" r="7" fill="#32CD32"/>
    <!-- Flowers everywhere -->
    <circle cx="23" cy="45" r="2" fill="#FF69B4"/>
    <circle cx="27" cy="43" r="2" fill="#FFB6C1"/>
    <circle cx="53" cy="40" r="2" fill="#FF1493"/>
    <circle cx="57" cy="38" r="2" fill="#FF69B4"/>
    <circle cx="83" cy="42" r="2" fill="#FFB6C1"/>
    <circle cx="87" cy="40" r="2" fill="#FF69B4"/>
    <text x="60" y="75" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#2F4F4F">CHAITRA</text>
  </svg>`
};

// Create the months directory if it doesn't exist
const monthsDir = path.join(process.cwd(), 'client', 'src', 'assets', 'months');
if (!fs.existsSync(monthsDir)) {
  fs.mkdirSync(monthsDir, { recursive: true });
}

// Create all month SVG files
Object.entries(monthSVGs).forEach(([filename, svgContent]) => {
  const filePath = path.join(monthsDir, `${filename}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created ${filename}.svg`);
});

console.log('\n🎉 All Nepali month images created successfully!');