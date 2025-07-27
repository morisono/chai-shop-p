import { auth } from '~/lib/auth.server' // Adjust the path as necessary
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node"

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        return await auth.handler(request)
    } catch (error) {
        console.error("Auth loader error:", error)
        throw new Response("Authentication error", { status: 500 })
    }
}

export async function action({ request }: ActionFunctionArgs) {
    try {
        return await auth.handler(request)
    } catch (error) {
        console.error("Auth action error:", error)
        throw new Response("Authentication error", { status: 500 })
    }
}