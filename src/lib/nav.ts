export const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "How It Works" },
];

export const isActiveLink = (path: string, href: string) =>
  href === "/" ? path === "/" : path.startsWith(href);