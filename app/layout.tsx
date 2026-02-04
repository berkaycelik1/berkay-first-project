import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased"> 
        {/* Navbar */}
        <nav className="border-b dark:border-slate-800 py-4">
          <div className="container mx-auto max-w-5xl px-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Berkay'ın Blogu</Link>
            <div className="flex items-center gap-6">
              <Link href="/">Ana Sayfa</Link>
              <Link href="/hakkimda">Hakkımda</Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        
        <main className="container mx-auto max-w-5xl px-4 py-10">
          {children}
        </main>

        <footer className="text-center py-10 border-t dark:border-slate-800 text-sm text-gray-500">
          © 2026 Berkay Blog • Tüm Hakları Saklıdır
        </footer>
      </body>
    </html>
  );
}