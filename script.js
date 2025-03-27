async function getAIResponse() {
    const query = document.getElementById('searchResults').value.trim();
    const responseElement = document.getElementById('assistantResponse');
    
    if (!query) {
        responseElement.innerHTML = "<span style='color: #b0b0b0;'>Please ask a shopping question.</span>";
        return;
    }

    responseElement.innerHTML = "<em class='typing' style='color: #b0b0b0;'>Thinking...</em>";
    
    try {
        console.log('Sending query to server:', query); // Debug log
        const response = await fetch('/api/ai-assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server error');
        }
        
        const data = await response.json();
        console.log('Received response from server:', data); // Debug log
        displayTypingResponse(data.response);
        
    } catch (error) {
        console.error('Frontend error:', error); // Debug log
        responseElement.innerHTML = `
            <strong style="color: #ff6b6b;">Error:</strong> 
            <span style="color: #ffffff;">${error.message || 'Connection failed'}</span>
        `;
        responseElement.classList.add('error');
    }
}