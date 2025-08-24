import { IconHome, IconLogin, IconLogout, IconStethoscope, IconUsers } from "@tabler/icons-react";
import { useLocation } from "wouter";
import { classNames } from "#/utils/class-names";
import { useAuth } from "#/utils/user";

export function useLinks() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  const unauthenticatedLinkData = [
    {
      href: "/",
      label: "Início",
      icon: IconHome,
      current: location === "/",
    },
    {
      href: "/login",
      label: "Login",
      icon: IconLogin,
      current: location === "/login",
    },
  ];

  const authenticatedLinkData = [
    {
      href: "/",
      label: "Início",
      icon: IconHome,
      current: location === "/",
    },
    {
      href: "/colaboradores",
      label: "Colaboradores",
      icon: IconUsers,
      current: location === "/colaboradores",
    },
    {
      href: "/atestados",
      label: "Atestados",
      icon: IconStethoscope,
      current: location === "/atestados",
    },
    {
      href: "/logout",
      label: "Logout",
      icon: IconLogout,
      current: location === "/logout",
    },
  ];

  const linkData = user ? authenticatedLinkData : unauthenticatedLinkData;

  const links = linkData.map((l) => (
    <button
      className={classNames(
        l.current ? "menu-link-current" : "menu-link-not-current",
        "menu-link-base",
      )}
      key={l.label}
      onClick={() => navigate(l.href)}
      type="button"
    >
      <l.icon className="" stroke={1.5} />
      <span>{l.label}</span>
    </button>
  ));

  return { links };
}
