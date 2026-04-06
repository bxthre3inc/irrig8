# Contributing to Project Agentic Enterprise

Thank you for your interest in contributing to Project Agentic Enterprise! We welcome contributions from everyone, whether you're a developer, researcher, designer, or simply an enthusiast.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Areas](#contribution-areas)
- [Submission Guidelines](#submission-guidelines)
- [Review Process](#review-process)
- [Recognition](#recognition)

---

## Code of Conduct

### Our Pledge

We are committed to making participation in Project Agentic Enterprise a harassment-free experience for everyone, regardless of level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Our Standards

Examples of behavior that contributes to a positive environment:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior:
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, or personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other unethical or unprofessional conduct

### Reporting Issues

If you experience or witness unacceptable behavior, please contact us at agentic-enterprise-conduct@example.com.

---

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Android device with 4GB+ RAM (for testing)
- Git
- Basic understanding of Python and Android development

### First Steps

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/agentic-enterprise.git
   cd agentic-enterprise
   ```

2. **Set Up Development Environment**
   ```bash
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

3. **Run Tests**
   ```bash
   # Run all tests
   pytest
   
   # Run specific test
   pytest tests/test_sms_handler.py
   ```

4. **Build APK**
   ```bash
   ./build_apk.sh
   ```

---

## Development Setup

### Project Structure

```
agentic-enterprise/
├── src/                    # Source code
│   ├── sms_handler.py     # SMS I/O layer
│   ├── kernel.py          # LLM inference engine
│   ├── skills.py          # Skill library management
│   ├── memory.py          # Memory layer (SQLite)
│   └── self_mod.py        # Self-modification engine
├── models/                # Model files (not in repo)
├── tests/                 # Test suite
├── docs/                  # Documentation
├── skills/                # Example skills
├── android/               # Android app source
├── scripts/               # Build and utility scripts
├── requirements.txt       # Python dependencies
├── requirements-dev.txt   # Development dependencies
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

### Coding Standards

We follow these conventions:

1. **Python Style**: PEP 8
   ```bash
   # Auto-format code
   black src/
   
   # Check style
   flake8 src/
   ```

2. **Type Hints**: Use type hints for all functions
   ```python
   def process_message(message: str) -> str:
       """Process incoming SMS message."""
       return response
   ```

3. **Documentation**: Docstrings for all modules, classes, and functions
   ```python
   def create_skill(name: str, description: str, code: str) -> bool:
       """
       Create a new skill.
       
       Args:
           name: Skill name
           description: Skill description
           code: Python code for the skill
           
       Returns:
           True if successful, False otherwise
       """
   ```

4. **Testing**: Write tests for all new functionality
   ```python
   def test_create_skill():
       skill = create_skill("test", "Test skill", "def execute(): pass")
       assert skill is True
   ```

### Git Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Changes**
   - Write code following our standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add weather checking skill"
   ```

   **Commit Message Format:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

4. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Then create PR on GitHub
   ```

---

## Contribution Areas

### 1. Core Development

**Areas of Focus:**
- Improve LLM inference efficiency
- Enhance self-modification algorithms
- Optimize memory usage
- Add new model support

**Skills Needed:**
- Python
- C/C++ (for llama.cpp integration)
- Android development
- Machine learning

### 2. Skill Development

**Create New Skills:**
- Productivity skills (calendar, reminders)
- Educational skills (quizzes, flashcards)
- Creative skills (story writing, brainstorming)
- Utility skills (calculations, conversions)

**Example Skills:**
```json
{
  "name": "math_helper",
  "description": "Perform mathematical calculations",
  "code": "def execute(input): return str(eval(input))",
  "created": "2025-01-15",
  "usage_count": 0,
  "success_rate": 0.0
}
```

### 3. Documentation

**Areas of Focus:**
- Improve README and getting started guides
- Write API documentation
- Create tutorials and examples
- Translate documentation to other languages

### 4. Testing

**Areas of Focus:**
- Write unit tests for core components
- Add integration tests
- Test on different Android devices
- Performance testing and optimization

### 5. Research

**Areas of Focus:**
- Conduct experiments with different model sizes
- Study self-improvement effectiveness
- Analyze user interaction patterns
- Publish research findings

### 6. Community

**Areas of Focus:**
- Help new contributors
- Answer questions on Discord
- Organize community events
- Create educational content

---

## Submission Guidelines

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] Tests pass locally (`pytest`)
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] Commit messages follow format
- [ ] PR description clearly explains changes
- [ ] No merge conflicts

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested this change

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
```

### Large Changes

For significant changes or new features:

1. **Open an Issue First** - Discuss the change with maintainers
2. **Create a Design Document** - Outline the approach
3. **Get Approval** - Wait for approval before implementation
4. **Implement Incrementally** - Break into smaller PRs

---

## Review Process

### What Happens After You Submit

1. **Automated Checks**
   - CI/CD runs tests
   - Code style checks
   - Build verification

2. **Code Review**
   - Maintainers review your code
   - Provide feedback and suggestions
   - May request changes

3. **Testing**
   - Tested on multiple devices
   - Performance benchmarks
   - Integration testing

4. **Approval and Merge**
   - At least one maintainer approval required
   - All checks must pass
   - Merged into main branch

### Review Timeline

- Small changes: 1-3 days
- Medium changes: 3-7 days
- Large changes: 1-2 weeks

### During Review

- Be responsive to feedback
- Address comments promptly
- Ask questions if anything is unclear
- Be open to suggestions

---

## Recognition

### Contributor Recognition

We value all contributions! Contributors are recognized through:

1. **Contributors List** - Listed in README and website
2. **Hall of Fame** - Special recognition for significant contributions
3. **Badges** - GitHub badges for different contribution types
4. **Annual Awards** - Community-voted awards for outstanding contributions

### Becoming a Maintainer

Active contributors may be invited to become maintainers:

**Criteria:**
- Consistent contributions over 6+ months
- High-quality code and reviews
- Active community participation
- Understanding of project architecture

**Responsibilities:**
- Review and merge PRs
- Guide new contributors
- Make architectural decisions
- Represent the project

---

## Getting Help

### Resources

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)
- **Discord**: [Join our server](#)

### Asking Questions

1. Check existing documentation and issues
2. Search discussions for similar questions
3. Create a new discussion with clear question
4. Be patient and respectful

### Reporting Bugs

1. Check if bug already reported
2. Create issue with:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Device and Android version
   - Logs if available

---

## License

By contributing to Project Agentic Enterprise, you agree that your contributions will be licensed under the Apache 2.0 License.

---

## Questions?

If you have any questions about contributing, please:

- Open a discussion on GitHub
- Join our Discord server
- Email us at agentic-enterprise-project@example.com

---

**Thank you for contributing to Project Agentic Enterprise!** 🚀

Together, we're making AI accessible to everyone.