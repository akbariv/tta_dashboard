export type User = {
  username: string;
  password: string;
  name: string;
  role?: string;
};

export const USERS: User[] = [
  { username: 'staff_TTA', password: 'staffTTA123', name: 'Staff TTA', role: 'staff_tta' },
  { username: 'karyawan',  password: 'karyawan123', name: 'Karyawan',  role: 'karyawan' },
  { username: 'Hod',       password: 'hod123',      name: 'Head of Department', role: 'hod' },
  // { username: "Hod", password: "hod123", name: "Head of Department", role: "hod" },
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
