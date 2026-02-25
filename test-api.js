// Test script to check API endpoints
// Run with: node test-api.js

const API_BASE = 'https://play.soundboard.cloud/api/memesoundboard.org'

async function testEndpoint(name, url) {
  console.log(`\n=== Testing ${name} ===`)
  console.log(`URL: ${url}`)
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    console.log(`Status: ${response.status}`)
    console.log(`Response:`, JSON.stringify(data, null, 2))
    
    if (data.data && data.data.results) {
      console.log(`Found ${data.data.results.length} results`)
      if (data.data.results.length > 0) {
        console.log(`First result:`, data.data.results[0])
      }
    }
  } catch (error) {
    console.error(`Error:`, error.message)
  }
}

async function runTests() {
  console.log('Testing memesoundboard.org API Endpoints\n')
  
  // Test all sounds
  await testEndpoint(
    'All Sounds',
    `${API_BASE}/sounds?page=1&page_size=10`
  )
  
  // Test new sounds
  await testEndpoint(
    'New Sounds',
    `${API_BASE}/sounds/new?page=1&page_size=10`
  )
  
  // Test trending sounds
  await testEndpoint(
    'Trending Sounds',
    `${API_BASE}/sounds/trending?page=1&page_size=10`
  )
  
  // Test search
  await testEndpoint(
    'Search Sounds',
    `${API_BASE}/sounds/search?name=music&page=1&page_size=10`
  )
  
  // Test categories
  await testEndpoint(
    'Categories',
    `${API_BASE}/user/categories`
  )
}

runTests()
