import { useLinks } from "#/components/navbar/use-links";
import { UserButton } from "#/components/navbar/user-button";

export function Navbar() {
  const { links } = useLinks();

  return (
    <div className="navbar">
      <div>{links}</div>
      <UserButton />
    </div>
  );
}
