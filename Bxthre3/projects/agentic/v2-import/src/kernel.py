"""
Kernel Module for Project Kortana
Minimal Language Model inference engine using llama.cpp

Copyright 2025 Project Kortana Contributors
Licensed under the Apache License, Version 2.0
"""

import os
import ctypes
from typing import Optional, List


class Kernel:
    """
    Minimal LLM inference engine.
    
    Uses llama.cpp compiled as a shared library for
    efficient on-device inference.
    """
    
    def __init__(self, model_path: str):
        """
        Initialize the kernel with a model.
        
        Args:
            model_path: Path to GGUF model file
        """
        self.model_path = model_path
        self.context = None
        self.model = None
        self._llama_lib = None
        
        # Configuration
        self.max_tokens = 256
        self.temperature = 0.7
        self.top_p = 0.9
        self.top_k = 40
        self.repeat_penalty = 1.1
        
        # System prompt
        self.system_prompt = """You are Kortana, a helpful AI assistant running on a mobile phone. You respond via SMS, so keep responses concise and helpful. You can create skills to help users with tasks. Be friendly and efficient."""
        
        # Try to load model
        self._load_model()
    
    def _load_model(self):
        """Load the language model."""
        if not os.path.exists(self.model_path):
            print(f"Model not found: {self.model_path}")
            print("Running in simulation mode")
            self._simulation_mode = True
            return
        
        self._simulation_mode = False
        
        # Try to load llama.cpp shared library
        try:
            self._load_llama_library()
            self._init_model()
        except Exception as e:
            print(f"Failed to load model: {e}")
            print("Falling back to simulation mode")
            self._simulation_mode = True
    
    def _load_llama_library(self):
        """Load llama.cpp shared library."""
        lib_paths = [
            "libllama.so",
            "/system/lib64/libllama.so",
            "/data/data/com.kortana/lib/libllama.so",
            "./libllama.so"
        ]
        
        for path in lib_paths:
            if os.path.exists(path):
                self._llama_lib = ctypes.CDLL(path)
                print(f"Loaded llama.cpp from {path}")
                return
        
        raise RuntimeError("Could not find llama.cpp library")
    
    def _init_model(self):
        """Initialize model with llama.cpp."""
        # This would use the llama.cpp C API
        # llama_init_from_file, llama_new_context_with_model, etc.
        print(f"Initializing model: {self.model_path}")
        # Placeholder - actual implementation would call llama.cpp API
    
    def generate(self, prompt: str, context: str = "") -> str:
        """
        Generate a response to the prompt.
        
        Args:
            prompt: User input
            context: Conversation context
            
        Returns:
            Generated response
        """
        if self._simulation_mode:
            return self._simulate_response(prompt)
        
        # Build full prompt
        full_prompt = self._build_prompt(prompt, context)
        
        # Generate using llama.cpp
        response = self._generate_tokens(full_prompt)
        
        return response
    
    def _build_prompt(self, prompt: str, context: str) -> str:
        """Build the full prompt for the model."""
        parts = [self.system_prompt]
        
        if context:
            parts.append(f"\nContext: {context}")
        
        parts.append(f"\nUser: {prompt}")
        parts.append("\nKortana:")
        
        return "\n".join(parts)
    
    def _generate_tokens(self, prompt: str) -> str:
        """Generate tokens using llama.cpp."""
        # This would use the llama.cpp C API for tokenization and generation
        # llama_tokenize, llama_eval, llama_sample_top_p_top_k, etc.
        
        # Placeholder - actual implementation would:
        # 1. Tokenize prompt
        # 2. Run inference loop
        # 3. Sample tokens
        # 4. Decode tokens to string
        
        return "Response generated (placeholder)"
    
    def _simulate_response(self, prompt: str) -> str:
        """Simulate a response for testing."""
        prompt_lower = prompt.lower()
        
        # Simple pattern matching for simulation
        if "hello" in prompt_lower or "hi" in prompt_lower:
            return "Hello! I'm Kortana, your AI assistant. How can I help you today?"
        
        elif "how are you" in prompt_lower:
            return "I'm running smoothly on your device! Ready to help with whatever you need."
        
        elif "create" in prompt_lower and "skill" in prompt_lower:
            return "I'd be happy to create a skill for you. Use /create <name> <description> to create a new skill."
        
        elif "what can you do" in prompt_lower or "help" in prompt_lower:
            return "I can help with conversations, create new skills, remember our chats, and improve myself over time. Try sending /help for commands."
        
        elif "weather" in prompt_lower:
            return "I'd need a weather skill to check that for you. Would you like me to create one?"
        
        elif "time" in prompt_lower:
            from datetime import datetime
            return f"The current time is {datetime.now().strftime('%H:%M')}."
        
        elif "bye" in prompt_lower or "goodbye" in prompt_lower:
            return "Goodbye! Send me a message anytime you need help."
        
        else:
            return f"I received your message. As a tiny AI running on your phone, I'm still learning. Could you rephrase that?"
    
    def set_system_prompt(self, prompt: str):
        """Update the system prompt."""
        self.system_prompt = prompt
        print("System prompt updated")
    
    def set_parameters(self, **kwargs):
        """Set generation parameters."""
        if "max_tokens" in kwargs:
            self.max_tokens = kwargs["max_tokens"]
        if "temperature" in kwargs:
            self.temperature = kwargs["temperature"]
        if "top_p" in kwargs:
            self.top_p = kwargs["top_p"]
        if "top_k" in kwargs:
            self.top_k = kwargs["top_k"]
        if "repeat_penalty" in kwargs:
            self.repeat_penalty = kwargs["repeat_penalty"]
    
    def get_model_info(self) -> dict:
        """Get information about the loaded model."""
        return {
            "model_path": self.model_path,
            "model_exists": os.path.exists(self.model_path),
            "simulation_mode": self._simulation_mode,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }
    
    def close(self):
        """Clean up model resources."""
        if self.context:
            # llama_free(self.context)
            pass
        if self.model:
            # llama_free_model(self.model)
            pass
        print("Kernel resources released")


class TinyKernel(Kernel):
    """
    Even more minimal kernel for resource-constrained devices.
    
    Uses smaller context windows and simpler generation.
    """
    
    def __init__(self, model_path: str):
        """Initialize tiny kernel with minimal settings."""
        super().__init__(model_path)
        self.max_tokens = 128  # Smaller output
        self.temperature = 0.8  # Higher temp for variety
    
    def generate(self, prompt: str, context: str = "") -> str:
        """Generate shorter response."""
        response = super().generate(prompt, context)
        # Truncate if needed
        if len(response) > 160:  # SMS limit
            response = response[:157] + "..."
        return response


# Example usage
if __name__ == "__main__":
    # Test the kernel
    kernel = Kernel("models/tinystories-33m-q4.gguf")
    
    print("Model Info:", kernel.get_model_info())
    
    # Test generation
    test_prompts = [
        "Hello!",
        "What can you do?",
        "Tell me a short story"
    ]
    
    for prompt in test_prompts:
        print(f"\nUser: {prompt}")
        response = kernel.generate(prompt)
        print(f"Kortana: {response}")
    
    kernel.close()