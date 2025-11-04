export type User = {
  username: string;
  password: string;
  name: string;
  role?: string;
};

export const USERS: User[] = [
  { username: "admin", password: "admin123", name: "Administrator", role: "admin" },
  { username: "user1", password: "password1", name: "User One", role: "user" },
  { username: "guest", password: "guest", name: "Guest User", role: "guest" },
];

/**
 * Verify credentials against the in-memory USERS list.
 * Returns the matched user object (without password) or null.
 */
export function verifyUser(username: string, password: string): Omit<User, 'password'> | null {
  const found = USERS.find((u) => u.username === username && u.password === password);
  if (!found) return null;
  const { password: _p, ...safe } = found;
  return safe;
}
