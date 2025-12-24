import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useThemeStore = create(
  persist((set) => ({
    theme: "light",
    setTheme: (theme) => set({ theme }),
    toggleTheme: () =>{
      set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }))
      // document.documentElement.classList.toggle("dark", state.theme === "dark")   
    },
  })),
  { name: "theme", storage: createJSONStorage(() => localStorage) }
);
