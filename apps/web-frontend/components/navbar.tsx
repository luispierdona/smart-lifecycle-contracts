import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b bg-white mb-8">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <img
          src="https://interzero.es/wp-content/uploads/sites/16/2022/06/logo.svg"
          alt="SmartLifecycle"
          className="h-8 w-auto"
        />
        <div className="space-x-4">
          <Link href="/" className="text-sm font-medium hover:text-green-600">Dashboard</Link>
          <Link href="/contracts" className="text-sm font-medium hover:text-green-600">Contracts</Link>
        </div>
      </div>
    </nav>
  );
}