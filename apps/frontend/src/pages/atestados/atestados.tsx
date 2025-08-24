import { Unauthorized } from "#/pages/unauthorized/unauthorized";
import { useAuth } from "#/utils/user";

export function Atestados() {
  const { user } = useAuth();

  return user?.email ? <div className="w-full">atestados</div> : <Unauthorized />;
}
