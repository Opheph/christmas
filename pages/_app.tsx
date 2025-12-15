import type { AppProps } from 'next/app';
import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Yancy's Christmas</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap" rel="stylesheet" />
      </Head>

      {/* Load Tailwind via CDN to preserve original styling quickly */}
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      <Component {...pageProps} />
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          function send(payload){
            try{ navigator.sendBeacon && navigator.sendBeacon('/api/client-log', JSON.stringify(payload));
            }catch(e){ fetch('/api/client-log',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{}); }
          }
          var origErr = window.onerror;
          window.onerror = function(message, source, lineno, colno, error){
            send({type:'onerror', message: String(message), source, lineno, colno, stack: error && error.stack});
            if(origErr) return origErr.apply(this, arguments);
            return false;
          };
          var origRej = window.onunhandledrejection;
          window.addEventListener('unhandledrejection', function(ev){ send({type:'unhandledrejection', reason: String(ev.reason), stack: (ev.reason && ev.reason.stack)}); });
          var origConsoleErr = console.error.bind(console);
          console.error = function(){ try{ send({type:'console.error', args: Array.from(arguments)}); }catch(e){}; return origConsoleErr.apply(this, arguments); };
        })();
      `}} />
    </>
  );
}
