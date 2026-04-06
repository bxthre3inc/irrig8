"""
Skills Module for Project Kortana
File-based skill library with meta-skill capability

Copyright 2025 Project Kortana Contributors
Licensed under the Apache License, Version 2.0
"""

import os
import json
import time
import re
from typing import Optional, List, Dict, Any


class SkillLibrary:
    """
    File-based skill library for Kortana.
    
    Skills are stored as JSON files containing executable Python code.
    The library includes the meta-skill "create_skill" by default.
    """
    
    def __init__(self, skills_path: str):
        """
        Initialize skill library.
        
        Args:
            skills_path: Directory path for skill storage
        """
        self.skills_path = skills_path
        self.skills = {}
        
        # Ensure directory exists
        os.makedirs(skills_path, exist_ok=True)
        
        # Load existing skills
        self._load_skills()
        
        # Create built-in skills if not present
        self._create_builtin_skills()
    
    def _load_skills(self):
        """Load all skills from storage."""
        for filename in os.listdir(self.skills_path):
            if filename.endswith('.json'):
                skill_path = os.path.join(self.skills_path, filename)
                try:
                    with open(skill_path, 'r') as f:
                        skill = json.load(f)
                    skill_name = filename[:-5]  # Remove .json
                    self.skills[skill_name] = skill
                    print(f"Loaded skill: {skill_name}")
                except Exception as e:
                    print(f"Error loading skill {filename}: {e}")
    
    def _create_builtin_skills(self):
        """Create built-in skills."""
        # Meta-skill: create_skill
        if "create_skill" not in self.skills:
            self.create_skill(
                "create_skill",
                "Create a new skill from a description",
                self._get_create_skill_code()
            )
        
        # Help skill
        if "help" not in self.skills:
            self.create_skill(
                "help",
                "Show available skills and commands",
                self._get_help_skill_code()
            )
    
    def _get_create_skill_code(self) -> str:
        """Return the create_skill meta-skill code."""
        return '''def execute(input_text):
    """
    Meta-skill to create new skills.
    Input format: "skill_name: description of what skill should do"
    """
    # Parse input
    if ":" not in input_text:
        return "Usage: skill_name: description"
    
    parts = input_text.split(":", 1)
    name = parts[0].strip()
    description = parts[1].strip()
    
    # This skill is handled specially by the system
    return f"Creating skill: {name} - {description}"
'''
    
    def _get_help_skill_code(self) -> str:
        """Return the help skill code."""
        return '''def execute(input_text):
    """Show help information."""
    return """Kortana Help:
- Just chat naturally with me
- /help - Show this message
- /create <name> <desc> - Create a skill
- /list - List skills
- /stats - Show statistics
Skills are created through conversation!
"""
'''
    
    def create_skill(self, name: str, description: str, code: str) -> bool:
        """
        Create a new skill.
        
        Args:
            name: Skill name (alphanumeric and underscores only)
            description: What the skill does
            code: Python code with execute(input) function
            
        Returns:
            True if created successfully
        """
        # Validate name
        if not re.match(r'^[a-z][a-z0-9_]*$', name.lower()):
            print(f"Invalid skill name: {name}")
            return False
        
        # Create skill object
        skill = {
            "name": name.lower(),
            "description": description,
            "code": code,
            "created": time.time(),
            "usage_count": 0,
            "success_rate": 0.0
        }
        
        # Validate code
        if not self._validate_skill_code(code):
            print(f"Invalid skill code for: {name}")
            return False
        
        # Save to file
        skill_path = os.path.join(self.skills_path, f"{name.lower()}.json")
        try:
            with open(skill_path, 'w') as f:
                json.dump(skill, f, indent=2)
            
            # Add to memory
            self.skills[name.lower()] = skill
            print(f"Created skill: {name}")
            return True
            
        except Exception as e:
            print(f"Error creating skill {name}: {e}")
            return False
    
    def _validate_skill_code(self, code: str) -> bool:
        """
        Validate skill code.
        
        Args:
            code: Python code to validate
            
        Returns:
            True if valid
        """
        # Check for execute function
        if "def execute(" not in code:
            return False
        
        # Try to compile (syntax check)
        try:
            compile(code, '<string>', 'exec')
        except SyntaxError:
            return False
        
        return True
    
    def get_skill(self, name: str) -> Optional[Dict]:
        """
        Get a skill by name.
        
        Args:
            name: Skill name
            
        Returns:
            Skill dictionary or None
        """
        return self.skills.get(name.lower())
    
    def execute_skill(self, name: str, input_text: str) -> str:
        """
        Execute a skill.
        
        Args:
            name: Skill name
            input_text: Input to pass to skill
            
        Returns:
            Skill output or error message
        """
        skill = self.get_skill(name)
        if not skill:
            return f"Skill not found: {name}"
        
        try:
            # Create execution environment
            local_vars = {}
            exec(skill["code"], {"__builtins__": __builtins__}, local_vars)
            
            # Execute
            result = local_vars["execute"](input_text)
            
            # Update stats
            skill["usage_count"] += 1
            
            return str(result)
            
        except Exception as e:
            print(f"Error executing skill {name}: {e}")
            return f"Skill error: {str(e)}"
    
    def find_skill(self, message: str) -> Optional[str]:
        """
        Find a relevant skill for a message.
        
        Args:
            message: User message
            
        Returns:
            Skill name or None
        """
        message_lower = message.lower()
        
        # Check for explicit skill invocation
        for skill_name in self.skills:
            if message_lower.startswith(skill_name + " "):
                return skill_name
            if message_lower == skill_name:
                return skill_name
        
        # Check keywords in descriptions
        words = set(message_lower.split())
        for skill_name, skill in self.skills.items():
            desc_words = set(skill["description"].lower().split())
            if words & desc_words:  # Intersection
                return skill_name
        
        return None
    
    def list_skills(self) -> List[str]:
        """
        List all skill names.
        
        Returns:
            List of skill names
        """
        return list(self.skills.keys())
    
    def update_skill(self, name: str, updates: Dict) -> bool:
        """
        Update a skill.
        
        Args:
            name: Skill name
            updates: Dictionary of updates
            
        Returns:
            True if updated successfully
        """
        skill = self.get_skill(name)
        if not skill:
            return False
        
        # Apply updates
        for key, value in updates.items():
            if key in skill:
                skill[key] = value
        
        # Save
        skill_path = os.path.join(self.skills_path, f"{name.lower()}.json")
        try:
            with open(skill_path, 'w') as f:
                json.dump(skill, f, indent=2)
            return True
        except Exception as e:
            print(f"Error updating skill {name}: {e}")
            return False
    
    def delete_skill(self, name: str) -> bool:
        """
        Delete a skill.
        
        Args:
            name: Skill name
            
        Returns:
            True if deleted successfully
        """
        if name.lower() not in self.skills:
            return False
        
        # Remove from memory
        del self.skills[name.lower()]
        
        # Remove file
        skill_path = os.path.join(self.skills_path, f"{name.lower()}.json")
        try:
            os.remove(skill_path)
            print(f"Deleted skill: {name}")
            return True
        except Exception as e:
            print(f"Error deleting skill {name}: {e}")
            return False
    
    def get_skill_stats(self, name: str) -> Optional[Dict]:
        """
        Get statistics for a skill.
        
        Args:
            name: Skill name
            
        Returns:
            Statistics dictionary or None
        """
        skill = self.get_skill(name)
        if not skill:
            return None
        
        return {
            "name": skill["name"],
            "usage_count": skill["usage_count"],
            "success_rate": skill["success_rate"],
            "created": skill["created"]
        }


