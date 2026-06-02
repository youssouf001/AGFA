export const parseJwt = (token: string): Record<string, unknown> => {
  try {
    const base64 = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
    if (!base64) return {};
    return JSON.parse(atob(base64)) as Record<string, unknown>;
  } catch {
    return {};
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload.exp) return true;
  return Date.now() >= (payload.exp as number) * 1000;
};
