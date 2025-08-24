import { useLinks } from "#/components/navbar/use-links";

export function Navbar() {
  const { links } = useLinks();

  return <div className="navbar">{links}</div>;
}
