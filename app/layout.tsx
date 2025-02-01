import type { Metadata } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const poppins=Poppins({
  subsets:['latin'],
  weight:["400","500","600","700"],
  variable: '--font-poppins'

})

//const geistSans = Geist({
//  variable: "--font-geist-sans",
//  subsets: ["latin"],
//});

//const geistMono = Geist_Mono({
//  variable: "--font-geist-mono",
//  subsets: ["latin"],
//});

export const metadata: Metadata = {
  title: "Benevents",
  description: "One stop solution for Bennett events",
  icons:{
    icon:'/assets/images/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider afterSignOutUrl="/">
    <html lang="en">
      <body
        className={`${poppins.variable} `}
      >
<Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload"/>
        {children}
      </body>

    </html>
      </ClerkProvider>
  );
}
