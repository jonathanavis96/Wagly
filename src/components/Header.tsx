import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center px-2 -mx-2 h-full">
            <img
              src={`${import.meta.env.BASE_URL}new-wagly-logo.png`}
              alt="Wagly Logo"
              className="h-full w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-[#8A9A5B]"
            >
              Home
            </Link>
            <Link
              to="/bring-wagly-home"
              className="rounded-full bg-[#8A9A5B] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7a8a4b] hover:shadow-lg"
            >
              Bring Wagly Home
            </Link>
          </nav>

          {/* Mobile CTA - NO HAMBURGER */}
          <div className="md:hidden">
            <Link
              to="/bring-wagly-home"
              className="rounded-full bg-[#8A9A5B] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7a8a4b]"
            >
              Bring Wagly Home
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
