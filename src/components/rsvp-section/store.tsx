"use client";
const STORAGE_KEY = "wedding-rsvp";

type Store = {
  name: string;
  choice: "yes" | "no" | null;
  submitted: boolean;

  isLoading: boolean;
  error: string | null;
};

type Saved = Pick<Store, "name" | "choice" | "submitted">;

export const empty: Store = {
  name: "",
  choice: null,
  submitted: false,
  isLoading: false,
  error: null,
};

export function initStore(base: Store): Store {
  try {
    // const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    const saved = empty;
    if (
      saved?.submitted === true &&
      typeof saved.name === "string" &&
      (saved.choice === "yes" || saved.choice === "no")
    ) {
      return {
        ...base,
        name: saved.name,
        choice: saved.choice,
        submitted: true,
      };
    }
  } catch {
    // localStorage.removeItem(STORAGE_KEY);
  }

  return base;
}

export const reducer = (store: Store, patch: Partial<Store>): Store => ({
  ...store,
  ...patch,
});
