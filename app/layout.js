import "./globals.css";
import { AuthProvider } from "./utils/AuthProvider";

export const metadata = { title: "MyBook", description: "FB-style app" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
