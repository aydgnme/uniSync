import Link from "next/link";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">USV Campus Portal</h1>
        <nav className="flex space-x-4">
          <Link href="/tabs" className="text-blue-600 hover:underline">Home</Link>
          <Link href="/tabs/login" className="text-blue-600 hover:underline">Login</Link>
        </nav>
      </header>
      <main className="flex-grow p-6">{children}</main>
      <footer className="bg-gray-200 p-4 text-center">&copy; 2025 USV Campus Portal</footer>
    </div>
  );
};

export default Layout;