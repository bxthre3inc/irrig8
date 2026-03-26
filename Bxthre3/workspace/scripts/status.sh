#!/bin/bash
# Show status
[truncated]
======== $project ========"
  cd $project && git status -sb
  cd ..
done

cd ..
echo ""
echo "Meta repo:"
git status -sb
