import { create } from 'zustand'

interface CartStore {
    count: number
    increment: () => void
}

export const useCartStore = create<CartStore>((set) => ({
    count: 0,
    increment: () =>
    set((state) => ({
        count: state.count + 1,
    })),
}))