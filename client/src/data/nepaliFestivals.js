const NEPALI_FESTIVALS = {
  // Baisakh
  'Baisakh-1': [
    { 
      id: 'baisakh-1', 
      image: 'baisakh-1.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Nepali_New_Year_2081_celebration.jpg/800px-Nepali_New_Year_2081_celebration.jpg',
      name: 'Nepali New Year (Navavarsha)', 
      name_np: 'नेपाली नयाँ वर्ष', 
      desc: 'First day of Baisakh — public holiday and celebrations across Nepal.' 
    }
  ],
  'Baisakh-15': [
    { 
      id: 'baisakh-15', 
      image: 'baisakh-15.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Lumbini_Maya_Devi_Temple.jpg/800px-Lumbini_Maya_Devi_Temple.jpg',
      name: 'Buddha Jayanti', 
      name_np: 'बुद्ध जयन्ती', 
      desc: 'Commemorates the birth of Gautama Buddha.' 
    }
  ],

  // Jestha / Ashadh (seasonal events)
  'Jestha-5': [
    { 
      id: 'jestha-5', 
      image: 'jestha-5.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bhimsen_Temple_Nepal.jpg/800px-Bhimsen_Temple_Nepal.jpg',
      name: 'Bhimsen Jatra (regional)', 
      name_np: 'भीमसेन जात्रा', 
      desc: 'Regional jatra; dates vary by locality.', 
      approx: true 
    }
  ],

  // Shrawan
  'Shrawan-3': [
    { 
      id: 'shrawan-3', 
      image: 'shrawan-3.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Teej_Festival_Nepal.jpg/800px-Teej_Festival_Nepal.jpg', // Example - replace with actual
      name: 'Teej', 
      name_np: 'तीज', 
      desc: 'Women\'s festival with fasting and rituals - date may vary by community.', 
      approx: true 
    }
  ],
  'Shrawan-15': [
    { 
      id: 'shrawan-15', 
      image: 'shrawan-15.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Janai_Purnima_Nepal.jpg/800px-Janai_Purnima_Nepal.jpg', // Example - replace with actual
      name: 'Janai Purnima / Raksha Bandhan', 
      name_np: 'जनै पूर्णिमा', 
      desc: 'Sacred thread ceremony and brother-sister rituals (varies by community).' 
    }
  ],

  // Bhadra
  'Bhadra-29': [
    { 
      id: 'bhadra-29', 
      image: 'bhadra-29.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Gai_Jatra_Festival_Nepal.jpg/800px-Gai_Jatra_Festival_Nepal.jpg',
      name: 'Gai Jatra', 
      name_np: 'गाईजात्रा', 
      desc: 'A festival remembering the deceased; date may vary regionally.', 
      approx: true 
    }
  ],

  // Ashwin (Dashain period - approximate entries)
  'Ashwin-1': [
    { 
      id: 'ashwin-1', 
      image: 'ashwin-1.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Dashain_Ghatasthapana_Nepal.jpg/800px-Dashain_Ghatasthapana_Nepal.jpg',
      name: 'Ghatasthapana', 
      name_np: 'घटस्थापना', 
      desc: 'Beginning of Dashain festival, symbolic sowing ritual.' 
    }
  ],
  'Ashwin-8': [
    { 
      id: 'ashwin-8', 
      image: 'ashwin-8.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Fulpati_Dashain_Nepal.jpg/800px-Fulpati_Dashain_Nepal.jpg',
      name: 'Fulpati', 
      name_np: 'फुलपाती', 
      desc: 'Part of Dashain rituals; royal family tradition in Kathmandu.' 
    }
  ],
  'Ashwin-10': [
    { 
      id: 'ashwin-10', 
      image: 'ashwin-10.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Maha_Navami_Nepal.jpg/800px-Maha_Navami_Nepal.jpg',
      name: 'Maha Navami', 
      name_np: 'महानवमी', 
      desc: 'Important day of Dashain — worship and rituals.', 
      approx: true 
    }
  ],
  'Ashwin-15': [
    { 
      id: 'ashwin-15', 
      image: 'ashwin-15.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Dashain_festival_Nepal.jpg/800px-Dashain_festival_Nepal.jpg',
      name: 'Vijaya Dashami (Dashain)', 
      name_np: 'विजया दशमी', 
      desc: 'Major festival celebrating the victory of good over evil.' 
    }
  ],

  // Kartik (Tihar period)
  'Kartik-6': [
    { 
      id: 'kartik-6', 
      image: 'kartik-6.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Chhath_Puja_Nepal.jpg/800px-Chhath_Puja_Nepal.jpg',
      name: 'Chhath (approx.)', 
      name_np: 'छठ', 
      desc: 'Sun-worship festival observed with riverbank rituals; date varies by lunar cycle.', 
      approx: true 
    }
  ],
  'Kartik-8': [
    { 
      id: 'kartik-8', 
      image: 'kartik-8.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Kojagrat_Purnima_Nepal.jpg/800px-Kojagrat_Purnima_Nepal.jpg',
      name: 'Kojagrat Purnima (Tihar)', 
      name_np: 'कोजाग्रत पूर्णिमा', 
      desc: 'Purnima day during Tihar celebrated with lights and pujas.' 
    }
  ],
  'Kartik-10': [
    { 
      id: 'kartik-10', 
      image: 'kartik-10.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Rangoli_in_tihar.jpg/800px-Rangoli_in_tihar.jpg',
      name: 'Laxmi Puja', 
      name_np: 'लक्ष्मी पूजा', 
      desc: 'Worship of the goddess Laxmi; part of Tihar festival.' 
    }
  ],
  'Kartik-12': [
    { 
      id: 'kartik-12', 
      image: 'kartik-12.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Bhai_Tika_Tihar_Nepal.jpg/800px-Bhai_Tika_Tihar_Nepal.jpg',
      name: 'Bhai Tika', 
      name_np: 'भाइ टीका', 
      desc: 'Sisters apply tika to brothers during Tihar.', 
      approx: true 
    }
  ],

  // Mangsir / Poush
  'Mangsir-1': [
    { 
      id: 'mangsir-1', 
      image: 'mangsir-1.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Nepal_Local_Festival.jpg/800px-Nepal_Local_Festival.jpg',
      name: 'Rituals / Local Jatras (varies)', 
      name_np: 'जात्रा/रितual', 
      desc: 'Local events vary by region.', 
      approx: true 
    }
  ],

  // Poush / Magh
  'Magh-1': [
    { 
      id: 'magh-1', 
      image: 'magh-1.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Maghe_Sankranti_Nepal.jpg/800px-Maghe_Sankranti_Nepal.jpg',
      name: 'Maghe Sankranti', 
      name_np: 'माघे संक्रान्ति', 
      desc: 'Seasonal festival marking sun\'s transit; traditional foods include sesame and molasses.' 
    }
  ],

  // Falgun / Holi
  'Falgun-14': [
    { 
      id: 'falgun-14', 
      image: 'falgun-14.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Maha_Shivaratri_Nepal.jpg/800px-Maha_Shivaratri_Nepal.jpg',
      name: 'Maha Shivaratri', 
      name_np: 'महाशिवरात्रि', 
      desc: 'Night dedicated to Lord Shiva; date varies by lunar calendar.', 
      approx: true 
    }
  ],
  'Falgun-15': [
    { 
      id: 'falgun-15', 
      image: 'falgun-15.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Holi_celebration_Nepal.jpg/800px-Holi_celebration_Nepal.jpg',
      name: 'Holi', 
      name_np: 'होली', 
      desc: 'Festival of colors; date may vary according to lunar calendar.' 
    }
  ],

  // Chaitra
  'Chaitra-1': [
    { 
      id: 'chaitra-1', 
      image: 'chaitra-1.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Nepal_Regional_New_Year.jpg/800px-Nepal_Regional_New_Year.jpg',
      name: 'Regional New Year (varies)', 
      name_np: 'नयाँ वर्ष (क्षेत्रीय)', 
      desc: 'Regional New Year celebrations in some parts of Nepal.' 
    }
  ],

  // Additional Major Festivals
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

  'Baisakh-30': [
    { 
      id: 'baisakh-30', 
      image: 'mata-tirtha-aunsi.svg', 
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mata_Tirtha_Aunsi_Nepal_Mothers_Day.jpg/800px-Mata_Tirtha_Aunsi_Nepal_Mothers_Day.jpg',
      name: 'Mata Tirtha Aunsi', 
      name_np: 'माता तीर्थ औंसी', 
      desc: 'Nepali Mother\'s Day when people honor and pay respect to their mothers.' 
    }
  ],

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

  // Add more festivals by key; keep descriptions short and mark approx where uncertain.
};

export default NEPALI_FESTIVALS;