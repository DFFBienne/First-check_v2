#!/usr/bin/env bash
# ============================================================
# setup.sh — Télécharge les dépendances externes pour
#             fonctionnement 100% hors ligne
# Usage: bash setup.sh
# ============================================================

set -e

echo "📦 Téléchargement de pdf-lib v1.17.1..."
curl -L "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js" \
     -o pdf-lib.min.js \
     --progress-bar

echo "✅ pdf-lib.min.js téléchargé ($(du -h pdf-lib.min.js | cut -f1))"
echo ""
echo "🚀 Projet prêt ! Structure :"
echo ""
ls -lh *.html *.css *.js *.json 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'
echo ""
echo "💡 Pour tester localement :"
echo "   python3 -m http.server 8080"
echo "   → Ouvrir http://localhost:8080"
