import type { Metadata, Viewport } from "next";
import Nav from "@/components/Nav";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fridge Recipes",
  description: "Snap your fridge, get recipes.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Fridge", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#d6f5e3",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <Nav />
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-4">
          {children}
        </main>
        <ServiceWorker />
      </body>
    </html>
  );
}
