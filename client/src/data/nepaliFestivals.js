
const NEPALI_FESTIVALS = {
  // Baisakh
  'Baisakh-1': [
    { id: 'baisakh-1', image: 'baisakh-1.svg', name: 'Nepali New Year (Navavarsha)', name_np: 'नेपाली नयाँ वर्ष', desc: 'First day of Baisakh — public holiday and celebrations across Nepal.' }
  ],
  'Baisakh-15': [
    { id: 'baisakh-15', image: 'baisakh-15.svg', name: 'Buddha Jayanti', name_np: 'बुद्ध जयन्ती', desc: 'Commemorates the birth of Gautama Buddha.' }
  ],

  // Jestha / Ashadh (seasonal events)
  'Jestha-5': [
    { id: 'jestha-5', name: 'Bhimsen Jatra (regional)', name_np: 'भीमसेन जात्रा', desc: 'Regional jatra; dates vary by locality.', approx: true }
  ],

  // Shrawan
  'Shrawan-3': [
    { id: 'shrawan-3', image: 'festival-default.svg', name: 'Teej', name_np: 'तीज', desc: 'Women’s festival with fasting and rituals — date may vary by community.', approx: true }
  ],
  'Shrawan-15': [
    { id: 'shrawan-15', image: 'shrawan-15.svg', name: 'Janai Purnima / Raksha Bandhan', name_np: 'जनै पूर्णिमा', desc: 'Sacred thread ceremony and brother-sister rituals (varies by community).' }
  ],

  // Bhadra
  'Bhadra-29': [
    { id: 'bhadra-29', image: 'bhadra-29.svg', name: 'Gai Jatra', name_np: 'गाईजात्रा', desc: 'A festival remembering the deceased; date may vary regionally.', approx: true }
  ],

  // Ashwin (Dashain period - approximate entries)
  'Ashwin-1': [
    { id: 'ashwin-1', image: 'festival-default.svg', name: 'Ghatasthapana', name_np: 'घटस्थापना', desc: 'Beginning of Dashain festival, symbolic sowing ritual.' }
  ],
  'Ashwin-8': [
    { id: 'ashwin-8', image: 'festival-default.svg', name: 'Fulpati', name_np: 'फुलपाती', desc: 'Part of Dashain rituals; royal family tradition in Kathmandu.' }
  ],
  'Ashwin-10': [
    { id: 'ashwin-10', image: 'festival-default.svg', name: 'Maha Navami', name_np: 'महानवमी', desc: 'Important day of Dashain — worship and rituals.', approx: true }
  ],
  'Ashwin-15': [
    { id: 'ashwin-15', image: 'ashwin-15.svg', name: 'Vijaya Dashami (Dashain)', name_np: 'विजया दशमी', desc: 'Major festival celebrating the victory of good over evil.' }
  ],

  // Kartik (Tihar period)
  'Kartik-6': [
    { id: 'kartik-6', image: 'festival-default.svg', name: 'Chhath (approx.)', name_np: 'छठ', desc: 'Sun-worship festival observed with riverbank rituals; date varies by lunar cycle.', approx: true }
  ],
  'Kartik-8': [
    { id: 'kartik-8', image: 'festival-default.svg', name: 'Kojagrat Purnima (Tihar)', name_np: 'कोजाग्रत पूर्णिमा', desc: 'Purnima day during Tihar celebrated with lights and pujas.' }
  ],
  'Kartik-10': [
    { id: 'kartik-10', image: 'festival-default.svg', name: 'Laxmi Puja', name_np: 'लक्ष्मी पूजा', desc: 'Worship of the goddess Laxmi; part of Tihar festival.' }
  ],
  'Kartik-12': [
    { id: 'kartik-12', image: 'festival-default.svg', name: 'Bhai Tika', name_np: 'भाइ टीका', desc: 'Sisters apply tika to brothers during Tihar.', approx: true }
  ],

  // Mangsir / Poush
  'Mangsir-1': [
    { id: 'mangsir-1', image: 'festival-default.svg', name: 'Rituals / Local Jatras (varies)', name_np: 'जात्रा/रितual', desc: 'Local events vary by region.', approx: true }
  ],

  // Poush / Magh
  'Magh-1': [
    { id: 'magh-1', image: 'magh-1.svg', name: 'Maghe Sankranti', name_np: 'माघे संक्रान्ति', desc: 'Seasonal festival marking sun’s transit; traditional foods include sesame and molasses.' }
  ],

  // Falgun / Holi
  'Falgun-14': [
    { id: 'falgun-14', image: 'festival-default.svg', name: 'Maha Shivaratri', name_np: 'महाशिवरात्रि', desc: 'Night dedicated to Lord Shiva; date varies by lunar calendar.', approx: true }
  ],
  'Falgun-15': [
    { id: 'falgun-15', image: 'falgun-15.svg', name: 'Holi', name_np: 'होली', desc: 'Festival of colors; date may vary according to lunar calendar.' }
  ],

  // Chaitra
  'Chaitra-1': [
    { id: 'chaitra-1', image: 'festival-default.svg', name: 'Regional New Year (varies)', name_np: 'नयाँ वर्ष (क्षेत्रीय)', desc: 'Regional New Year celebrations in some parts of Nepal.' }
  ],

  // Add more festivals by key; keep descriptions short and mark approx where uncertain.
};

export default NEPALI_FESTIVALS;
