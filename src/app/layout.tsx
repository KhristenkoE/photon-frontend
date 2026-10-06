import type { Metadata } from 'next';
import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import '@/utils/polifyills';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Photon',
  description: 'Archived frontend of Photon, a Telegram photo-sharing Mini App',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className='antialiased'>
      <head>
        <script>
          {`window.TelegramGameProxy = { receiveEvent: function() {} };`}
        </script>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=no, interactive-widget=resizes-content'
        />
      </head>
      <body className={'text-xs10'}>{children}</body>
    </html>
  );
}
