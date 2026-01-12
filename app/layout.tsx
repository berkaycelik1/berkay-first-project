import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
    return (
      <html lang="tr">
        <body>
          <nav className="border-b bg-white sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="text-2xl font-black text-slate-600">
              Berkay'ın Blogu
              </Link>
              <div className="space-x-6 font-medium text-gray-600">
                <Link href="/" className="hover:text-blue-600 transition">Ana Sayfa</Link>
                <Link href="/hakkimda" className="hover:text-blue-600 transition">Hakkımda</Link>
              </div>
            </div>
          </nav>
          {children}
          <footer className="border-t py-10 text-center text-gray-500 text-sm mt-20">© 2026 Berkay Blog - Tüm Hakları Saklıdır</footer>
        </body>
      </html>
    )
  }