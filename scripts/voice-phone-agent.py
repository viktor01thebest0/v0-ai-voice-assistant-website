"""
Voice AI Phone Agent for Hair Studio Appointments
This script handles incoming phone calls and manages appointment bookings with natural conversation.
"""

import os
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import asyncio

# Required packages (install via: pip install twilio openai psycopg2-binary python-dotenv)
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Gather
import openai
import psycopg2
from psycopg2.extras import RealDictCursor

# Configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')  # Your Twilio phone number
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
DATABASE_URL = os.getenv('NEON_DATABASE_URL')

# Available services and stylists
SERVICES = [
    "Подстригване",
    "Боядисване",
    "Кичур",
    "Прическа",
    "Маникюр",
    "Педикюр"
]

STYLISTS = [
    "Мария",
    "Анна",
    "Елена",
    "София"
]

class VoiceAIAgent:
    """AI-powered voice agent for handling phone calls and appointments"""
    
    def __init__(self):
        self.twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        openai.api_key = OPENAI_API_KEY
        self.conversation_history = []
        
    def connect_database(self):
        """Connect to Neon PostgreSQL database"""
        return psycopg2.connect(DATABASE_URL)
    
    async def process_speech_to_text(self, audio_url: str) -> str:
        """Convert speech to text using OpenAI Whisper"""
        # Download audio from Twilio
        response = self.twilio_client.recordings.list(limit=1)
        if response:
            audio_data = response[0].media_url
            
            # Use OpenAI Whisper for transcription
            transcript = await openai.Audio.atranscribe(
                model="whisper-1",
                file=audio_data,
                language="bg"  # Bulgarian
            )
            return transcript['text']
        return ""
    
    async def generate_ai_response(self, user_message: str, context: Dict) -> str:
        """Generate natural AI response using GPT"""
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        system_prompt = f"""Ти си приятелски и професионален AI асистент на фризьорско студио "Luxury Hair Studio".
        Твоята задача е да записваш часове за клиенти по телефона.
        
        Налични услуги: {', '.join(SERVICES)}
        Налични стилисти: {', '.join(STYLISTS)}
        
        Работно време: Понеделник-Петък: 9:00-18:00, Събота: 10:00-16:00
        
        Текущ контекст на разговора:
        - Име на клиент: {context.get('customer_name', 'неизвестно')}
        - Дата: {context.get('date', 'неизвестна')}
        - Час: {context.get('time', 'неизвестен')}
        - Услуга: {context.get('service', 'неизвестна')}
        - Стилист: {context.get('stylist', 'неизвестен')}
        
        Говори естествено и приятелски. Ако липсва информация, питай за нея.
        Винаги потвърди всички детайли преди да запишеш часа.
        """
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                *self.conversation_history
            ],
            temperature=0.7,
            max_tokens=150
        )
        
        ai_message = response.choices[0].message.content
        self.conversation_history.append({
            "role": "assistant",
            "content": ai_message
        })
        
        return ai_message
    
    async def text_to_speech(self, text: str) -> str:
        """Convert text to speech using OpenAI TTS with female voice"""
        response = await openai.Audio.acreate(
            model="tts-1-hd",
            voice="nova",  # Female voice (options: alloy, echo, fable, onyx, nova, shimmer)
            input=text,
            speed=1.0
        )
        
        # Save audio file temporarily
        audio_path = f"/tmp/response_{datetime.now().timestamp()}.mp3"
        with open(audio_path, 'wb') as f:
            f.write(response.content)
        
        return audio_path
    
    def check_database_availability(self, date: str, time: str, stylist: str) -> bool:
        """Check if the requested time slot is available in database"""
        conn = self.connect_database()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        try:
            cursor.execute("""
                SELECT COUNT(*) as count
                FROM appointments
                WHERE appointment_date = %s 
                AND appointment_time = %s 
                AND stylist = %s
                AND status != 'cancelled'
            """, (date, time, stylist))
            
            result = cursor.fetchone()
            return result['count'] == 0  # Available if no appointments found
            
        except Exception as e:
            print(f"Error checking availability: {e}")
            return False
        finally:
            cursor.close()
            conn.close()
    
    def save_appointment_to_database(self, appointment: Dict):
        """Save appointment to Neon database"""
        conn = self.connect_database()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO appointments 
                (customer_name, customer_phone, appointment_date, appointment_time, 
                 service, stylist, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                appointment['customer_name'],
                appointment['phone'],
                appointment['date'],
                appointment['time'],
                appointment['service'],
                appointment['stylist'],
                'confirmed'
            ))
            
            conn.commit()
            print(f"Appointment saved to database for {appointment['customer_name']}")
            
        except Exception as e:
            print(f"Error saving to database: {e}")
            conn.rollback()
        finally:
            cursor.close()
            conn.close()
    
    def extract_appointment_details(self, text: str, context: Dict) -> Dict:
        """Extract appointment details from customer speech using AI"""
        prompt = f"""Извлечи детайлите за час от следния текст на български: "{text}"
        
        Текущ контекст: {json.dumps(context, ensure_ascii=False)}
        
        Върни JSON с полета: date (YYYY-MM-DD), time (HH:MM), service, stylist, customer_name
        Ако някоя информация липсва, остави полето празно.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        try:
            details = json.loads(response.choices[0].message.content)
            return details
        except:
            return {}

# FastAPI endpoint for Twilio webhooks
from fastapi import FastAPI, Request, Form
from fastapi.responses import Response

app = FastAPI()
agent = VoiceAIAgent()
call_contexts = {}  # Store conversation context per call

@app.post("/voice/incoming")
async def handle_incoming_call(request: Request):
    """Handle incoming phone call"""
    response = VoiceResponse()
    
    # Greet the caller with female voice
    response.say(
        "Здравейте! Обаждате се във Voxal Hair Studio. Казвам се София и съм вашият AI асистент. Как мога да ви помогна днес?",
        language="bg-BG",
        voice="Polly.Joanna"  # Female voice
    )
    
    # Gather speech input
    gather = Gather(
        input='speech',
        action='/voice/process',
        language='bg-BG',
        speech_timeout='auto',
        speech_model='experimental_conversations'
    )
    response.append(gather)
    
    return Response(content=str(response), media_type="text/xml")

@app.post("/voice/process")
async def process_speech(
    CallSid: str = Form(...),
    SpeechResult: str = Form(None)
):
    """Process customer speech and respond"""
    response = VoiceResponse()
    
    if not SpeechResult:
        response.say("Съжалявам, не ви чух. Моля, повторете.", language="bg-BG")
        return Response(content=str(response), media_type="text/xml")
    
    # Get or create context for this call
    if CallSid not in call_contexts:
        call_contexts[CallSid] = {
            'customer_name': '',
            'phone': '',
            'date': '',
            'time': '',
            'service': '',
            'stylist': ''
        }
    
    context = call_contexts[CallSid]
    
    # Extract details from speech
    details = agent.extract_appointment_details(SpeechResult, context)
    context.update({k: v for k, v in details.items() if v})
    
    # Generate AI response
    ai_response = await agent.generate_ai_response(SpeechResult, context)
    
    # Check if we have all required information
    if all([context.get('date'), context.get('time'), context.get('service'), context.get('stylist')]):
        # Check availability
        is_available = agent.check_database_availability(
            context['date'],
            context['time'],
            context['stylist']
        )
        
        if is_available:
            # Create appointment
            agent.save_appointment_to_database({
                'customer_name': context.get('customer_name', 'Неизвестен'),
                'phone': context.get('phone', ''),
                'date': context['date'],
                'time': context['time'],
                'service': context['service'],
                'stylist': context['stylist']
            })
            
            ai_response = f"Чудесно! Записах ви час за {context['date']} в {context['time']} часа за {context['service']} при {context['stylist']}. Довиждане!"
            response.say(ai_response, language="bg-BG", voice="Polly.Joanna")
            # End call
            response.hangup()
            del call_contexts[CallSid]
            return Response(content=str(response), media_type="text/xml")
        else:
            ai_response = f"Съжалявам, но {context['stylist']} е зает/а на {context['date']} в {context['time']} часа. Можете ли да изберете друга дата или час?"
            context['date'] = ''
            context['time'] = ''
    
    # Continue conversation
    response.say(ai_response, language="bg-BG", voice="Polly.Joanna")
    
    # Gather next input
    gather = Gather(
        input='speech',
        action='/voice/process',
        language='bg-BG',
        speech_timeout='auto'
    )
    response.append(gather)
    
    return Response(content=str(response), media_type="text/xml")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
