import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { ChatProvider } from "@/components/ChatProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analytics Copilot Demo",
  description:
    "Demo NL2SQL pour explorer une base PostgreSQL avec un assistant analytique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ChatProvider>
          <AppLayout>{children}</AppLayout>
        </ChatProvider>
      </body>
    </html>
  );
}
