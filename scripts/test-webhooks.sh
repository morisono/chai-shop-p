#!/bin/bash

# Stripe Webhook Testing Script
# This script helps developers test the webhook implementation locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3001"
STRIPE_CLI_VERSION="1.19.4"

echo -e "${BLUE}🔧 Stripe Webhook Testing Script${NC}"
echo "=================================="

# Check if Stripe CLI is installed
check_stripe_cli() {
    echo -e "${YELLOW}Checking Stripe CLI installation...${NC}"
    
    if ! command -v stripe &> /dev/null; then
        echo -e "${RED}❌ Stripe CLI is not installed.${NC}"
        echo "Please install it first:"
        echo "  macOS: brew install stripe/stripe-cli/stripe"
        echo "  Linux: wget -qO- https://cli.stripe.com/install.sh | sh"
        echo "  Or download from: https://github.com/stripe/stripe-cli/releases"
        exit 1
    else
        echo -e "${GREEN}✅ Stripe CLI is installed${NC}"
        stripe version
    fi
}

# Check if backend is running
check_backend() {
    echo -e "${YELLOW}Checking backend server...${NC}"
    
    if curl -s "$BACKEND_URL/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Backend server is running${NC}"
    else
        echo -e "${RED}❌ Backend server is not running at $BACKEND_URL${NC}"
        echo "Please start the backend server first:"
        echo "  cd apps/backend && npm run dev"
        exit 1
    fi
}

# Check webhook health
check_webhook_health() {
    echo -e "${YELLOW}Checking webhook service health...${NC}"
    
    HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/api/webhooks/health" || echo "failed")
    
    if [[ "$HEALTH_RESPONSE" == "failed" ]]; then
        echo -e "${RED}❌ Webhook service is not healthy${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ Webhook service is healthy${NC}"
        echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
    fi
}

# Setup webhook forwarding
setup_forwarding() {
    echo -e "${YELLOW}Setting up webhook forwarding...${NC}"
    echo "This will forward Stripe events to your local backend"
    echo "Press Ctrl+C to stop forwarding"
    echo ""
    
    stripe listen --forward-to "$BACKEND_URL/api/webhooks/stripe" \
        --events payment_intent.succeeded,payment_intent.payment_failed,payment_intent.requires_action,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,invoice.paid,invoice.payment_failed
}

# Test specific event
test_event() {
    local event_type=$1
    echo -e "${YELLOW}Testing $event_type event...${NC}"
    
    stripe trigger "$event_type"
    
    # Wait a moment for processing
    sleep 2
    
    # Check if event was processed
    echo -e "${GREEN}✅ Event triggered. Check your backend logs for processing details.${NC}"
}

# Test payment flow
test_payment_flow() {
    echo -e "${YELLOW}Testing complete payment flow...${NC}"
    
    # Create a payment intent
    echo "1. Creating payment intent..."
    PAYMENT_INTENT=$(stripe payment_intents create \
        --amount=2000 \
        --currency=usd \
        --automatic-payment-methods-enabled=true \
        --format=json)
    
    PAYMENT_INTENT_ID=$(echo "$PAYMENT_INTENT" | jq -r '.id')
    echo "   Payment Intent ID: $PAYMENT_INTENT_ID"
    
    # Simulate successful payment
    echo "2. Triggering payment success..."
    stripe trigger payment_intent.succeeded --override payment_intent:id="$PAYMENT_INTENT_ID"
    
    sleep 2
    echo -e "${GREEN}✅ Payment flow test completed${NC}"
}

# Test subscription flow
test_subscription_flow() {
    echo -e "${YELLOW}Testing subscription flow...${NC}"
    
    echo "1. Triggering subscription created..."
    stripe trigger customer.subscription.created
    
    sleep 1
    
    echo "2. Triggering subscription updated..."
    stripe trigger customer.subscription.updated
    
    sleep 1
    
    echo "3. Triggering subscription deleted..."
    stripe trigger customer.subscription.deleted
    
    sleep 2
    echo -e "${GREEN}✅ Subscription flow test completed${NC}"
}

# Show menu
show_menu() {
    echo ""
    echo -e "${BLUE}Choose an action:${NC}"
    echo "1. Setup webhook forwarding (recommended first step)"
    echo "2. Test payment_intent.succeeded event"
    echo "3. Test payment_intent.payment_failed event"
    echo "4. Test complete payment flow"
    echo "5. Test subscription flow"
    echo "6. Test invoice.paid event"
    echo "7. Check webhook health"
    echo "8. View supported events"
    echo "9. View failed webhooks"
    echo "0. Exit"
    echo ""
}

# Main execution
main() {
    check_stripe_cli
    check_backend
    check_webhook_health
    
    while true; do
        show_menu
        read -p "Enter your choice (0-9): " choice
        
        case $choice in
            1)
                setup_forwarding
                ;;
            2)
                test_event "payment_intent.succeeded"
                ;;
            3)
                test_event "payment_intent.payment_failed"
                ;;
            4)
                test_payment_flow
                ;;
            5)
                test_subscription_flow
                ;;
            6)
                test_event "invoice.paid"
                ;;
            7)
                check_webhook_health
                ;;
            8)
                echo -e "${YELLOW}Supported events:${NC}"
                curl -s "$BACKEND_URL/api/webhooks/events/supported" | jq '.' 2>/dev/null || curl -s "$BACKEND_URL/api/webhooks/events/supported"
                ;;
            9)
                echo -e "${YELLOW}Failed webhooks:${NC}"
                curl -s "$BACKEND_URL/api/webhooks/failed" | jq '.' 2>/dev/null || curl -s "$BACKEND_URL/api/webhooks/failed"
                ;;
            0)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid choice. Please try again.${NC}"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main