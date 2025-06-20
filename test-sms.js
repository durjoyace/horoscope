// Test script to verify SMS functionality
const fetch = require('node-fetch');

async function testSMSIntegration() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    // Test 1: Create a test user with phone number and SMS opt-in
    console.log('Creating test user with SMS opt-in...');
    const signupResponse = await fetch(`${baseUrl}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'smstest@example.com',
        firstName: 'SMS',
        lastName: 'Tester', 
        phone: '+15551234567', // Test phone number
        zodiacSign: 'scorpio',
        smsOptIn: true,
        emailOptIn: false
      })
    });
    
    const signupData = await signupResponse.json();
    console.log('Signup result:', signupData);
    
    // Test 2: Check if user was created properly
    if (signupData.success) {
      console.log('✓ User created successfully with SMS opt-in');
      
      // Test 3: Trigger daily horoscope delivery
      console.log('Testing daily horoscope delivery...');
      const deliveryResponse = await fetch(`${baseUrl}/api/admin/deliver-horoscope`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0]
        })
      });
      
      const deliveryData = await deliveryResponse.json();
      console.log('Delivery test result:', deliveryData);
      
    } else {
      console.log('❌ User creation failed:', signupData.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSMSIntegration();