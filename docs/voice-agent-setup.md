# Voice AI Phone Agent Setup Guide

## Overview
This Python-based voice AI agent handles incoming phone calls to your hair studio, manages appointments with natural conversation, checks database availability, and speaks with a human-like female voice.

## Prerequisites

1. **Twilio Account** (for phone integration)
   - Sign up at https://www.twilio.com
   - Get a phone number
   - Copy Account SID and Auth Token

2. **OpenAI API Key**
   - Get from https://platform.openai.com

## Environment Variables

Add these to your Vercel project or .env file:

\`\`\`bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+359xxxxxxxxx
OPENAI_API_KEY=sk-...
VOXAL_COMPANY_EMAIL=your_email@example.com
NEON_DATABASE_URL=your_neon_connection_string
\`\`\`

## Installation Steps

### 1. Install Python Dependencies

\`\`\`bash
cd scripts
pip install -r voice-agent-requirements.txt
\`\`\`

### 2. Setup Database

Run the SQL script to create the appointments table:
\`\`\`bash
# Execute scripts/004-create-appointments-table.sql in your Neon database
\`\`\`

### 3. Run the Voice Agent

\`\`\`bash
python voice-phone-agent.py
\`\`\`

The server will start on http://localhost:8000

### 4. Configure Twilio Webhook

1. Go to your Twilio Console
2. Select your phone number
3. Under "Voice & Fax", set:
   - A CALL COMES IN: Webhook
   - URL: https://your-domain.com/voice/incoming
   - HTTP: POST

## How It Works

1. **Customer calls** the studio phone number
2. **AI agent answers** with female voice: "Здравейте! Обаждате се във Voxal Hair Studio..."
3. **Customer speaks** their request (date, time, service, stylist)
4. **AI extracts information** using GPT-4
5. **System checks** database for existing appointments
6. **If available**: Creates appointment in database
7. **If not available**: Suggests alternative times
8. **Confirms booking**

## Features

- ✅ Natural Bulgarian conversation
- ✅ Human-like female voice (OpenAI TTS "nova")
- ✅ Speech-to-text (Whisper API)
- ✅ Smart information extraction
- ✅ Database storage and availability checking
- ✅ Handles incomplete information
- ✅ Alternative time suggestions

## Available Services

- Подстригване
- Боядисване
- Кичур
- Прическа
- Маникюр
- Педикюр

## Available Stylists

- Мария
- Анна
- Елена
- София

## Testing

Call the Twilio number and try:
- "Искам да си запиша час за подстригване утре в 14 часа при Мария"
- "Бихте ли ме записали за боядисване на 15-ти януари в 10 сутринта"

## Deployment

For production, deploy to a server with public HTTPS endpoint:
- Vercel Functions
- AWS Lambda + API Gateway
- Heroku
- Digital Ocean

## Troubleshooting

- **No response**: Check Twilio webhook URL is correct and accessible
- **Wrong language**: Verify language='bg-BG' in TwiML
- **Database errors**: Verify NEON_DATABASE_URL is correct

## Cost Estimates

- **Twilio**: ~$0.01-0.02 per minute
- **OpenAI Whisper**: ~$0.006 per minute
- **OpenAI GPT-4**: ~$0.03 per request
- **OpenAI TTS**: ~$0.015 per minute
- **Total per call**: ~$0.10-0.30 (average 3-minute call)
