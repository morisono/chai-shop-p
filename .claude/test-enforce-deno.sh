#!/bin/bash
# test-enforce-deno.sh
# Comprehensive test suite for enforce-deno.sh script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENFORCE_SCRIPT="$SCRIPT_DIR/hooks/enforce-deno.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0

# Helper function to run test
run_test() {
    local test_name="$1"
    local input="$2"
    local expected_decision="$3"
    local description="$4"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -e "\n${YELLOW}Test $TOTAL_TESTS: $test_name${NC}"
    echo "Description: $description"
    echo "Input: $input"

    result=$(echo "$input" | "$ENFORCE_SCRIPT" 2>/dev/null)
    decision=$(echo "$result" | jq -r '.decision' 2>/dev/null)

    if [[ "$decision" == "$expected_decision" ]]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Expected: $expected_decision"
        echo "Got: $decision"
        echo "Full output: $result"
    fi
}

echo "🦕 Testing enforce-deno.sh script"
echo "================================="

# Test 1: npm install should be blocked
run_test "npm install blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "npm install react"}}' \
    "block" \
    "Should block npm install and suggest deno.json imports"

# Test 2: node command should be blocked
run_test "node command blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "node index.js"}}' \
    "block" \
    "Should block node command and suggest deno run"

# Test 3: deno commands should be approved
run_test "deno command approval" \
    '{"tool_name": "Bash", "tool_input": {"command": "deno run --allow-all main.ts"}}' \
    "approve" \
    "Should approve deno commands"

# Test 4: TypeScript compiler should be blocked
run_test "TypeScript compiler blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "tsc --build"}}' \
    "block" \
    "Should block tsc and suggest deno check"

# Test 5: Testing framework should be blocked
run_test "Jest blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "jest test/"}}' \
    "block" \
    "Should block jest and suggest deno test"

# Test 6: Bundler should be blocked
run_test "Webpack blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "webpack --mode production"}}' \
    "block" \
    "Should block webpack and suggest deno bundle"

# Test 7: package.json creation should be blocked
run_test "package.json creation blocking" \
    '{"tool_name": "create_file", "tool_input": {"file_path": "package.json"}}' \
    "block" \
    "Should block package.json creation and suggest deno.json"

# Test 8: tsconfig.json creation should be blocked
run_test "tsconfig.json creation blocking" \
    '{"tool_name": "create_file", "tool_input": {"file_path": "tsconfig.json"}}' \
    "block" \
    "Should block tsconfig.json creation and suggest deno.json config"

# Test 9: eslint config should be blocked
run_test "ESLint config blocking" \
    '{"tool_name": "create_file", "tool_input": {"file_path": ".eslintrc.json"}}' \
    "block" \
    "Should block eslint config and suggest deno lint"

# Test 10: Wrangler command should be blocked
run_test "Wrangler dev blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "wrangler dev"}}' \
    "block" \
    "Should block wrangler dev and suggest deno alternatives"

# Test 11: Empty input should be approved
run_test "Empty input approval" \
    '' \
    "approve" \
    "Should approve empty input"

# Test 12: Non-Node commands should be approved
run_test "Non-Node command approval" \
    '{"tool_name": "Bash", "tool_input": {"command": "ls -la"}}' \
    "approve" \
    "Should approve non-Node.js commands"

# Test 13: npm scripts should be blocked
run_test "npm run script blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "npm run test"}}' \
    "block" \
    "Should block npm run and suggest deno task"

# Test 14: yarn commands should be blocked
run_test "Yarn command blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "yarn add lodash"}}' \
    "block" \
    "Should block yarn and suggest deno.json imports"

# Test 15: Development tools should be blocked
run_test "Nodemon blocking" \
    '{"tool_name": "Bash", "tool_input": {"command": "nodemon server.js"}}' \
    "block" \
    "Should block nodemon and suggest deno --watch"

echo -e "\n🎯 Test Results Summary"
echo "======================="
echo -e "Total tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$((TOTAL_TESTS - PASSED_TESTS))${NC}"

if [[ $PASSED_TESTS -eq $TOTAL_TESTS ]]; then
    echo -e "\n${GREEN}🎉 All tests passed! The enforce-deno.sh script is working correctly.${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please review the script.${NC}"
    exit 1
fi
