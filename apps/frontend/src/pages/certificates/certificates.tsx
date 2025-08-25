import { Unauthorized } from "#/pages/unauthorized/unauthorized";
import { useAuth } from "#/utils/user";

export function Certificates() {
  const { user } = useAuth();

  return user?.email ? <div className="w-full">atestados</div> : <Unauthorized />;
}
