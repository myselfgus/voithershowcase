import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type UserRole = 'patient' | 'professional' | 'service';
interface RoleState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}
export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: 'patient', // Default role
      setRole: (role: UserRole) => set({ role }),
    }),
    {
      name: 'voither-healthos-role', // Local storage key
    }
  )
);
// Selector hook for convenience
export const useCurrentRole = () => useRoleStore((state) => state.role);