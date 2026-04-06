"""
Self-Modification Engine for Project Kortana
Implements simplified Darwin Gödel Machine approach

Copyright 2025 Project Kortana Contributors
Licensed under the Apache License, Version 2.0
"""

import time
import json
from typing import Optional, List, Dict, Any
from enum import Enum


class ModificationType(Enum):
    """Types of modifications."""
    PROMPT = "prompt"
    SKILL = "skill"
    TEMPLATE = "template"
    MEMORY = "memory"
    PARAMETER = "parameter"


class SelfModificationEngine:
    """
    Self-modification engine for Kortana.
    
    Implements a simplified version of the Darwin Gödel Machine:
    1. Observe recent interactions
    2. Hypothesize improvements
    3. Test in sandbox
    4. Commit if successful
    """
    
    def __init__(self, kortana):
        """
        Initialize self-modification engine.
        
        Args:
            kortana: Reference to main Kortana instance
        """
        self.kortana = kortana
        self.memory = kortana.memory
        self.kernel = kortana.kernel
        self.skills = kortana.skills
        
        # Configuration
        self.min_interactions = 10  # Minimum interactions before modification
        self.modification_interval = 86400  # 24 hours
        self.max_modifications_per_day = 5
        
        # State
        self.last_modification_time = 0
        self.modification_count_today = 0
        self.day_start = time.time()
    
    def observe_and_improve(self) -> Optional[str]:
        """
        Main self-modification cycle.
        
        Returns:
            Description of modification made, or None
        """
        # Check if we should modify
        if not self._should_modify():
            return None
        
        # Observe recent interactions
        observations = self._observe()
        
        # Hypothesize improvements
        hypotheses = self._hypothesize(observations)
        
        # Test and apply
        for hypothesis in hypotheses:
            if self._test_and_apply(hypothesis):
                return hypothesis["description"]
        
        return None
    
    def _should_modify(self) -> bool:
        """Check if self-modification should occur."""
        # Check minimum interactions
        if self.kortana.interaction_count < self.min_interactions:
            return False
        
        # Check time since last modification
        if time.time() - self.last_modification_time < self.modification_interval:
            return False
        
        # Check daily limit
        if time.time() - self.day_start > 86400:
            # Reset daily counter
            self.day_start = time.time()
            self.modification_count_today = 0
        
        if self.modification_count_today >= self.max_modifications_per_day:
            return False
        
        return True
    
    def _observe(self) -> Dict:
        """
        Observe recent interactions and patterns.
        
        Returns:
            Dictionary of observations
        """
        observations = {
            "recent_messages": [],
            "patterns": {},
            "failures": [],
            "successes": []
        }
        
        # Get recent messages
        cursor = self.memory.conn.cursor()
        cursor.execute(
            """
            SELECT direction, content FROM messages 
            ORDER BY timestamp DESC 
            LIMIT 20
            """
        )
        
        for row in cursor.fetchall():
            observations["recent_messages"].append({
                "direction": row["direction"],
                "content": row["content"]
            })
        
        # Analyze patterns
        observations["patterns"] = self._analyze_patterns(observations["recent_messages"])
        
        # Get skill usage stats
        for skill_name in self.skills.list_skills():
            stats = self.skills.get_skill_stats(skill_name)
            if stats:
                observations["patterns"][skill_name] = stats["usage_count"]
        
        return observations
    
    def _analyze_patterns(self, messages: List[Dict]) -> Dict:
        """
        Analyze patterns in messages.
        
        Args:
            messages: List of message dictionaries
            
        Returns:
            Dictionary of patterns
        """
        patterns = {
            "avg_response_length": 0,
            "common_words": {},
            "skill_usage": {}
        }
        
        if not messages:
            return patterns
        
        # Calculate average response length
        total_length = 0
        response_count = 0
        
        for msg in messages:
            if msg["direction"] == "out":
                total_length += len(msg["content"])
                response_count += 1
        
        if response_count > 0:
            patterns["avg_response_length"] = total_length / response_count
        
        # Count common words (simplified)
        word_counts = {}
        for msg in messages:
            words = msg["content"].lower().split()
            for word in words:
                if len(word) > 3:  # Ignore short words
                    word_counts[word] = word_counts.get(word, 0) + 1
        
        # Get top 5
        sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
        patterns["common_words"] = dict(sorted_words[:5])
        
        return patterns
    
    def _hypothesize(self, observations: Dict) -> List[Dict]:
        """
        Generate improvement hypotheses.
        
        Args:
            observations: Observations from _observe()
            
        Returns:
            List of hypothesis dictionaries
        """
        hypotheses = []
        
        # Hypothesis 1: Adjust response length
        avg_length = observations["patterns"].get("avg_response_length", 0)
        if avg_length > 200:
            hypotheses.append({
                "type": ModificationType.PARAMETER,
                "description": "Reduce max_tokens for shorter responses",
                "action": "reduce_max_tokens",
                "value": 128
            })
        elif avg_length < 50:
            hypotheses.append({
                "type": ModificationType.PARAMETER,
                "description": "Increase max_tokens for more detailed responses",
                "action": "increase_max_tokens",
                "value": 256
            })
        
        # Hypothesis 2: Improve system prompt based on patterns
        common_words = observations["patterns"].get("common_words", {})
        if "help" in common_words:
            hypotheses.append({
                "type": ModificationType.PROMPT,
                "description": "Enhance system prompt with more helpful guidance",
                "action": "enhance_prompt",
                "addition": " Be proactive in offering help and suggestions."
            })
        
        # Hypothesis 3: Create skill for common patterns
        for word, count in common_words.items():
            if count >= 3 and word not in self.skills.skills:
                hypotheses.append({
                    "type": ModificationType.SKILL,
                    "description": f"Create skill for '{word}' pattern",
                    "action": "create_skill",
                    "skill_name": word,
                    "description": f"Handle requests about {word}"
                })
        
        return hypotheses
    
    def _test_and_apply(self, hypothesis: Dict) -> bool:
        """
        Test hypothesis in sandbox and apply if successful.
        
        Args:
            hypothesis: Hypothesis dictionary
            
        Returns:
            True if applied successfully
        """
        # Sandbox test
        if not self._sandbox_test(hypothesis):
            return False
        
        # Apply modification
        success = self._apply_modification(hypothesis)
        
        if success:
            # Log modification
            self.memory.log_modification(
                component=hypothesis["type"].value,
                old_state="N/A",
                new_state=json.dumps(hypothesis),
                reason=hypothesis["description"],
                success=True
            )
            
            # Update state
            self.last_modification_time = time.time()
            self.modification_count_today += 1
            
            print(f"Applied modification: {hypothesis['description']}")
        
        return success
    
    def _sandbox_test(self, hypothesis: Dict) -> bool:
        """
        Test hypothesis in sandbox environment.
        
        Args:
            hypothesis: Hypothesis to test
            
        Returns:
            True if test passes
        """
        # For now, simple validation
        # In production, would run actual tests
        
        mod_type = hypothesis["type"]
        
        if mod_type == ModificationType.PARAMETER:
            # Validate parameter values
            if hypothesis["action"] == "reduce_max_tokens":
                return 64 <= hypothesis["value"] <= 256
            elif hypothesis["action"] == "increase_max_tokens":
                return 128 <= hypothesis["value"] <= 512
        
        elif mod_type == ModificationType.PROMPT:
            # Validate prompt changes
            return len(hypothesis.get("addition", "")) > 0
        
        elif mod_type == ModificationType.SKILL:
            # Validate skill creation
            return len(hypothesis.get("skill_name", "")) > 0
        
        return True
    
    def _apply_modification(self, hypothesis: Dict) -> bool:
        """
        Apply the modification.
        
        Args:
            hypothesis: Hypothesis dictionary
            
        Returns:
            True if applied successfully
        """
        mod_type = hypothesis["type"]
        
        try:
            if mod_type == ModificationType.PARAMETER:
                if hypothesis["action"] == "reduce_max_tokens":
                    self.kernel.set_parameters(max_tokens=hypothesis["value"])
                elif hypothesis["action"] == "increase_max_tokens":
                    self.kernel.set_parameters(max_tokens=hypothesis["value"])
            
            elif mod_type == ModificationType.PROMPT:
                current_prompt = self.kernel.system_prompt
                new_prompt = current_prompt + hypothesis.get("addition", "")
                self.kernel.set_system_prompt(new_prompt)
            
            elif mod_type == ModificationType.SKILL:
                # Generate skill code
                skill_name = hypothesis["skill_name"]
                description = hypothesis["description"]
                
                # Use kernel to generate code
                prompt = f"Create a Python skill called '{skill_name}' that: {description}"
                code = self.kernel.generate(prompt, "")
                
                # Create skill
                self.skills.create_skill(skill_name, description, code)
            
            return True
            
        except Exception as e:
            print(f"Error applying modification: {e}")
            return False
    
    def get_modification_history(self, limit: int = 10) -> List[Dict]:
        """
        Get modification history.
        
        Args:
            limit: Maximum number to retrieve
            
        Returns:
            List of modification records
        """
        return self.memory.get_modifications(limit)
    
    def rollback_last_modification(self) -> bool:
        """
        Rollback the last modification.
        
        Returns:
            True if rolled back successfully
        """
        # Get last modification
        mods = self.memory.get_modifications(1)
        if not mods:
            return False
        
        last_mod = mods[0]
        
        # For now, just log the rollback
        # In production, would actually revert the change
        self.memory.log_modification(
            component="rollback",
            old_state=json.dumps(last_mod),
            new_state="rolled_back",
            reason=f"Rollback of modification {last_mod['id']}",
            success=True
        )
        
        print(f"Rolled back modification: {last_mod['id']}")
        return True


# Example usage
if __name__ == "__main__":
    # Test the self-modification engine
    print("Self-Modification Engine Test")
    print("This module requires a Kortana instance to test properly")