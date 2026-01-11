import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { theme } from "@/lib/theme";
import { ThemeProvider } from "@mui/material/styles";


const ibmSans = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-sans",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Vansale Estimation",
  description: "ระบบจัดการยอดผลิตและวางแผนงานขาย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        // className={`${geistSans.variable} ${geistMono.variable} ${ibmSans.variable} antialiased`}
        className={`${ibmSans.className} antialiased w-screen h-screen`}
      >
        <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
