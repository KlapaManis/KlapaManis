import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  let title = "Menu Book Kompro";
  let description = "Menu Book Kompro";
  let favicon: string | null = null;
  try {
    const { getDb } = await import("@/db");
    const { settings } = await import("@/db/schema");
    const db = getDb();
    const rows = await db.select().from(settings);
    for (const r of rows) {
      if (r.key === "site.title" && r.value) title = r.value;
      if (r.key === "site.description" && r.value) description = r.value;
      if (r.key === "site.favicon_url" && r.value) favicon = r.value;
    }
  } catch {}
  return {
    title,
    description,
    icons: favicon ? { icon: favicon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
