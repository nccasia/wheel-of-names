import '@/styles/globals.css';
import clsx from 'clsx';
import { Metadata, Viewport } from 'next';

import { Providers } from './providers';

import { fontSans } from '@/config/fonts';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {},
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <script async src="/mezon-sdk.js"></script>
      </head>
      <body
        className={clsx(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: '' }}>
          <div className="relative flex flex-col h-screen w-full">
            <main className="container  max-w-none w-full flex-grow ">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
