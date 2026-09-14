import { createContext, useContext } from "react";

import type { Profile } from "@/lib/api";

export type AccountState = {
  profile: Profile;
  /** Replaces the cached profile after a write, without a refetch. */
  setProfile: (next: Profile) => void;
};

export const AccountContext = createContext<AccountState | null>(null);

export function useAccount(): AccountState {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used inside <AccountLayout>");
  return value;
}
