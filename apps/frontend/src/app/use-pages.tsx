import { lazy } from "react";

export function usePages() {
  const Home = lazy(() => import("#/pages/home/home").then((module) => ({ default: module.Home })));
  const Logout = lazy(() =>
    import("#/pages/logout/logout").then((module) => ({ default: module.Logout })),
  );
  const Employees = lazy(() =>
    import("#/pages/employees/employees").then((module) => ({
      default: module.Employees,
    })),
  );
  const Certificates = lazy(() =>
    import("#/pages/certificates/certificates").then((module) => ({
      default: module.Certificates,
    })),
  );

  const pages = new Map<string, ReturnType<typeof lazy>>([
    ["/", Home],
    ["/logout", Logout],
    ["/colaboradores", Employees],
    ["/atestados", Certificates],
  ]);

  return { pages };
}
