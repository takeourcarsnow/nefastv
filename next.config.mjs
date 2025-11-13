/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};

// Add some secure headers including a Content Security Policy.
// Note: the site uses inline styles in a few places; to avoid breaking the app we allow 'unsafe-inline' for styles.
// If you later move inline styles to CSS files you can tighten the policy.
nextConfig.headers = async () => {
  const csp = [
    "default-src 'self' https:",
    "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
    "connect-src 'self' https://api.github.com https://*.supabase.co https:",
    "frame-src https://www.youtube.com https://player.vimeo.com",
  ].join('; ');

  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' },
        { key: 'Permissions-Policy', value: 'geolocation=(), microphone=()' },
        { key: 'Content-Security-Policy', value: csp }
      ]
    }
  ];
};

export default nextConfig;
