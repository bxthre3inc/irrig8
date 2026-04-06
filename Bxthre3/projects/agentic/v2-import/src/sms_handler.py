"""
SMS Handler for Project Kortana
Handles sending and receiving SMS messages on Android

Copyright 2025 Project Kortana Contributors
Licensed under the Apache License, Version 2.0
"""

import json
import time
from typing import Callable, Optional


class SMSHandler:
    """
    Handles SMS communication on Android devices.
    
    Uses Android's native SMS functionality through
    Python-for-Android or native Android API.
    """
    
    def __init__(self, message_callback: Callable[[str, str], str]):
        """
        Initialize SMS handler.
        
        Args:
            message_callback: Function to call when message received.
                             Takes (sender, message) and returns response.
        """
        self.message_callback = message_callback
        self.listening = False
        self._android = None
        self._try_load_android_api()
    
    def _try_load_android_api(self):
        """Try to load Android API (only works on actual device)."""
        try:
            # Try importing Android API (available on device)
            from jnius import autoclass
            self._android = autoclass('org.kivy.android.PythonActivity')
            self._sms_manager = autoclass('android.telephony.SmsManager')
            self._intent = autoclass('android.content.Intent')
            self._has_android = True
            print("Android API loaded successfully")
        except ImportError:
            print("Android API not available - running in simulation mode")
            self._has_android = False
    
    def send_sms(self, recipient: str, message: str) -> bool:
        """
        Send an SMS message.
        
        Args:
            recipient: Phone number to send to
            message: Message content
            
        Returns:
            True if sent successfully
        """
        if self._has_android:
            return self._send_sms_android(recipient, message)
        else:
            return self._send_sms_simulation(recipient, message)
    
    def _send_sms_android(self, recipient: str, message: str) -> bool:
        """Send SMS using Android API."""
        try:
            sms = self._sms_manager.getDefault()
            sms.sendTextMessage(recipient, None, message, None, None)
            print(f"SMS sent to {recipient}: {message[:50]}...")
            return True
        except Exception as e:
            print(f"Failed to send SMS: {e}")
            return False
    
    def _send_sms_simulation(self, recipient: str, message: str) -> bool:
        """Simulate sending SMS (for testing)."""
        print(f"[SIMULATION] SMS to {recipient}: {message}")
        return True
    
    def receive_sms(self, sender: str, message: str) -> str:
        """
        Process received SMS and generate response.
        
        Args:
            sender: Phone number of sender
            message: Message content
            
        Returns:
            Response to send back
        """
        print(f"SMS received from {sender}: {message}")
        
        # Call the message callback
        response = self.message_callback(sender, message)
        
        # Auto-send response
        if response:
            self.send_sms(sender, response)
        
        return response
    
    def start_listening(self):
        """Start listening for incoming SMS messages."""
        self.listening = True
        
        if self._has_android:
            self._start_sms_receiver()
        else:
            self._start_simulation()
    
    def stop_listening(self):
        """Stop listening for SMS messages."""
        self.listening = False
        print("SMS handler stopped")
    
    def _start_sms_receiver(self):
        """Start Android SMS receiver."""
        # In production, this would register a BroadcastReceiver
        # for SMS_RECEIVED intents
        print("SMS receiver started (Android)")
        
        # Placeholder for actual BroadcastReceiver implementation
        # The real implementation would use jnius to create a
        # BroadcastReceiver that calls receive_sms() when
        # an SMS arrives
    
    def _start_simulation(self):
        """Start simulation mode for testing."""
        print("SMS handler started (simulation mode)")
        print("In simulation mode, call receive_sms(sender, message) to simulate incoming SMS")
    
    def get_recent_messages(self, limit: int = 10) -> list:
        """
        Get recent SMS messages from device.
        
        Args:
            limit: Maximum number of messages to retrieve
            
        Returns:
            List of (sender, message, timestamp) tuples
        """
        if not self._has_android:
            return []
        
        # In production, this would query Android's SMS content provider
        # Uri uri = Uri.parse("content://sms/inbox");
        # Cursor cursor = getContentResolver().query(uri, null, null, null, null);
        
        return []
    
    def delete_message(self, message_id: str) -> bool:
        """
        Delete an SMS message from device.
        
        Args:
            message_id: ID of message to delete
            
        Returns:
            True if deleted successfully
        """
        if not self._has_android:
            return False
        
        # In production, this would delete from SMS content provider
        return False


class SMSReceiver:
    """
    Broadcast receiver for incoming SMS.
    
    This would be registered in the Android manifest and
    activated when SMS arrives.
    """
    
    @staticmethod
    def on_receive(context, intent):
        """
        Called when SMS is received.
        
        Args:
            context: Android context
            intent: Received intent containing SMS data
        """
        # This would be implemented as a Java BroadcastReceiver
        # that calls back into Python
        pass


# Example usage and testing
if __name__ == "__main__":
    def handle_message(sender: str, message: str) -> str:
        """Example message handler."""
        return f"You said: {message}"
    
    handler = SMSHandler(handle_message)
    handler.start_listening()
    
    # Simulate receiving a message
    response = handler.receive_sms("+1234567890", "Hello Kortana!")
    print(f"Response: {response}")
    
    handler.stop_listening()