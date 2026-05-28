import type { Metadata } from "next";
import { Inter, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const shippori = Shippori_Mincho({ 
  weight: '400',
  variable: '--font-shippori',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://narrative-therapy-app.vercel.app"),
  title: "Shadow Tale",
  description: "弱さを許容する、あなただけの影の童話",
  openGraph: {
    title: "Shadow Tale",
    description: "弱さを許容する、あなただけの影の童話",
    url: "https://narrative-therapy-app.vercel.app",
    siteName: "Shadow Tale",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${shippori.variable}`}>
        {children}
      </body>
    </html>
  );
}
