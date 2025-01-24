import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Clear the cookie
  res.headers.set(
    'Set-Cookie',
    'next-router-state-tree=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly;'
  );

  return res;
}
