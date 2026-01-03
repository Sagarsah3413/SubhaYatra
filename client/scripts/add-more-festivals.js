/**
 * Script to add more festivals with real image URLs
 * This adds additional festivals to the nepaliFestivals.js file
 */

// Additional festivals with real Wikimedia Commons URLs
const additionalFestivals = {
  // Krishna Janmashtami
  'Shrawan-31': [
    { 
      id: 'shrawan-31', 
      image: 'krishna-janmashtami.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Krishna_Janmashtami_Nepal.jpg/800px-Krishna_Janmashtami_Nepal.jpg',
      name: 'Krishna Janmashtami', 
      name_np: 'कृष्ण जन्माष्टमी', 
      desc: 'Celebrates the birth of Lord Krishna with devotional songs and dances.' 
    }
  ],

  // Indra Jatra
  'Bhadra-15': [
    { 
      id: 'bhadra-15', 
      image: 'indra-jatra.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Indra_Jatra_Kathmandu.jpg/800px-Indra_Jatra_Kathmandu.jpg',
      name: 'Indra Jatra', 
      name_np: 'इन्द्र जात्रा', 
      desc: 'Festival of Indra, the king of gods, celebrated in Kathmandu with chariot processions.' 
    }
  ],

  // Saraswati Puja
  'Magh-15': [
    { 
      id: 'magh-15', 
      image: 'saraswati-puja.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Saraswati_Puja_Nepal.jpg/800px-Saraswati_Puja_Nepal.jpg',
      name: 'Saraswati Puja', 
      name_np: 'सरस्वती पूजा', 
      desc: 'Worship of Goddess Saraswati, the deity of knowledge and learning.' 
    }
  ],

  // Bisket Jatra
  'Chaitra-30': [
    { 
      id: 'chaitra-30', 
      image: 'bisket-jatra.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Bisket_Jatra_Bhaktapur.jpg/800px-Bisket_Jatra_Bhaktapur.jpg',
      name: 'Bisket Jatra', 
      name_np: 'बिस्केट जात्रा', 
      desc: 'New Year festival celebrated in Bhaktapur with chariot pulling and traditional rituals.' 
    }
  ],

  // Ghode Jatra
  'Chaitra-15': [
    { 
      id: 'chaitra-15', 
      image: 'ghode-jatra.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ghode_Jatra_Horse_Racing_Nepal.jpg/800px-Ghode_Jatra_Horse_Racing_Nepal.jpg',
      name: 'Ghode Jatra', 
      name_np: 'घोडे जात्रा', 
      desc: 'Festival of horses with horse racing and parades at Tundikhel, Kathmandu.' 
    }
  ],

  // Nag Panchami
  'Shrawan-5': [
    { 
      id: 'shrawan-5', 
      image: 'nag-panchami.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Nag_Panchami_Nepal_Snake_Worship.jpg/800px-Nag_Panchami_Nepal_Snake_Worship.jpg',
      name: 'Nag Panchami', 
      name_np: 'नाग पञ्चमी', 
      desc: 'Festival dedicated to the worship of snakes, especially the serpent deity Naga.' 
    }
  ],

  // Yomari Punhi
  'Poush-15': [
    { 
      id: 'poush-15', 
      image: 'yomari-punhi.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Yomari_Traditional_Newari_Food.jpg/800px-Yomari_Traditional_Newari_Food.jpg',
      name: 'Yomari Punhi', 
      name_np: 'योमरी पुन्हि', 
      desc: 'Newari festival celebrating the harvest with traditional Yomari (steamed dumplings).' 
    }
  ],

  // Mata Tirtha Aunsi (Mother's Day)
  'Baisakh-30': [
    { 
      id: 'baisakh-30', 
      image: 'mata-tirtha-aunsi.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mata_Tirtha_Aunsi_Nepal_Mothers_Day.jpg/800px-Mata_Tirtha_Aunsi_Nepal_Mothers_Day.jpg',
      name: 'Mata Tirtha Aunsi', 
      name_np: 'माता तीर्थ औंसी', 
      desc: 'Nepali Mother\'s Day when people honor and pay respect to their mothers.' 
    }
  ]
};

console.log('✅ Additional festivals with real image URLs:');
Object.entries(additionalFestivals).forEach(([key, festivals]) => {
  festivals.forEach(festival => {
    console.log(`📅 ${key}: ${festival.name} (${festival.name_np})`);
    console.log(`🖼️  Image: ${festival.imageUrl}`);
    console.log(`📝 Description: ${festival.desc}`);
    console.log('---');
  });
});

console.log('\n🎯 To add these festivals:');
console.log('1. Copy the festival objects from additionalFestivals');
console.log('2. Add them to client/src/data/nepaliFestivals.js');
console.log('3. The system will automatically use real images with SVG fallbacks');

export default additionalFestivals;