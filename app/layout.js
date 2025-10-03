import "./globals.css";

export const metadata = {
  title: "MyBook",
  description: "Facebook-style social app in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
