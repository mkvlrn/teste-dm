import { lazy } from "react";

export function usePages() {
  const Inicio = lazy(() =>
    import("#/pages/inicio/inicio").then((module) => ({ default: module.Inicio })),
  );
  const Logout = lazy(() =>
    import("#/pages/logout/logout").then((module) => ({ default: module.Logout })),
  );
  const Colaboradores = lazy(() =>
    import("#/pages/colaboradores/colaboradores").then((module) => ({
      default: module.Colaboradores,
    })),
  );
  const Atestados = lazy(() =>
    import("#/pages/atestados/atestados").then((module) => ({
      default: module.Atestados,
    })),
  );

  const pages = new Map<string, ReturnType<typeof lazy>>([
    ["/", Inicio],
    ["/logout", Logout],
    ["/colaboradores", Colaboradores],
    ["/atestados", Atestados],
  ]);

  return { pages };
}
