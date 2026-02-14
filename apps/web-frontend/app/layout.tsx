import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner"; // El nuevo componente
import "./globals.css";

export const metadata = {
  title: "Smart Contracts",
  icons: {
    icon: "https://interzero.es/wp-content/uploads/sites/16/2022/07/cropped-favicon-32x32-1-32x32.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f2f2f2]">
        <Navbar />
        {children}
        <Toaster position="top-right" richColors /> 
      </body>
    </html>
  );
}