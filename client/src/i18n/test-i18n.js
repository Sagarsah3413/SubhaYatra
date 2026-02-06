// Simple test to verify i18n is working
import i18n from './i18n';

console.log('Testing i18n functionality...');

// Test English (default)
console.log('English:', i18n.t('header.home'));

// Test Nepali
i18n.changeLanguage('ne').then(() => {
  console.log('Nepali:', i18n.t('header.home'));
});

// Test Hindi
i18n.changeLanguage('hi').then(() => {
  console.log('Hindi:', i18n.t('header.home'));
});

// Test Chinese
i18n.changeLanguage('zh').then(() => {
  console.log('Chinese:', i18n.t('header.home'));
});

// Test Japanese
i18n.changeLanguage('ja').then(() => {
  console.log('Japanese:', i18n.t('header.home'));
});

// Test Korean
i18n.changeLanguage('ko').then(() => {
  console.log('Korean:', i18n.t('header.home'));
});

console.log('i18n test completed!');