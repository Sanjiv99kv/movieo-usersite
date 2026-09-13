import { Link, useRouterState } from "@tanstack/react-router";
import { Clapperboard, Home, MapPin, Menu, Search, Ticket, User, X, Heart, Film } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { movies, cinemas, cities } from "@/data/cinebook";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

const nav = [
  { label: "Home", to: "/" as const },
  { label: "Movies", to: "/movies" as const },
  { label: "Cinemas", to: "/cinemas" as const },
  { label: "Offers", to: "/offers" as const },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [city, setCity] = useState("Mumbai");
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);
  const results = movies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled || pathname !== "/" ? "border-b border-border/60 bg-background/90 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="page-shell grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="CineBook home">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow"><Clapperboard className="size-5" /></span>
            <span className="truncate font-display text-xl font-bold tracking-normal">Cine<span className="text-primary">Book</span></span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {nav.map((item) => <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className="nav-link" activeProps={{ className: "nav-link nav-link-active" }}>{item.label}</Link>)}
          </nav>
          <div className="flex items-center justify-end gap-1.5">
            <Button variant="ghost" className="hidden text-muted-foreground sm:inline-flex" onClick={() => setCityOpen(true)}><MapPin /> {city}</Button>
            <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setSearchOpen(true)}><Search /></Button>
            <Button asChild className="hidden sm:inline-flex"><Link to="/login">Login</Link></Button>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X /> : <Menu />}</Button>
          </div>
        </div>
        {menuOpen && <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">{nav.map((item) => <Link key={item.to} to={item.to} className="block border-b border-border py-3 text-lg font-semibold">{item.label}</Link>)}<Link to="/login" className="block py-3 text-lg font-semibold">Login</Link></nav>}
      </header>

      <main>{children}</main>
      <Footer />
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
        {[{ label: "Home", to: "/" as const, icon: Home }, { label: "Movies", to: "/movies" as const, icon: Film }, { label: "Bookings", to: "/bookings" as const, icon: Ticket }, { label: "Watchlist", to: "/watchlist" as const, icon: Heart }, { label: "Profile", to: "/login" as const, icon: User }].map((item) => <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} className="flex flex-col items-center gap-1 py-1 text-[10px] text-muted-foreground" activeProps={{ className: "flex flex-col items-center gap-1 py-1 text-[10px] text-primary" }}><item.icon className="size-5" />{item.label}</Link>)}
      </nav>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-[10%] max-h-[80vh] max-w-3xl translate-y-0 overflow-auto border-border bg-card p-0">
          <DialogTitle className="sr-only">Search CineBook</DialogTitle><DialogDescription className="sr-only">Search movies, cinemas and people</DialogDescription>
          <div className="flex items-center gap-3 border-b border-border p-5"><Search className="size-6 text-primary" /><Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movies, cinemas, actors..." className="h-12 border-0 bg-transparent text-lg shadow-none focus-visible:ring-0" /></div>
          <div className="p-5"><p className="eyebrow mb-4">{query ? "Movies" : "Trending searches"}</p><div className="space-y-2">{results.slice(0, 4).map((movie) => <Link key={movie.id} to="/movies/$movieId" params={{ movieId: movie.id }} onClick={() => setSearchOpen(false)} className="flex items-center gap-4 rounded-lg p-2 hover:bg-accent"><img src={movie.poster} alt="" width={52} height={72} className="h-18 w-13 rounded object-cover" /><span><strong className="block">{movie.title}</strong><span className="text-sm text-muted-foreground">{movie.genre} · {movie.language}</span></span></Link>)}</div><p className="eyebrow mb-3 mt-7">Cinemas</p>{cinemas.slice(0, 2).map((cinema) => <div key={cinema.id} className="py-2"><strong>{cinema.name}</strong><p className="text-sm text-muted-foreground">{cinema.location}</p></div>)}</div>
        </DialogContent>
      </Dialog>

      <Dialog open={cityOpen} onOpenChange={setCityOpen}><DialogContent className="border-border bg-card"><DialogTitle>Where are you watching?</DialogTitle><DialogDescription>Choose a city to see nearby movies and showtimes.</DialogDescription><Input placeholder="Search city" /><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{cities.map((item) => <Button key={item} variant={item === city ? "default" : "outline"} onClick={() => { setCity(item); setCityOpen(false); }}>{item}</Button>)}</div></DialogContent></Dialog>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

function Footer() {
  const groups = [
    ["Explore", "Now Showing", "Coming Soon", "Popular Movies"],
    ["Cinemas", "Near Me", "Premium Experiences", "Food & Drinks"],
    ["CineBook", "About Us", "Careers", "Contact"],
    ["Support", "Help Center", "Terms", "Privacy"],
  ];
  return <footer className="border-t border-border bg-surface pb-24 pt-14 md:pb-8"><div className="page-shell"><div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]"><div><div className="mb-4 flex items-center gap-2 font-display text-xl font-bold"><Clapperboard className="text-primary" /> CineBook</div><p className="max-w-xs text-sm leading-6 text-muted-foreground">More than a seat. Your next great story starts here.</p></div>{groups.map(([heading, ...links]) => <div key={heading}><h3 className="mb-4 text-sm font-semibold">{heading}</h3>{links.map((link) => <p key={link} className="mb-2 text-sm text-muted-foreground">{link}</p>)}</div>)}</div><div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>© 2026 CineBook. All rights reserved.</span><span>Instagram · X · YouTube · LinkedIn</span></div></div></footer>;
}