import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useAuthStore = create(persist((set)=>({isLoggedIn:false,user:null,accessToken:null,login:(user,accessToken)=>set({isLoggedIn:true,user,accessToken}),logout:()=>set({isLoggedIn:false,user:null,accessToken:null})}),{name:'auth-storage',partialize:(s)=>({isLoggedIn:s.isLoggedIn,user:s.user,accessToken:s.accessToken})}));
export default useAuthStore;
