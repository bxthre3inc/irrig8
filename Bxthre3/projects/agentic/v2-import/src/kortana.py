"""
Project Kortana - Main Entry Point
A Self-Improving AI Agent for Android with SMS Interface

Copyright 2025 Project Kortana Contributors
Licensed under the Apache License, Version 2.0
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sms_handler import SMSHandler
from kernel import Kernel
from memory import Memory
from skills import SkillLibrary
from self_mod import SelfModificationEngine


class Kortana:
    """
    Main Kortana agent class.
    
    Coordinates all components: SMS handling, LLM kernel,
    memory, skills, and self-modification engine.
    """
    
    def __init__(self, config_path: str = None):
        """
        Initialize Kortana.
        
        Args:
            config_path: Path to configuration file
        """
        # Default paths
        self.base_path = "/sdcard/kortana"
        self.model_path = os.path.join(self.base_path, "models/tinystories-33m-q4.gguf")
        self.db_path = os.path.join(self.base_path, "kortana.db")
        self.skills_path = os.path.join(self.base_path, "skills")
        
        # Load configuration if provided
        self.config = self._load_config(config_path)
        
        # Initialize components
        self.memory = Memory(self.db_path)
        self.kernel = Kernel(self.model_path)
        self.skills = SkillLibrary(self.skills_path)
        self.self_mod = SelfModificationEngine(self)
        self.sms = SMSHandler(self._handle_message)
        
        # State
        self.running = False
        self.interaction_count = 0
        
    def _load_config(self, config_path: str) -> dict:
        """Load configuration from file."""
        import json
        if config_path and os.path.exists(config_path):
            with open(config_path, 'r') as f:
                return json.load(f)
        return {
            "model": "tinystories-33m-q4.gguf",
            "max_tokens": 256,
            "temperature": 0.7,
            "self_mod_frequency": "daily"
        }
    
    def _handle_message(self, sender: str, message: str) -> str:
        """
        Handle incoming SMS message.
        
        Args:
            sender: Phone number of sender
            message: Message content
            
        Returns:
            Response to send back
        """
        # Log incoming message
        self.memory.log_message("in", sender, message)
        
        # Check if this is a skill command
        if message.startswith("/"):
            return self._handle_command(sender, message)
        
        # Check for skill invocation
        skill_match = self.skills.find_skill(message)
        if skill_match:
            response = self.skills.execute_skill(skill_match, message)
        else:
            # Generate response using kernel
            context = self.memory.get_context(sender)
            response = self.kernel.generate(message, context)
        
        # Log outgoing message
        self.memory.log_message("out", sender, response)
        
        # Track interaction for self-modification
        self.interaction_count += 1
        
        # Trigger self-modification check if needed
        if self._should_self_modify():
            self.self_mod.observe_and_improve()
        
        return response
    
    def _handle_command(self, sender: str, message: str) -> str:
        """Handle command messages starting with /."""
        parts = message[1:].split(maxsplit=1)
        command = parts[0].lower()
        args = parts[1] if len(parts) > 1 else ""
        
        if command == "help":
            return self._get_help()
        elif command == "create":
            return self._create_skill(args)
        elif command == "list":
            return self._list_skills()
        elif command == "improve":
            return self._trigger_improvement()
        elif command == "stats":
            return self._get_stats()
        else:
            return f"Unknown command: {command}. Type /help for available commands."
    
    def _get_help(self) -> str:
        """Return help message."""
        return """Kortana Commands:
/help - Show this message
/create <name> <description> - Create a new skill
/list - List available skills
/improve - Trigger self-improvement
/stats - Show interaction statistics"""
    
    def _create_skill(self, args: str) -> str:
        """Create a new skill from user request."""
        if not args:
            return "Usage: /create <name> <description>"
        
        parts = args.split(maxsplit=1)
        name = parts[0]
        description = parts[1] if len(parts) > 1 else f"Skill: {name}"
        
        # Generate skill code using kernel
        prompt = f"Create a Python function called 'execute' for a skill named '{name}' that: {description}. The function should take one string input and return a string output."
        code = self.kernel.generate(prompt, "")
        
        # Create skill
        success = self.skills.create_skill(name, description, code)
        
        if success:
            return f"Skill '{name}' created successfully!"
        else:
            return f"Failed to create skill '{name}'. Please try again."
    
    def _list_skills(self) -> str:
        """List available skills."""
        skills = self.skills.list_skills()
        if not skills:
            return "No skills available. Create one with /create"
        return "Available skills:\n" + "\n".join(f"- {s}" for s in skills)
    
    def _trigger_improvement(self) -> str:
        """Manually trigger self-improvement."""
        result = self.self_mod.observe_and_improve()
        if result:
            return f"Self-improvement completed: {result}"
        return "No improvements identified at this time."
    
    def _get_stats(self) -> str:
        """Get interaction statistics."""
        stats = self.memory.get_stats()
        return f"""Kortana Statistics:
Interactions: {stats['total_messages']}
Skills: {len(self.skills.list_skills())}
Improvements: {stats['modifications']}
Uptime: {self._get_uptime()}"""
    
    def _should_self_modify(self) -> bool:
        """Check if self-modification should occur."""
        freq = self.config.get("self_mod_frequency", "daily")
        if freq == "per-interaction":
            return True
        elif freq == "daily":
            # Check if 24 hours since last modification
            last_mod = self.memory.get_last_modification_time()
            if last_mod:
                import time
                return (time.time() - last_mod) > 86400  # 24 hours
            return True
        return False
    
    def _get_uptime(self) -> str:
        """Get human-readable uptime."""
        # Placeholder - would track actual start time
        return "N/A"
    
    def start(self):
        """Start Kortana and begin listening for SMS."""
        print("Kortana starting...")
        print(f"Model: {self.model_path}")
        print(f"Memory: {self.db_path}")
        print(f"Skills: {self.skills_path}")
        
        self.running = True
        self.sms.start_listening()
        
        print("Kortana is running. Send an SMS to interact.")
    
    def stop(self):
        """Stop Kortana."""
        print("Kortana stopping...")
        self.running = False
        self.sms.stop_listening()
        self.memory.close()
        print("Kortana stopped.")


def main():
    """Main entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Project Kortana")
    parser.add_argument("--config", "-c", help="Path to config file")
    parser.add_argument("--model", "-m", help="Path to model file")
    parser.add_argument("--debug", "-d", action="store_true", help="Enable debug mode")
    args = parser.parse_args()
    
    # Initialize Kortana
    kortana = Kortana(args.config)
    
    if args.model:
        kortana.model_path = args.model
    
    try:
        kortana.start()
        # Keep running
        import time
        while kortana.running:
            time.sleep(1)
    except KeyboardInterrupt:
        kortana.stop()


if __name__ == "__main__":
    main()