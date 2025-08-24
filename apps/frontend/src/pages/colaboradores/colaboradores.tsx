import { Unauthorized } from "#/pages/unauthorized/unauthorized";
import { useAuth } from "#/utils/user";

export function Colaboradores() {
  const { user } = useAuth();

  return user?.email ? <div className="w-full">colaboradores</div> : <Unauthorized />;
}
