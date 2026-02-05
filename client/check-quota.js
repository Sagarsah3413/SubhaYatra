// Simple Gemini API Quota Checker
// This script helps you check if your API key is working without using quota

const API_KEY = "AIzaSyB-WZtTR8gz-NDEkeuW40UbTLvDkJxzmMI";

async function checkQuotaStatus() {
  try {
    console.log('🔍 Checking Gemini API Status...');
    console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 15)}...` : 'NOT FOUND');
    
    // This endpoint doesn't count against quota - just lists available models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key is VALID and ACTIVE!');
      console.log('📋 Available models:', data.models?.length || 0);
      
      console.log('\n🎯 **Status Summary:**');
      console.log('✅ API Key: Working');
      console.log('✅ Service: Available');
      console.log('❓ Quota: Unknown (test with actual request)');
      
      console.log('\n💡 **Next Steps:**');
      console.log('1. Your API key is valid');
      console.log('2. If chatbot shows "Smart Mode", quota is likely exceeded');
      console.log('3. Wait 24 hours for quota reset OR upgrade to paid plan');
      console.log('4. Refresh your browser after quota resets');
      
      return true;
    } else {
      const errorData = await response.text();
      console.log('❌ API Key Issue Detected');
      console.log('Error Response:', errorData);
      
      if (response.status === 400) {
        console.log('💡 API key is invalid or malformed');
      } else if (response.status === 403) {
        console.log('💡 API key lacks permissions');
      } else if (response.status === 404) {
        console.log('💡 Endpoint not found');
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return false;
  }
}

// Run the check
checkQuotaStatus().then(isValid => {
  if (isValid) {
    console.log('\n🚀 Your API key is ready to use!');
  } else {
    console.log('\n🔧 Please check your API key configuration.');
  }
});