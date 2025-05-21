from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create Flask app
app = Flask(__name__)

@app.route('/sms', methods=['POST'])
def sms_reply():
    """Respond to incoming SMS messages"""
    # Get the message the user sent
    incoming_msg = request.values.get('Body', '').lower().strip()
    from_number = request.values.get('From', '')
    
    # Print incoming message details (for debugging)
    print(f"Received: '{incoming_msg}' from {from_number}")
    
    # Create a response
    resp = MessagingResponse()
    
    # Add logic to handle different messages
    if 'hello' in incoming_msg:
        resp.message("Hi there! How can I help you today?")
    elif 'help' in incoming_msg:
        resp.message("Available commands: hello, help, info, time, weather")
    elif 'info' in incoming_msg:
        resp.message("This is an SMS bot powered by Twilio and hosted on GitHub.")
    elif 'time' in incoming_msg:
        from datetime import datetime
        current_time = datetime.now().strftime("%H:%M:%S")
        resp.message(f"The current time is {current_time}")
    elif 'weather' in incoming_msg:
        resp.message("It's currently sunny and 75°F in New Orleans.")
    else:
        resp.message("Thanks for your message! Reply with 'help' to see available commands.")
    
    # Return the TwiML response
    return str(resp)

if __name__ == '__main__':
    # Get port from environment variable or use 5000 as default
    port = int(os.environ.get('PORT', 5000))
    
    # Run the app
    app.run(host='0.0.0.0', port=port)