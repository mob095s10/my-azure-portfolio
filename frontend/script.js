document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const responseDiv = document.getElementById('response');
    const button = e.target.querySelector('button');
    
    // Disable button during request
    button.disabled = true;
    button.textContent = 'Sending...';
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            responseDiv.className = 'success';
            responseDiv.textContent = data.message || 'Message sent successfully!';
            e.target.reset();
        } else {
            throw new Error(data.message || 'Something went wrong');
        }
    } catch (error) {
        responseDiv.className = 'error';
        responseDiv.textContent = 'Error: ' + error.message;
    } finally {
        button.disabled = false;
        button.textContent = 'Send Message';
    }
});