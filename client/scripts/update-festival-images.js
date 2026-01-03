/**
 * Festival Image Updater Script
 * 
 * This script helps you batch update festival images with real URLs.
 * 
 * Usage:
 * 1. Add your image URLs to the imageUrls object below
 * 2. Run: node scripts/update-festival-images.js
 * 3. The script will update the nepaliFestivals.js file
 */

import fs from 'fs';
import path from 'path';

// Add your real image URLs here
const imageUrls = {
  'baisakh-1': 'https://example.com/nepali-new-year.jpg',
  'baisakh-15': 'https://example.com/buddha-jayanti.jpg',
  'jestha-5': 'https://example.com/bhimsen-jatra.jpg',
  'shrawan-3': 'https://example.com/teej-festival.jpg',
  'shrawan-15': 'https://example.com/janai-purnima.jpg',
  'bhadra-29': 'https://example.com/gai-jatra.jpg',
  'ashwin-1': 'https://example.com/ghatasthapana.jpg',
  'ashwin-8': 'https://example.com/fulpati.jpg',
  'ashwin-10': 'https://example.com/maha-navami.jpg',
  'ashwin-15': 'https://example.com/dashain.jpg',
  'kartik-6': 'https://example.com/chhath.jpg',
  'kartik-8': 'https://example.com/kojagrat-purnima.jpg',
  'kartik-10': 'https://example.com/laxmi-puja.jpg',
  'kartik-12': 'https://example.com/bhai-tika.jpg',
  'mangsir-1': 'https://example.com/local-jatra.jpg',
  'magh-1': 'https://example.com/maghe-sankranti.jpg',
  'falgun-14': 'https://example.com/maha-shivaratri.jpg',
  'falgun-15': 'https://example.com/holi.jpg',
  'chaitra-1': 'https://example.com/regional-new-year.jpg'
};

// Festival search terms for easy reference
const searchTerms = {
  'baisakh-1': 'Nepal New Year celebration Navavarsha',
  'baisakh-15': 'Buddha Jayanti Nepal Lumbini',
  'jestha-5': 'Bhimsen Jatra Nepal chariot',
  'shrawan-3': 'Teej festival Nepal women red sari',
  'shrawan-15': 'Janai Purnima sacred thread Nepal',
  'bhadra-29': 'Gai Jatra Nepal cow festival',
  'ashwin-1': 'Ghatasthapana Dashain barley pot',
  'ashwin-8': 'Fulpati Dashain flowers banana',
  'ashwin-10': 'Maha Navami Dashain goddess',
  'ashwin-15': 'Dashain Nepal tika ceremony',
  'kartik-6': 'Chhath Puja Nepal sun worship',
  'kartik-8': 'Kojagrat Purnima Tihar lights',
  'kartik-10': 'Laxmi Puja Tihar goddess',
  'kartik-12': 'Bhai Tika Nepal brother sister',
  'mangsir-1': 'Nepal local jatra festival',
  'magh-1': 'Maghe Sankranti Nepal winter',
  'falgun-14': 'Maha Shivaratri Nepal Pashupatinath',
  'falgun-15': 'Holi Nepal colors festival',
  'chaitra-1': 'Nepal regional new year spring'
};

function updateFestivalImages() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'nepaliFestivals.js');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update each festival with imageUrl
    Object.entries(imageUrls).forEach(([festivalId, imageUrl]) => {
      if (imageUrl && imageUrl !== 'https://example.com/...') {
        // Find the festival entry and add imageUrl
        const regex = new RegExp(`(id: '${festivalId}'[^}]+)}`);
        content = content.replace(regex, `$1, imageUrl: '${imageUrl}' }`);
      }
    });
    
    fs.writeFileSync(filePath, content);
    console.log('✅ Festival images updated successfully!');
    
    // Show search terms for reference
    console.log('\n📝 Search terms for finding images:');
    Object.entries(searchTerms).forEach(([id, terms]) => {
      if (imageUrls[id] && imageUrls[id] === 'https://example.com/...') {
        console.log(`${id}: ${terms}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating festival images:', error.message);
  }
}

// Run the updater
updateFestivalImages();