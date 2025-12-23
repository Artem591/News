@echo off
echo "Running lint-staged..."
npx lint-staged

if %errorlevel% neq 0 (
    echo "Linting failed!"
    exit 1
)

echo "All checks passed!"
