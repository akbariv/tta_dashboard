export type User = {
  id?: string;
  username: string;
  password: string;
  name: string;
  role?: string;
};

export const USERS: User[] = [
  { id: 'EMP-2025-001', username: 'staffTTA', password: 'staffTTA123', name: 'Staff TTA', role: 'staff_tta' },
  { id: 'EMP-2025-034', username: 'karyawan',  password: 'karyawan123', name: 'Karyawan',  role: 'karyawan' },
  { id: 'EMP-2025-050', username: 'Hod',       password: 'hod123',      name: 'Head of Department', role: 'hod' },
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
