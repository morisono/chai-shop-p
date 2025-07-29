import { auth } from '~/lib/auth.server'
import type { LoaderFunctionArgs } from "@remix-run/node"
import { json } from "@remix-run/node"

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        // Test session retrieval
        const session = await auth.api.getSession({
            headers: request.headers,
        })

        // Test if session exists
        if (!session) {
            return json({
                status: 'unauthenticated',
                message: 'No active session found',
                timestamp: new Date().toISOString()
            })
        }

        // Return session info (safe data only)
        return json({
            status: 'authenticated',
            user: {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                emailVerified: session.user.emailVerified,
                createdAt: session.user.createdAt
            },
            session: {
                id: session.session.id,
                expiresAt: session.session.expiresAt,
                userId: session.session.userId
            },
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        console.error("Auth test error:", error)
        return json({
            status: 'error',
            message: 'Authentication test failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            timestamp: new Date().toISOString()
        }, { status: 500 })
    }
}
