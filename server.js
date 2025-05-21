// Load environment variables from .env file
require('dotenv').config();

// Import core Node.js modules
const http = require('http');
const querystring = require('querystring');

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/sms') {
    let body = '';
    
    // Collect data chunks
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    // Process complete request
    req.on('end', () => {
      try {
        // Parse incoming form data
        const formData = querystring.parse(body);
        
        // Extract message content and sender
        const incomingMessage = formData.Body || '';
        const fromNumber = formData.From || '';
        
        console.log(`Received: "${incomingMessage}" from ${fromNumber}`);
        
        // Generate response based on message content
        let responseText = '';
        
        // Simple keyword-based responses
        if (incomingMessage.toLowerCase().includes('hello')) {
          responseText = 'Hello there! How can I help you today?';
        } else if (incomingMessage.toLowerCase().includes('help')) {
          responseText = 'Available commands: hello, help, info, status';
        } else if (incomingMessage.toLowerCase().includes('info')) {
          responseText = 'This is an automated SMS response system.';
        } else if (incomingMessage.toLowerCase().includes('status')) {
          responseText = 'All systems operational.';
        } else {
          responseText = 'Thanks for your message! Reply with "help" to see available commands.';
        }
        
        // Create TwiML response
        const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseText}</Message>
</Response>`;
        
        // Send response
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twimlResponse);
        
        console.log(`Responded with: "${responseText}"`);
      } catch (error) {
        console.error('Error processing message:', error);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Server Error');
      }
    });
  } else {
    // Handle invalid requests
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Twilio number: ${process.env.TWILIO_PHONE_NUMBER}`);
});