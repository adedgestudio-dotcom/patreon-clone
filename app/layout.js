import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata = {
  title: "Get me a chai - Fund your projects with chai",
  description: "This website is crowdfunding platform for creators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="themed-bg text-[var(--color-text)] transition-colors duration-300">
        <ThemeProvider>
          <SessionWrapper>
            <Navbar />
            <div className="min-h-screen themed-bg">{children}</div>
            <Footer />
            <ToastProvider />
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
