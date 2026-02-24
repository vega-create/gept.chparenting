import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileHeaderBadge from "@/components/MobileHeaderBadge";
import MobileBottomNav from "@/components/MobileBottomNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: "GEPT 全民英檢免費學習平台 | 初級・中級・中高級",
  description: "免費全民英檢線上學習平台，提供初級、中級、中高級電子書教學、互動測驗、模擬考試。聽說讀寫文法一次搞定，適合國中生、高中生備考使用。",
  keywords: "全民英檢, GEPT, 英檢初級, 英檢中級, 英檢模擬試題, 英文學習, 免費英檢, 英檢練習",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GEPT Learn",
  },
  openGraph: {
    title: "GEPT 全民英檢免費學習平台",
    description: "免費互動式英檢學習：電子書教學 + 遊戲練習 + 模擬考試",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID; // GA4 測量 ID，例如 G-XXXXXXXXXX
  const gscCode = process.env.NEXT_PUBLIC_GSC_CODE; // GSC 驗證碼

  return (
    <html lang="zh-TW">
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {gscCode && <meta name="google-site-verification" content={gscCode} />}
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { page_path: window.location.pathname });
            `}} />
          </>
        )}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3493526929407874" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen pb-16 md:pb-0">
        <Header />
        <main className="min-h-[calc(100vh-140px)]">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">📘</span>
          <span className="text-lg font-bold text-blue-600">GEPT Learn</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold hidden sm:inline">免費</span>
        </a>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <a href="/elementary" className="px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-medium transition no-underline">初級</a>
          <a href="/intermediate" className="px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-medium transition no-underline">中級</a>
          <a href="/upper-intermediate" className="px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-medium transition no-underline">中高級</a>
          <a href="/about" className="px-3 py-2 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-medium transition no-underline">關於</a>
        </nav>
        {/* Mobile: dynamic current level */}
        <MobileHeaderBadge />
      </div>
    </header>
  );
}

function MobileNav() {
  return <MobileBottomNav />;
}

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-12 hidden md:block">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 text-sm text-slate-500 mb-4">
          <a href="/elementary" className="hover:text-blue-600 transition">初級</a>
          <a href="/intermediate" className="hover:text-blue-600 transition">中級</a>
          <a href="/upper-intermediate" className="hover:text-blue-600 transition">中高級</a>
          <a href="/about" className="hover:text-blue-600 transition">關於作者</a>
        </div>
        <p className="text-sm text-slate-400">
          © 2026 GEPT Learn — 由{" "}
          <a href="https://chparenting.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            智慧媽咪國際有限公司 Mommy Wisdom International Co. LTD
          </a>{" "}
          製作
        </p>
        <p className="text-xs text-slate-400 mt-1">本站為免費學習資源，非官方全民英檢網站</p>
      </div>
    </footer>
  );
}
