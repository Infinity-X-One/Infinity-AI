import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import BlackBackgroundScript from "./black-background-script"
import GlobalNavigationLoader from "@/components/global-navigation-loader"
import { DataProvider } from "@/contexts/data-context"

// Add import for the ViewportHeightAdjuster component
import { ViewportHeightAdjuster } from "@/components/viewport-height-adjuster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Infinity AI - Jarvis",
  description: "Your futuristic AI assistant",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
    generator: 'v0.dev'
}

// Add the hook to your layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Force black background during page transitions */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          html, body { 
            background-color: #000000 !important; 
            margin: 0;
            padding: 0;
          }
          
          /* Prevent any white flashes during navigation */
          body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #000000;
            z-index: -9999;
          }
          
          /* Hide content until fully loaded */
          .page-content {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
          }
          
          .page-content.loaded {
            opacity: 1;
          }
        `,
          }}
        />
        {/* Preload the loading screen assets */}
        <link rel="preload" as="image" href="/favicon.svg" />

        {/* No-flash script that runs before React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediately set background to black
              document.documentElement.style.backgroundColor = "#000000";
              document.body.style.backgroundColor = "#000000";
              
              // Create a black overlay
              var overlay = document.createElement('div');
              overlay.style.position = 'fixed';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.backgroundColor = '#000000';
              overlay.style.zIndex = '9998';
              overlay.style.pointerEvents = 'none';
              document.body.appendChild(overlay);
              
              // Remove overlay after content loads
              window.addEventListener('load', function() {
                setTimeout(function() {
                  if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                  }
                }, 500);
              });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-black text-white antialiased overscroll-none`}>
        {/* Script to ensure black background */}
        <BlackBackgroundScript />

        {/* Viewport height adjuster */}
        <ViewportHeightAdjuster />

        {/* Global navigation loader */}
        <GlobalNavigationLoader />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <DataProvider>{children}</DataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
