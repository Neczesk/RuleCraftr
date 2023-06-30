import {create} from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

const useUserStore = create(
    persist(
  // first parameter is the store.
  (set) => ({
    user: null,
    clearUser: () => {set((state) => ({
        ...state,
        user: null
    }))},
    setUser: (userData) => {set((state) => ({
        ...state,
        user: userData
    }))},
  }),
  // second parameter is the options for persist.
  {
    name: 'user-store',     // unique name
    storage: createJSONStorage(()=> localStorage) ,  // (optional) by default the 'localStorage' is used
  }
))


// const useUserStore = create((set) => ({
//     user: null,
//     clearUser: () => {set((state) => ({
//         ...state,
//         user: null
//     }))},
//     setUser: (userData) => {set((state) => ({
//         ...state,
//         user: userData
//     }))}
// }))
export default useUserStore