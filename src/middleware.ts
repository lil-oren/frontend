import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import roleFetcher from './lib/roleFetcher';
import CONSTANTS from './constants/constants';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const cookieList = cookies();
  if (
    request.nextUrl.pathname.startsWith('/signin') ||
    request.nextUrl.pathname.startsWith('/register')
  ) {
    if (cookieList.has('refresh_token')) {
      const role = await roleFetcher(cookieList.toString());
      if (role !== 'unauthorized') {
        return NextResponse.redirect(
          new URL(`${CONSTANTS.BASE_PATH}`, request.url),
        );
      } else {
        return;
      }
    } else {
      return;
    }
  }
  if (
    request.nextUrl.pathname.startsWith('/user') ||
    request.nextUrl.pathname.startsWith('/wallet') ||
    request.nextUrl.pathname.startsWith('/seller/onboarding')
  ) {
    if (!cookieList.has('refresh_token')) {
      return NextResponse.redirect(
        new URL(`${CONSTANTS.BASE_PATH}/signin`, request.url),
      );
    }
    const role = await roleFetcher(cookieList.toString());
    if (role === 'unauthorized') {
      return NextResponse.redirect(
        new URL(`${CONSTANTS.BASE_PATH}`, request.url),
      );
    } else {
      return;
    }
  }
  if (request.nextUrl.pathname.startsWith('/seller/portal')) {
    if (!cookieList.has('refresh_token')) {
      return NextResponse.redirect(
        new URL(`${CONSTANTS.BASE_PATH}/signin`, request.url),
      );
    }
    const role = await roleFetcher(cookieList.toString());
    if (role !== 'seller') {
      return NextResponse.redirect(
        new URL(`${CONSTANTS.BASE_PATH}`, request.url),
      );
    } else {
      return;
    }
  }
}
