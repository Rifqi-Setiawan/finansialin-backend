// Simple test script untuk API
async function testAPI() {
  const baseURL = 'http://localhost:3000/api';
  
  console.log('🧪 Testing Authentication API...\n');
  
  try {
    // 1. Test Register
    console.log('1️⃣ Testing Register...');
    const registerRes = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'Password123!',
        name: 'John Doe'
      })
    });
    
    if (!registerRes.ok) {
      const error = await registerRes.json();
      console.log('❌ Register failed:', error.message);
      // Jika email sudah ada, lanjut ke login
      if (error.statusCode !== 409) throw error;
    } else {
      const data = await registerRes.json();
      console.log('✅ Register success!');
      console.log('   User:', data.user);
      console.log('   Token expires in:', data.expiresIn);
    }
    
    // 2. Test Login
    console.log('\n2️⃣ Testing Login...');
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'Password123!'
      })
    });
    
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw loginData;
    
    console.log('✅ Login success!');
    console.log('   Access Token:', loginData.accessToken.substring(0, 30) + '...');
    console.log('   Refresh Token:', loginData.refreshToken.substring(0, 30) + '...');
    
    const { accessToken, refreshToken } = loginData;
    
    // 3. Test Get Profile
    console.log('\n3️⃣ Testing Get Profile (Protected)...');
    const profileRes = await fetch(`${baseURL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const profileData = await profileRes.json();
    if (!profileRes.ok) throw profileData;
    
    console.log('✅ Get Profile success!');
    console.log('   User data:', profileData.user);
    
    // 4. Test Refresh Token
    console.log('\n4️⃣ Testing Refresh Token...');
    const refreshRes = await fetch(`${baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    
    const refreshData = await refreshRes.json();
    if (!refreshRes.ok) throw refreshData;
    
    console.log('✅ Refresh Token success!');
    console.log('   New Access Token:', refreshData.accessToken.substring(0, 30) + '...');
    
    // 5. Test Logout
    console.log('\n5️⃣ Testing Logout...');
    const logoutRes = await fetch(`${baseURL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const logoutData = await logoutRes.json();
    if (!logoutRes.ok) throw logoutData;
    
    console.log('✅ Logout success!');
    console.log('   Message:', logoutData.message);
    
    console.log('\n🎉 ALL TESTS PASSED!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

testAPI();
