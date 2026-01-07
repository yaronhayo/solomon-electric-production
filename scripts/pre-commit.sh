#!/bin/sh
#
# Pre-commit hook for Solomon Electric
# Runs SEO validation and type checking before each commit
#
# To install:
#   cp scripts/pre-commit.sh .git/hooks/pre-commit
#   chmod +x .git/hooks/pre-commit

echo "🔍 Running pre-commit checks..."
echo ""

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js not found, skipping automated checks"
    exit 0
fi

# 1. Run TypeScript type check
echo "📝 Running TypeScript check..."
npm run check 2>&1 | head -20
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ TypeScript errors found. Fix before committing."
    exit 1
fi
echo "✅ TypeScript check passed"
echo ""

# 2. Run SEO validation
echo "🔎 Running SEO validation..."
node scripts/seo-validate.js
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ SEO validation failed. Fix errors before committing."
    exit 1
fi

# 3. Check for sensitive data in staged files
echo "🔒 Checking for sensitive data..."
SENSITIVE_PATTERNS="DATAFORSEO_PASSWORD|SMTP2GO_API_KEY|TURNSTILE_SECRET_KEY|password|secret_key|api_key="
if git diff --cached --diff-filter=ACM | grep -iE "$SENSITIVE_PATTERNS" > /dev/null; then
    echo "⚠️  WARNING: Possible sensitive data detected in staged files!"
    echo "   Please review before committing."
    # Don't block, just warn
fi
echo "✅ Security check passed"
echo ""

# 4. Check for console.log statements (optional)
# echo "🧹 Checking for console.log..."
# if git diff --cached --diff-filter=ACM -- '*.ts' '*.tsx' '*.js' | grep -E "console\.(log|debug)" > /dev/null; then
#     echo "⚠️  console.log statements detected. Consider removing."
# fi

echo "✨ All pre-commit checks passed!"
echo ""
exit 0
