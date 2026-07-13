export const ADMIN_PAGE_PATHS = [
  '/analytics',
  '/upload',
  '/api/admin/completed-students',
  '/api/admin/all-students-progress',
  '/api/admin/topic-progress'
] as const;

export function isAdminPagePath(pathname: string): boolean {
  if(pathname.startsWith('/admin')) return true;
  return ADMIN_PAGE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
