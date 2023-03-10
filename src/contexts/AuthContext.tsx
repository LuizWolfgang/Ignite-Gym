import {
  createContext,
  useState,
  ReactNode,
} from 'react';

import { api } from '../services/api';
import { storageUserSave } from '@storage/storageUser';
import { UserDTO } from '@dtos/UserDTO';


export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function signIn( email: string, password: string) {
    // eslint-disable-next-line no-useless-catch
    try {
      const { data } = await api.post('/sessions', { email, password,})
      //user exists
      if(data.user) {
        setUser(data.user)
        storageUserSave(data.user)
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn}}>
      {children}
    </AuthContext.Provider>
  )
}

