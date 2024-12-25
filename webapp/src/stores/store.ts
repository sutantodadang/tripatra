import { create } from 'zustand'
import { persist, createJSONStorage } from "zustand/middleware";

interface TokenState {
    token: string
    isLoggedIn: () => boolean
    setToken: (token: string) => void
    logout: () => void
}

export const useTokenStore = create<TokenState>()(
    persist(
        (set, get) => ({
            token: "",
            isLoggedIn: () => get().token !== "",
            setToken: (token: string) => set({ token }),
            logout: () => set({ token: "" }),
        }),
        {
            name: "token-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
