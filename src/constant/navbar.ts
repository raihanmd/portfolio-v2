type TNavbarMenu = {
  label: string;
  href: string;
  shortLabel?: string;
};

export const NAVBAR_MENU: TNavbarMenu[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "About",
    href: "/about-me",
  },
  {
    label: "TIL",
    href: "/til",
  },
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Playground",
    shortLabel: "Tools",
    href: "/playground",
  },
];
