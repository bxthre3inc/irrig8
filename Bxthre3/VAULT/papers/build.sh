#!/bin/bash
# Build wrapper — called with: bash build.sh PAPER_NUMBER AUTHORNOTE
PAPER_NUM=$1
AUTHOR_NOTE=$2
PDF_DIR=/home/workspace/Bxthre3/VAULT/papers/pdf

mkdir -p "$PDF_DIR"

# Create metadata JSON for this paper
cat > /tmp/zenodo_meta_${PAPER_NUM}.json << EOF
{
  "metadata": {
    "title": "PAPER_${PAPER_NUM}",
    "upload_type": "publication",
    "publication_type": "article",
    "description": "BX3 Research — Paper $PAPER_NUM",
    "creators": [{"name": "Beebe, Jeremy Blaine Thompson", "affiliation": "Bxthre3 Inc.", "orcid": "0009-0009-2394-9714"}],
    "keywords": ["BX3 Framework", "autonomous systems", "AI governance", "deterministic systems"]
  }
}
EOF

echo "Paper $PAPER_NUM metadata created"
