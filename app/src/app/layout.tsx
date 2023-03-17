import { type ReactNode } from "react";
import "../styles/globals.css";

interface Props {
  children: ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-white">{children}</body>
    </html>
  );
}
