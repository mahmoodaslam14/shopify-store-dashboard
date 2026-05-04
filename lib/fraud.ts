export function normalizePostUrl(url: string) {
  try {
    const u = new URL(url.trim());
    u.hash = "";
    let path = u.pathname.replace(/\/+$/, "");
    if (path === "") path = "/";
    u.pathname = path;
    return u.toString().toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}
