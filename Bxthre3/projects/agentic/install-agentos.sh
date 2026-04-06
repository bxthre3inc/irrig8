#!/bin/bash
#
# AgentOS Desktop Installer & Launcher v0.2.0
# Automatically downloads dependencies and runs AgentOS Desktop
#

set -e

# Configuration
VERSION="0.2.0"
JAR_URL="https://zo.pub/brodiblanco/agentos-v0.2.0/AgentOS-v0.2.0-Desktop.jar"
INSTALL_DIR="$HOME/.agentos"
CONFIG_FILE="$INSTALL_DIR/config.json"

colors() {
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
}

check_java() {
    echo "Checking Java installation..."
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
        if [ "$JAVA_VERSION" -ge 17 ]; then
            echo "✓ Java $JAVA_VERSION detected"
            return 0
        fi
    fi
    
    echo "${RED}✗ Java 17+ not found${NC}"
    echo ""
    echo "Install Java 17:"
    echo "  Ubuntu/Debian: sudo apt-get install openjdk-17-jdk"
    echo "  macOS: brew install openjdk@17"
    echo "  Download: https://adoptium.net/"
    exit 1
}

download_jar() {
    echo "Checking for AgentOS v$VERSION..."
    
    mkdir -p "$INSTALL_DIR"
    
    if [ -f "$INSTALL_DIR/AgentOS-Desktop-$VERSION.jar" ]; then
        echo "✓ AgentOS v$VERSION already installed"
        return 0
    fi
    
    echo "Downloading AgentOS Desktop v$VERSION..."
    if command -v wget &> /dev/null; then
        wget --progress=bar:force -O "$INSTALL_DIR/AgentOS-Desktop-$VERSION.jar" "$JAR_URL" 2>&1 | tail -5
    elif command -v curl &> /dev/null; then
        curl -# -L -o "$INSTALL_DIR/AgentOS-Desktop-$VERSION.jar" "$JAR_URL" 2>&1 | tail -5
    else
        echo "${RED}✗ wget or curl required${NC}"
        exit 1
    fi
    
    echo "✓ Download complete"
}

create_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        echo "Creating default config..."
        cat > "$CONFIG_FILE" << 'EOF'
{
    "mesh_server": "https://agentos-mesh-server-brodiblanco.zocomputer.io",
    "node_id": 2,
    "node_name": "DESKTOP",
    "auto_connect": true,
    "theme": "dark"
}
EOF
        echo "✓ Config created at $CONFIG_FILE"
    fi
}

create_launcher() {
    LAUNCHER="$HOME/.local/bin/agentos"
    
    if [ ! -f "$LAUNCHER" ]; then
        echo "Creating system launcher..."
        mkdir -p "$HOME/.local/bin"
        
        cat > "$LAUNCHER" << 'EOF'
#!/bin/bash
# AgentOS Desktop Launcher
exec java -Dagentos.config="$HOME/.agentos/config.json" \
          -jar "$HOME/.agentos/AgentOS-Desktop-0.2.0.jar" "$@"
EOF
        chmod +x "$LAUNCHER"
        
        # Add to PATH if needed
        if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"
            echo "${YELLOW}Note: Run 'source ~/.bashrc' to update PATH${NC}"
        fi
        
        echo "✓ Created 'agentos' command"
        echo "   Usage: agentos"
    fi
}

run_agentos() {
    echo ""
    echo "${GREEN}╔══════════════════════════════════════════╗${NC}"
    echo "${GREEN}║     Starting AgentOS Desktop v0.2.0    ║${NC}"
    echo "${GREEN}╚══════════════════════════════════════════╝${NC}"
    echo ""
    
    cd "$INSTALL_DIR"
    
    # Run with proper JVM options
    java \
        -Dagentos.config="$CONFIG_FILE" \
        -Dagentos.version="$VERSION" \
        -Dcompose.desktop.window.width=1280 \
        -Dcompose.desktop.window.height=900 \
        -jar "AgentOS-Desktop-$VERSION.jar" \
        "$@" 2>&1 &
    
    PID=$!
    echo "${GREEN}✓ AgentOS started (PID: $PID)${NC}"
    echo ""
    echo "Server: https://agentos-mesh-server-brodiblanco.zocomputer.io"
    echo "Node ID: 2 (DESKTOP)"
    echo ""
    echo "Logs: tail -f $INSTALL_DIR/agentos.log"
    
    # Create log file
    exec 1>>"$INSTALL_DIR/agentos.log" 2>&1
}

print_help() {
    cat << 'EOF'
AgentOS Desktop Installer v0.2.0

Usage: ./install-agentos.sh [OPTIONS]

Options:
  --install    Download and install only
  --run        Run AgentOS (default)
  --reinstall  Re-download and install
  --update     Update to latest version
  --help       Show this help

Examples:
  ./install-agentos.sh           # Install and run
  ./install-agentos.sh --install  # Install only
  ./install-agentos.sh --run      # Run only (if installed)

EOF
}

main() {
    colors
    
    case "${1:-run}" in
        --help|-h)
            print_help
            exit 0
            ;;
        --install)
            check_java
            download_jar
            create_config
            create_launcher
            echo ""
            echo "${GREEN}✓ Installation complete${NC}"
            echo "   Run: ./install-agentos.sh --run"
            ;;
        --run)
            if [ ! -f "$INSTALL_DIR/AgentOS-Desktop-$VERSION.jar" ]; then
                echo "AgentOS not found. Installing first..."
                check_java
                download_jar
                create_config
                create_launcher
            fi
            run_agentos
            ;;
        --reinstall|--update)
            rm -f "$INSTALL_DIR/AgentOS-Desktop-$VERSION.jar" 2>/dev/null || true
            check_java
            download_jar
            create_config
            create_launcher
            run_agentos
            ;;
        *)
            echo "Unknown option: $1"
            print_help
            exit 1
            ;;
    esac
}

main "$@"
