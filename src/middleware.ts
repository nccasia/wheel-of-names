import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkNewYear } from './helpers'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (!checkNewYear()) {
    return NextResponse.redirect(new URL('/count-down', request.url))
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/reward/:path*',
}