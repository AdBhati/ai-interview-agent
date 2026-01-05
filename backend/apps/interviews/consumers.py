"""
WebSocket consumers for interview chat
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Interview, Question, Answer


class InterviewConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.interview_id = self.scope['url_route']['kwargs']['interview_id']
        self.room_group_name = f'interview_{self.interview_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'message')
            
            if message_type == 'message':
                # Handle chat message
                user_message = data.get('message', '')
                interview_id = data.get('interview_id')
                
                # Save message (optional - you might want to store chat history)
                # For now, just broadcast
                
                # Broadcast message to room group
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': user_message,
                        'sender': 'user'
                    }
                )
                
            elif message_type == 'get_next_question':
                # Get next question for the interview
                interview_id = data.get('interview_id')
                question = await self.get_current_question(interview_id)
                
                if question:
                    await self.send(text_data=json.dumps({
                        'type': 'question',
                        'question': question.question_text,
                        'question_id': question.id,
                        'order_index': question.order_index
                    }))
                    
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON format'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        sender = event.get('sender', 'system')

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'sender': sender
        }))

    @database_sync_to_async
    def get_current_question(self, interview_id):
        try:
            interview = Interview.objects.get(id=interview_id)
            question = Question.objects.filter(
                interview=interview,
                order_index=interview.current_question_index
            ).first()
            return question
        except Interview.DoesNotExist:
            return None

