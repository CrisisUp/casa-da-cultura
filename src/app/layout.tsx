import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casa da Cultura - Cadastro de Artistas",
  description: "Sistema de cadastro e gestão cultural da Casa da Cultura",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/cultura.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${lora.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}>
        <SessionProvider>
          {children}
          <Toaster position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
