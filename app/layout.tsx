import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SAKAWITARA | Wedding & Creative", description: "Undangan digital dan creative studio" };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {return <html lang="id"><body>{children}</body></html>}
