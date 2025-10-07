import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Marketing tracking: capture UTM parameters and store in cookies
  const response = NextResponse.next();

  const url = request.nextUrl;

  // Capture UTM parameters
  const utmSource = url.searchParams.get('utm_source');
  const utmMedium = url.searchParams.get('utm_medium');
  const utmCampaign = url.searchParams.get('utm_campaign');
  const gclid = url.searchParams.get('gclid'); // Google Ads
  const fbclid = url.searchParams.get('fbclid'); // Facebook Ads

  // Store in cookies for form submission tracking (30-day expiry)
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  };

  if (utmSource) {
    response.cookies.set('utm_source', utmSource, cookieOptions);
  }
  if (utmMedium) {
    response.cookies.set('utm_medium', utmMedium, cookieOptions);
  }
  if (utmCampaign) {
    response.cookies.set('utm_campaign', utmCampaign, cookieOptions);
  }
  if (gclid) {
    response.cookies.set('gclid', gclid, cookieOptions);
  }
  if (fbclid) {
    response.cookies.set('fbclid', fbclid, cookieOptions);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
