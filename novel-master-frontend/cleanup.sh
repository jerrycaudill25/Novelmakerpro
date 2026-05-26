#!/bin/bash
# =============================================================================
# NOVEL MASTER — PRODUCTION DEPLOYMENT CLEANUP SCRIPT
# Run this BEFORE building for AWS EC2
# =============================================================================

echo "🔍 Novel Master Production Cleanup"
echo "===================================="

# Step 1: Identify and remove duplicate flat files
echo ""
echo "Step 1: Removing duplicate flat files..."

# These are the OLD flat versions that conflict with nested structure
DUPLICATES=(
  "api.ts"
  "AISidebar.tsx"
  "FullScreenEditor.tsx"
  "FullScreenEditor.tsx.txt"
  "AISettingsSection.tsx"
  "StyleProfileViewer.tsx"
  "LorebookPanel.tsx"
  "SettingsPage.tsx"
  "useStore.ts"
  "index.ts"
)

for file in "${DUPLICATES[@]}"; do
  if [ -f "$file" ]; then
    echo "  🗑️  Removing duplicate: $file"
    rm "$file"
  else
    echo "  ✅ Already clean: $file"
  fi
done

# Step 2: Verify nested structure exists
echo ""
echo "Step 2: Verifying canonical nested structure..."

CANONICAL=(
  "services/api.ts"
  "components/editor/AISidebar.tsx"
  "components/editor/FullScreenEditor.tsx"
  "components/settings/AISettingsSection.tsx"
  "components/settings/StyleProfileViewer.tsx"
  "components/lorebook/LorebookPanel.tsx"
  "pages/SettingsPage.tsx"
  "store/useStore.ts"
  "types/index.ts"
)

ALL_PRESENT=true
for file in "${CANONICAL[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ Found: $file"
  else
    echo "  ❌ MISSING: $file"
    ALL_PRESENT=false
  fi
done

if [ "$ALL_PRESENT" = false ]; then
  echo ""
  echo "❌ FATAL: Some canonical files are missing. Do not proceed."
  exit 1
fi

# Step 3: Check for remaining react-query v3 imports
echo ""
echo "Step 3: Checking for legacy react-query v3 imports..."

V3_IMPORTS=$(grep -r "from 'react-query'" --include="*.ts" --include="*.tsx" . || true)
if [ -n "$V3_IMPORTS" ]; then
  echo "  ❌ Found v3 imports:"
  echo "$V3_IMPORTS"
  echo "  Fix these before deployment."
  exit 1
else
  echo "  ✅ No legacy v3 imports found"
fi

# Step 4: Verify .env.production exists
echo ""
echo "Step 4: Checking environment configuration..."

if [ -f ".env.production" ]; then
  echo "  ✅ .env.production found"
  if grep -q "VITE_API_URL" .env.production; then
    echo "  ✅ VITE_API_URL configured"
  else
    echo "  ⚠️  VITE_API_URL not found in .env.production"
  fi
else
  echo "  ⚠️  .env.production not found — creating template"
  cat > .env.production << 'EOF'
# Novel Master Production Environment
# DO NOT commit this file with real secrets
VITE_API_URL=
VITE_WS_URL=
VITE_APP_NAME=Novel Master
EOF
  echo "  ✅ Created .env.production template"
fi

# Step 5: TypeScript type check
echo ""
echo "Step 5: Running TypeScript check..."
if command -v npx &> /dev/null; then
  npx tsc --noEmit
  if [ $? -eq 0 ]; then
    echo "  ✅ TypeScript check passed"
  else
    echo "  ❌ TypeScript errors found — fix before deployment"
    exit 1
  fi
else
  echo "  ⚠️  npx not available — skipping TypeScript check"
fi

# Step 6: Build test
echo ""
echo "Step 6: Testing production build..."
if [ -f "package.json" ]; then
  npm run build
  if [ $? -eq 0 ]; then
    echo "  ✅ Build successful"
    echo ""
    echo "📦 Build output:"
    ls -lh dist/ 2>/dev/null || echo "  (dist/ folder not found)"
  else
    echo "  ❌ Build failed — fix errors before deployment"
    exit 1
  fi
else
  echo "  ⚠️  package.json not found — skipping build test"
fi

echo ""
echo "===================================="
echo "✅ CLEANUP COMPLETE"
echo "===================================="
echo ""
echo "Your frontend is ready for AWS EC2 deployment."
echo ""
echo "Next steps:"
echo "  1. Commit cleaned file structure"
echo "  2. Push to your repository"
echo "  3. Deploy to EC2 following the checklist in PRODUCTION_READINESS_REPORT.md"
echo ""
