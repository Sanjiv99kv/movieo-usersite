import {
  Clapperboard,
  Film,
  Heart,
  Home,
  LogOut,
  MapPin,
  Menu,
  Search,
  Ticket,
  User,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { CitySelector } from "@/components/cinebook/CitySelector";
import { SearchOverlay } from "@/components/cinebook/SearchOverlay";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";
import { useCinebook } from "@/store/cinebook-context";

const nav = [
  { label: "Home", to: "/" },
  { label: "Movies", to: "/movies" },
  { label: "Cinemas", to: "/cinemas" },
  { label: "Offers", to: "/offers" },
];

const mobileNav = [
  { label: "Home", to: "/", icon: Home },
  { label: "Movies", to: "/movies", icon: Film },
  { label: "Bookings", to: "/bookings", icon: Ticket },
  { label: "Watchlist", to: "/watchlist", icon: Heart },
  { label: "Profile", to: "/login", icon: User },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { city, user, signOut } = useCinebook();

  // The seat picker owns the bottom of the screen, so the tab bar steps aside there.
  const hideMobileNav = pathname.startsWith("/booking");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Every route change starts at the top — React Router keeps the old scroll otherwise.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled || pathname !== "/"
            ? "border-b border-border/60 bg-background/90 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="page-shell grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="CineBook home">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow">
              <Clapperboard className="size-5" />
            </span>
            <span className="truncate font-display text-xl font-bold tracking-normal">
              Cine<span className="text-primary">Book</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="ghost"
              className="hidden text-muted-foreground sm:inline-flex"
              onClick={() => setCityOpen(true)}
            >
              <MapPin /> {city}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Account menu"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
                  >
                    {user.name.slice(0, 1).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <span className="block truncate">{user.name}</span>
                    <span className="block truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/bookings">My bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watchlist">My watchlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      toast.success("Signed out");
                    }}
                  >
                    <LogOut /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="hidden sm:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block border-b border-border py-3 text-lg font-semibold"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setCityOpen(true);
              }}
              className="flex w-full items-center gap-2 border-b border-border py-3 text-lg font-semibold"
            >
              <MapPin className="size-5 text-primary" /> {city}
            </button>
            <Link to="/login" className="block py-3 text-lg font-semibold">
              {user ? "My account" : "Login"}
            </Link>
          </nav>
        )}
      </header>

      <main>{children}</main>
      <Footer />

      {!hideMobileNav && (
        <nav
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
          aria-label="Mobile navigation"
        >
          {mobileNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-1 text-[10px] ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}

      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
      <CitySelector open={cityOpen} onOpenChange={setCityOpen} />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

const footerGroups: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "CineBook",
    links: [
      { label: "About Us", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Contact", to: "/" },
    ],
  },
  {
    heading: "Movies",
    links: [
      { label: "Now Showing", to: "/movies" },
      { label: "Upcoming Movies", to: "/movies" },
      { label: "Popular Movies", to: "/movies" },
    ],
  },
  {
    heading: "Cinemas",
    links: [
      { label: "Cinemas Near Me", to: "/cinemas" },
      { label: "Popular Cinemas", to: "/cinemas" },
      { label: "Premium Experiences", to: "/cinemas" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", to: "/" },
      { label: "Terms", to: "/" },
      { label: "Privacy", to: "/" },
      { label: "Refund Policy", to: "/" },
    ],
  },
];

const socials = ["Instagram", "X", "YouTube", "LinkedIn"];

function Footer() {
  return (
    <footer className="border-t border-border bg-surface pb-24 pt-14 md:pb-8">
      <div className="page-shell">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <div className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
              <Clapperboard className="text-primary" /> CineBook
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              More than a seat. Your next great story starts here.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map((social) => (
                <a
                  key={social}
                  href="/"
                  onClick={(event) => event.preventDefault()}
                  className="rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold transition hover:bg-accent"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          {footerGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="mb-4 text-sm font-semibold">{group.heading}</h3>
              {group.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="mb-2 block text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 CineBook. All rights reserved.</span>
          <span>Made for movie nights.</span>
        </div>
      </div>
    </footer>
  );
}
