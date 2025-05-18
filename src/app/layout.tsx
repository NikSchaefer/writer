import { sohne } from "./fonts";
import "./globals.css";

export const metadata = {
  title: "Writer",
  description: "Write something interesting",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sohne.variable} antialiased`}>
      <body className={`${sohne.className}`}>{children}</body>
    </html>
  );
}
