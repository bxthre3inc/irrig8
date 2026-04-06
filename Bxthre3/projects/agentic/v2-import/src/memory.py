"""
Memory Module for Project Kortana
Persistent storage using SQLite

Copyright 2025 Project Kortana Contributors
Licensed under the Apache License, Version 2.0
"""

import sqlite3
import json
import time
from typing import Optional, List, Dict, Any


class Memory:
    """
    Persistent memory layer for Kortana.
    
    Uses SQLite for storing:
    - Conversation history
    - Learnings and patterns
    - Self-modification logs
    - User preferences
    """
    
    def __init__(self, db_path: str):
        """
        Initialize memory database.
        
        Args:
            db_path: Path to SQLite database file
        """
        self.db_path = db_path
        self.conn = None
        self._init_database()
    
    def _init_database(self):
        """Initialize database schema."""
        # Ensure directory exists
        import os
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        # Connect to database
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row
        
        # Create tables
        self._create_tables()
    
    def _create_tables(self):
        """Create database tables."""
        cursor = self.conn.cursor()
        
        # Messages table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp REAL NOT NULL,
                direction TEXT NOT NULL,
                sender TEXT,
                content TEXT NOT NULL
            )
        """)
        
        # Learnings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS learnings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp REAL NOT NULL,
                trigger_pattern TEXT NOT NULL,
                response TEXT,
                success_count INTEGER DEFAULT 0,
                failure_count INTEGER DEFAULT 0
            )
        """)
        
        # Self-modification log
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS modifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp REAL NOT NULL,
                component TEXT NOT NULL,
                old_state TEXT,
                new_state TEXT,
                reason TEXT,
                success BOOLEAN DEFAULT TRUE
            )
        """)
        
        # User preferences
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS preferences (
                key TEXT PRIMARY KEY,
                value TEXT,
                updated_at REAL
            )
        """)
        
        # Skills usage tracking
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS skill_usage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                skill_name TEXT NOT NULL,
                timestamp REAL NOT NULL,
                input TEXT,
                output TEXT,
                success BOOLEAN DEFAULT TRUE
            )
        """)
        
        self.conn.commit()
    
    def log_message(self, direction: str, sender: str, content: str):
        """
        Log a message to conversation history.
        
        Args:
            direction: 'in' for received, 'out' for sent
            sender: Phone number or identifier
            content: Message content
        """
        cursor = self.conn.cursor()
        cursor.execute(
            "INSERT INTO messages (timestamp, direction, sender, content) VALUES (?, ?, ?, ?)",
            (time.time(), direction, sender, content)
        )
        self.conn.commit()
    
    def get_context(self, sender: str, limit: int = 5) -> str:
        """
        Get conversation context for a sender.
        
        Args:
            sender: Phone number
            limit: Maximum number of recent messages
            
        Returns:
            Formatted context string
        """
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT direction, content FROM messages 
            WHERE sender = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
            """,
            (sender, limit)
        )
        
        messages = cursor.fetchall()
        
        if not messages:
            return ""
        
        # Build context string
        context_parts = []
        for msg in reversed(messages):  # Oldest first
            prefix = "User" if msg["direction"] == "in" else "Kortana"
            context_parts.append(f"{prefix}: {msg['content']}")
        
        return "\n".join(context_parts)
    
    def add_learning(self, trigger: str, response: str):
        """
        Add a new learning pattern.
        
        Args:
            trigger: Pattern that triggers this learning
            response: Learned response
        """
        cursor = self.conn.cursor()
        
        # Check if pattern exists
        cursor.execute(
            "SELECT id, success_count FROM learnings WHERE trigger_pattern = ?",
            (trigger,)
        )
        existing = cursor.fetchone()
        
        if existing:
            # Update existing
            cursor.execute(
                "UPDATE learnings SET success_count = success_count + 1 WHERE id = ?",
                (existing["id"],)
            )
        else:
            # Create new
            cursor.execute(
                "INSERT INTO learnings (timestamp, trigger_pattern, response, success_count) VALUES (?, ?, ?, 1)",
                (time.time(), trigger, response)
            )
        
        self.conn.commit()
    
    def get_learning(self, trigger: str) -> Optional[str]:
        """
        Get learned response for a trigger.
        
        Args:
            trigger: Pattern to match
            
        Returns:
            Learned response or None
        """
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT response FROM learnings 
            WHERE trigger_pattern = ? AND success_count > failure_count
            ORDER BY success_count DESC 
            LIMIT 1
            """,
            (trigger,)
        )
        
        result = cursor.fetchone()
        return result["response"] if result else None
    
    def log_modification(self, component: str, old_state: str, new_state: str, reason: str, success: bool = True):
        """
        Log a self-modification.
        
        Args:
            component: Component that was modified
            old_state: State before modification
            new_state: State after modification
            reason: Why modification was made
            success: Whether modification was successful
        """
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT INTO modifications (timestamp, component, old_state, new_state, reason, success)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (time.time(), component, old_state, new_state, reason, success)
        )
        self.conn.commit()
    
    def get_modifications(self, limit: int = 10) -> List[Dict]:
        """
        Get recent modifications.
        
        Args:
            limit: Maximum number to retrieve
            
        Returns:
            List of modification records
        """
        cursor = self.conn.cursor()
        cursor.execute(
            """
            SELECT * FROM modifications 
            ORDER BY timestamp DESC 
            LIMIT ?
            """,
            (limit,)
        )
        
        return [dict(row) for row in cursor.fetchall()]
    
    def get_last_modification_time(self) -> Optional[float]:
        """Get timestamp of last modification."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT MAX(timestamp) as ts FROM modifications")
        result = cursor.fetchone()
        return result["ts"] if result and result["ts"] else None
    
    def set_preference(self, key: str, value: Any):
        """
        Set a user preference.
        
        Args:
            key: Preference key
            value: Preference value (will be JSON serialized)
        """
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT OR REPLACE INTO preferences (key, value, updated_at)
            VALUES (?, ?, ?)
            """,
            (key, json.dumps(value), time.time())
        )
        self.conn.commit()
    
    def get_preference(self, key: str, default: Any = None) -> Any:
        """
        Get a user preference.
        
        Args:
            key: Preference key
            default: Default value if not found
            
        Returns:
            Preference value
        """
        cursor = self.conn.cursor()
        cursor.execute("SELECT value FROM preferences WHERE key = ?", (key,))
        result = cursor.fetchone()
        
        if result:
            return json.loads(result["value"])
        return default
    
    def log_skill_usage(self, skill_name: str, input_text: str, output_text: str, success: bool = True):
        """
        Log skill usage for tracking.
        
        Args:
            skill_name: Name of skill used
            input_text: Input to skill
            output_text: Output from skill
            success: Whether execution was successful
        """
        cursor = self.conn.cursor()
        cursor.execute(
            """
            INSERT INTO skill_usage (skill_name, timestamp, input, output, success)
            VALUES (?, ?, ?, ?, ?)
            """,
            (skill_name, time.time(), input_text, output_text, success)
        )
        self.conn.commit()
    
    def get_stats(self) -> Dict:
        """
        Get memory statistics.
        
        Returns:
            Dictionary of statistics
        """
        cursor = self.conn.cursor()
        
        # Total messages
        cursor.execute("SELECT COUNT(*) as count FROM messages")
        total_messages = cursor.fetchone()["count"]
        
        # Total modifications
        cursor.execute("SELECT COUNT(*) as count FROM modifications")
        modifications = cursor.fetchone()["count"]
        
        # Successful modifications
        cursor.execute("SELECT COUNT(*) as count FROM modifications WHERE success = 1")
        successful_mods = cursor.fetchone()["count"]
        
        # Total learnings
        cursor.execute("SELECT COUNT(*) as count FROM learnings")
        learnings = cursor.fetchone()["count"]
        
        return {
            "total_messages": total_messages,
            "modifications": modifications,
            "successful_modifications": successful_mods,
            "learnings": learnings
        }
    
    def cleanup_old_messages(self, days: int = 30):
        """
        Remove messages older than specified days.
        
        Args:
            days: Number of days to keep
        """
        cutoff = time.time() - (days * 86400)
        cursor = self.conn.cursor()
        cursor.execute("DELETE FROM messages WHERE timestamp < ?", (cutoff,))
        self.conn.commit()
        print(f"Cleaned up messages older than {days} days")
    
    def export_data(self) -> Dict:
        """
        Export all data for backup.
        
        Returns:
            Dictionary containing all data
        """
        cursor = self.conn.cursor()
        
        data = {
            "messages": [],
            "learnings": [],
            "modifications": [],
            "preferences": []
        }
        
        # Export messages
        cursor.execute("SELECT * FROM messages")
        for row in cursor.fetchall():
            data["messages"].append(dict(row))
        
        # Export learnings
        cursor.execute("SELECT * FROM learnings")
        for row in cursor.fetchall():
            data["learnings"].append(dict(row))
        
        # Export modifications
        cursor.execute("SELECT * FROM modifications")
        for row in cursor.fetchall():
            data["modifications"].append(dict(row))
        
        # Export preferences
        cursor.execute("SELECT * FROM preferences")
        for row in cursor.fetchall():
            data["preferences"].append(dict(row))
        
        return data
    
    def close(self):
        """Close database connection."""
        if self.conn:
            self.conn.close()
            print("Memory database closed")


# Example usage
if __name__ == "__main__":
    # Test the memory module
    memory = Memory("/tmp/kortana_test.db")
    
    # Test messages
    memory.log_message("in", "+1234567890", "Hello Kortana!")
    memory.log_message("out", "+1234567890", "Hello! How can I help?")
    
    # Get context
    context = memory.get_context("+1234567890")
    print(f"Context: {context}")
    
    # Test learnings
    memory.add_learning("greeting", "Hello! How can I help you today?")
    learned = memory.get_learning("greeting")
    print(f"Learned: {learned}")
    
    # Test modifications
    memory.log_modification("system_prompt", "Old prompt", "New prompt", "User feedback")
    
    # Get stats
    stats = memory.get_stats()
    print(f"Stats: {stats}")
    
    memory.close()