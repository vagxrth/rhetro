import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "../providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";
import { Databuddy } from '@databuddy/sdk';

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rhetro",
  description: "An AI Podcast App",
  icons: {
    icon: "/icons/rhetro.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <AudioProvider>
          <body className={manrope.className}>
            {children}
            <Databuddy
              clientId="VVyg9AR5hzK8JxWRY9J64"
              enableBatching={true}
            />
          </body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}
