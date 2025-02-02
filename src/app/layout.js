import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Database Inserter",
  description: "Message board but cuztomizable. By everyone.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" class="dark:bg-[#072804]">
      <body className={`${geistSans.variable} ${geistMono.variable} dark:bg-[#072804]`}>
        {children}
      </body>
    </html>
  );
}
