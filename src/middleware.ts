import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Clear the cookie
  res.headers.set(
    'next-router-state-tree',
    ''
  );

  return res;
}
