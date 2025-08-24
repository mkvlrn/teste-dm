import { useLogout } from "#/pages/logout/use-logout";

export function Logout() {
  const { user } = useLogout();

  return user ? <div>Logout</div> : <div>???</div>;
}
