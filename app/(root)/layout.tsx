import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen">
      <Header></Header>
      <main className="flex-1">
        {children}
        <SpeedInsights></SpeedInsights>
        <Analytics></Analytics>
      </main>
      <Footer></Footer>
    </div>
  );
}
