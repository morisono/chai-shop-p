// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"
import { Stripe } from "jsr:stripe/mod.ts"

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  httpClient: Stripe.createFetchHttpClient(),
})

// Create a Supabase client with the auth admin key
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
)

Deno.serve(async (req) => {
  try {
    // Get session ID from the URL query parameters
    const url = new URL(req.url)
    const sessionId = url.searchParams.get("session_id")

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Missing session_id parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Get customer information
    const customer = session.customer_details
    const paymentStatus = session.payment_status
    const userId = session.client_reference_id

    if (paymentStatus !== "paid") {
      return new Response(
        JSON.stringify({ error: "Payment not successful" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Store successful payment in Supabase
    if (userId) {
      // Update the user record or create a payment record
      const { data, error } = await supabaseAdmin
        .from("payments")
        .insert({
          user_id: userId,
          session_id: sessionId,
          amount: session.amount_total,
          currency: session.currency,
          status: paymentStatus,
          customer_email: customer?.email,
          payment_intent: session.payment_intent,
          metadata: session.metadata
        })

      if (error) {
        console.error("Error storing payment data:", error)
        return new Response(
          JSON.stringify({ error: "Failed to update database" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        )
      }

      // You could also update user subscription status or other relevant tables
      // depending on your application's needs
    }

    // Redirect to success page or return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment processed successfully",
        session: {
          id: session.id,
          customer: customer,
          amount: session.amount_total,
          currency: session.currency
        }
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request with a mock session_id:

  curl -i --location --request GET 'http://127.0.0.1:54321/functions/v1/success-hook?session_id=cs_test_123456789' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

*/