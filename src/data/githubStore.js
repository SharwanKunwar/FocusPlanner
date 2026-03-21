import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGithubStore = create(
  persist(
    (set) => ({
      username: "SharwanKunwar",
      setUsername: (name) => set({ username: name }),
    }),
    {
      name: "github-user",
    }
  )
);

export default useGithubStore;