#!/bin/bash
# Coordinated 
[truncated]
c "Release $VERSION"
  git push origin main
  git push origin $VERSION
fi

echo ""
echo "Tagged all projects with $VERSION"
