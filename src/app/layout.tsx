import type { Metadata } from "next";
import { Inter, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const shippori = Shippori_Mincho({ 
  weight: '400',
  variable: '--font-shippori',
});

export const metadata: Metadata = {
  title: "Shadow Tale | 心象童話メーカー",
  description: "あなたの心の奥にある傷や恐れを投影し、価値観が反転した世界で小さな一歩を踏み出す童話を生成します。",
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
