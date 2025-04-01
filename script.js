// DOM Elements
const getRecBtn = document.getElementById('getRecBtn');
const searchBtn = document.getElementById('searchBtn');
const askBtn = document.getElementById('askBtn');
const recommendationElement = document.getElementById('recommendation');
const responseElement = document.getElementById('assistantResponse');

// Event Listeners
getRecBtn.addEventListener('click', getRecommendation);
searchBtn.addEventListener('click', searchProducts);
askBtn.addEventListener('click', getAIResponse);

// Sample data (fallback)
const recommendations = [
  "Sony WH-1000XM5 headphones - Best noise cancellation ($399)",
  "Instant Pot Duo - 7-in-1 electric pressure cooker ($99)",
  "Kindle Paperwhite - 6.8\" display with warm light ($139)"
];

const products = {
  "laptop": ["MacBook Pro M2", "Dell XPS 13", "HP Spectre x360"],
  "phone": ["iPhone 15", "Samsung Galaxy S23", "Google Pixel 7"],
  "headphones": ["Sony WH-1000XM5", "Bose QuietComfort 45", "Apple AirPods Pro 2"]
};

// Display typing animation
function displayTypingResponse(text) {
  responseElement.innerHTML = `
    <strong style="color: #1a73e8;">AI Assistant:</strong> 
    <span id="typingText" style="color: #ffffff;"></span>
    <span class="typing"></span>
  `;
  
  const typingElement = document.getElementById('typingText');
  let i = 0;
  const typing = setInterval(() => {
    if (i < text.length) {
      typingElement.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typing);
      document.querySelector('.typing').style.display = 'none';
    }
  }, 20);
}

// Functions
function getRecommendation() {
  const randomIndex = Math.floor(Math.random() * recommendations.length);
  recommendationElement.innerHTML = `
    <strong style="color: #0d8a72;">Recommendation:</strong> 
    <span style="color: #ffffff;">${recommendations[randomIndex]}</span>
  `;
  recommendationElement.classList.add('fade-in');
  setTimeout(() => recommendationElement.classList.remove('fade-in'), 500);
}

function searchProducts() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  let results = products[searchTerm] || 
    Object.values(products).flat().filter(p => 
      p.toLowerCase().includes(searchTerm)
    );
  
  if (!results.length) {
    results = ["No matches found. Try 'laptop', 'phone', or 'headphones'"];
  }
  
  recommendationElement.innerHTML = `
    <strong style="color: #1a73e8;">Results:</strong> 
    <span style="color: #ffffff;">${results.join(', ')}</span>
  `;
  recommendationElement.classList.add('fade-in');
  setTimeout(() => recommendationElement.classList.remove('fade-in'), 500);
}

async function getAIResponse() {
  const query = document.getElementById('searchResults').value.trim();
  const responseElement = document.getElementById('assistantResponse');
  
  if (!query) {
    responseElement.innerHTML = "<span style='color: #b0b0b0;'>Please ask a shopping question.</span>";
    return;
  }

  responseElement.innerHTML = "<em class='typing' style='color: #b0b0b0;'>Thinking...</em>";
  
  try {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    displayTypingResponse(data.response);
    
  } catch (error) {
    responseElement.innerHTML = `
      <strong style="color: #ff6b6b;">Error:</strong> 
      <span style="color: #ffffff;">${error.message || 'Service unavailable'}</span>
    `;
    responseElement.classList.add('error');
  }
}

// Event listeners for buttons
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'translateY(1px)';
    btn.style.boxShadow = 'none';
  });
  btn.addEventListener('mouseup', () => {
    btn.style.transform = '';
    btn.style.boxShadow = '';
  });
});

// Enter key support
document.getElementById('search').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchProducts();
});
document.getElementById('searchResults').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') getAIResponse();
});
