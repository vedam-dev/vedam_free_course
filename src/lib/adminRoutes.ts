export const ADMIN_PAGE_PATHS = [
  '/analytics',
  '/upload',
] as const;

export function isAdminPagePath(pathname: string): boolean {
  if(pathname.startsWith('/admin')) return true;
  return ADMIN_PAGE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
