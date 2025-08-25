import { Login } from "#/pages/login/login";
import { useAuth } from "#/utils/user";

export function Home() {
  const { user } = useAuth();

  return user?.email ? <div className="w-full">hey</div> : <Login />;
}