class SkillBuilder:
    """
    Helper class for building skills from templates.
    """
    
    @staticmethod
    def create_simple_skill(name: str, description: str, response: str) -> Dict:
        """Create a simple echo-style skill."""
        code = f'''def execute(input_text):
    """{description}"""
    return "{response}"
'''
        return {
            "name": name,
            "description": description,
            "code": code
        }
    
    @staticmethod
    def create_calculation_skill(name: str, description: str, formula: str) -> Dict:
        """Create a calculation skill."""
        code = f'''def execute(input_text):
    """{description}"""
    try:
        result = {formula}
        return str(result)
    except Exception as e:
        return f"Error: {{e}}"
'''
        return {
            "name": name,
            "description": description,
            "code": code
        }
    
    @staticmethod
    def create_pattern_skill(name: str, description: str, patterns: Dict[str, str]) -> Dict:
        """Create a pattern-matching skill."""
        patterns_str = json.dumps(patterns)
        code = f'''def execute(input_text):
    """{description}"""
    patterns = {patterns_str}
    for pattern, response in patterns.items():
        if pattern.lower() in input_text.lower():
            return response
    return "I don't have a response for that."
'''
        return {
            "name": name,
            "description": description,
            "code": code
        }


# Example usage
if __name__ == "__main__":
    # Test the skills module
    skills = SkillLibrary("/tmp/kortana_skills")
    
    # Create a test skill
    skills.create_skill(
        "greeter",
        "Greet the user",
        '''def execute(input_text):
    name = input_text.strip() or "friend"
    return f"Hello, {name}! Nice to meet you!"
'''
    )
    
    # List skills
    print("Skills:", skills.list_skills())
    
    # Execute a skill
    result = skills.execute_skill("greeter", "World")
    print(f"Result: {result}")
    
    # Test skill finding
    skill = skills.find_skill("greeter John")
    print(f"Found skill: {skill}")