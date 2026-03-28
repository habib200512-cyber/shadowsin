import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "ShadowSin — share without limits",
  description: "Comparte sin límites. Anónimo, libre, tuyo.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.variable} font-sans antialiased`}>
        <SessionProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: { background: "#1A1A1A", color: "#fff", border: "1px solid #2A2A2A" },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
