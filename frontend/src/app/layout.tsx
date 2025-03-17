import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Advisor - Find Your Perfect Route",
  description: "Discover the best travel routes within your budget. Set your preferences and let us find the perfect destinations for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <header className="border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Travel Advisor</span>
                </div>
                <div className="hidden md:block ml-10">
                  <div className="flex space-x-8">
                    <a
                      href="/"
                      className="text-white hover:text-purple-400 px-3 py-2 text-sm font-medium"
                    >
                      Home
                    </a>
                    <a
                      href="/routes"
                      className="text-gray-400 hover:text-purple-400 px-3 py-2 text-sm font-medium"
                    >
                      Routes
                    </a>
                    <a
                      href="/preferences"
                      className="text-gray-400 hover:text-purple-400 px-3 py-2 text-sm font-medium"
                    >
                      Preferences
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
