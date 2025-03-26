import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Cierres | La forma más fácil de controlar tus eventos",
  description:
    "Registra ingresos, gastos y beneficios de cada noche. Control total para promotores y organizadores de eventos.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Cierres</Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              <div className="flex flex-col gap-20 max-w-5xl p-5">
                {children}
              </div>
              {/* <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16"> */}
              <footer className="w-full border-t border-border py-6 mt-10 text-sm text-muted-foreground">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <span className="text-center md:text-left">
                    © {new Date().getFullYear()} Cierres · Pristok Technology
                  </span>

                  <div className="items-center">
                    <ThemeSwitcher />
                  </div>

                  <div className="flex gap-4 text-xs">
                    <a
                      href="https://pristok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      Web oficial
                    </a>
                    <a
                      href="mailto:info@pristok.com"
                      className="hover:text-foreground transition-colors"
                    >
                      Contacto
                    </a>
                    <a
                      href="https://github.com/tu-usuario"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
