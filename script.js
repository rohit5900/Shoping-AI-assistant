// DOM Elements
const getRecBtn = document.getElementById('getRecBtn');
const searchBtn = document.getElementById('searchBtn');
const askBtn = document.getElementById('askBtn');
const recommendationElement = document.getElementById('recommendation');
const chatContainer = document.getElementById('chatContainer');

// Sample recommendations (fallback)
const recommendations = [
    {
        title: "Noise-Cancelling Headphones",
        items: [
            "Sony WH-1000XM5 - $399 (Best overall)",
            "Bose QuietComfort 45 - $329 (Most comfortable)",
            "Apple AirPods Max - $549 (Best for Apple users)"
        ]
    },
    {
        title: "Kitchen Essentials",
        items: [
            "Instant Pot Duo - $99 (7-in-1 pressure cooker)",
            "Vitamix 5200 - $449 (Professional blender)",
            "All-Clad Stainless Cookware Set - $799 (Luxury cookware)"
        ]
    }
];

// Display functions
function displayTypingResponse(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ai-message fade-in';
  messageDiv.innerHTML = `<strong>AI Assistant:</strong> ${text}`;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addUserMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message fade-in';
  messageDiv.textContent = text;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message ai-message typing';
  typingDiv.id = 'typingIndicator';
  chatContainer.appendChild(typingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// AI Response Function
async function getAIResponse() {
  const query = document.getElementById('searchResults').value.trim();
  if (!query) return;

  addUserMessage(query);
  document.getElementById('searchResults').value = '';
  showTypingIndicator();

  try {
    const response = await fetch('/api/ai-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) throw new Error(await response.text());
    
    const data = await response.json();
    hideTypingIndicator();
    displayTypingResponse(data.response);
    
  } catch (error) {
    hideTypingIndicator();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message ai-message';
    errorDiv.innerHTML = `<strong>Error:</strong> ${error.message || 'Unable to connect to AI service'}`;
    chatContainer.appendChild(errorDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

// Product Search Function
function searchProducts() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  if (!searchTerm) return;

  const results = recommendations.find(rec => 
    rec.title.toLowerCase().includes(searchTerm)
  )?.items || ["Try searching for 'headphones' or 'kitchen'"];

  recommendationElement.innerHTML = results.map(item => `
    <div class="recommendation-card fade-in">
      <p>${item}</p>
    </div>
  `).join('');
}

// Event Listeners
askBtn.addEventListener('click', getAIResponse);
searchBtn.addEventListener('click', searchProducts);

// Enter key support
document.getElementById('searchResults').addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    getAIResponse();
  }
});

document.getElementById('search').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchProducts();
  }
});

// Initial recommendations
recommendationElement.innerHTML = recommendations[0].items.map(item => `
  <div class="recommendation-card fade-in">
    <p>${item}</p>
  </div>
`).join('');
