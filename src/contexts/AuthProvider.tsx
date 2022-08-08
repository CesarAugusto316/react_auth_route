import { AxiosError } from 'axios';
import {
  createContext, FC, ReactNode, useContext, useEffect, useMemo, useState,
} from 'react';
import { toast } from 'react-toastify';
import type { UserPayload, UserProfile } from '../interfaces';
import { AuthService } from '../services/AuthService.class';


interface ContextProps {
  isLogged: boolean,
  userProfile: UserProfile,
  signIn: (userInput: UserPayload, next: CallableFunction) => void,
  signOut: () => Promise<void>,
}

const Context = createContext({} as ContextProps);

export const useAuthContext = () => {
  return useContext(Context);
};

const authService = AuthService.getInstance();

/**
 *
 * @description this logic could go in the AuthService class
 */
const validateToken = async (): Promise<[boolean, UserProfile]> => {
  if (authService.getLocalToken()) {
    try {
      const userProfile = await authService.fetchUserProfile();
      return [true, userProfile]; // is valid
      //
    } catch (error: any) {
      console.log(error.message);
      authService.deleteLocalToken(); // is invalid
    }
  }
  return [false, {} as UserProfile];
};

const [isValidToken, currentUser] = await validateToken();

/**
 *
 * @description ContextProvider
 */
export const AuthProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [userProfile, setUserProfile] = useState(currentUser);
  const [isLogged, setIsLogged] = useState(isValidToken);

  // 1. gets a valid JWT from server
  const signIn = (userInput: UserPayload, next: CallableFunction): void => {
    authService.fetchToken(userInput)
      .then(() => {
        setIsLogged(true); // now we can access protected routes.
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 404) {
          toast.error('User not Found');
        } else {
          toast.error(error.message);
        }
      })
      .finally(() => {
        next();
      });
  };

  /**
   *
   * @description fetches a new userProfile after getting
   * the a new JWT.
   */
  const fetchNewUserProfile = () => {
    if (isLogged && !userProfile.id) {
      authService.fetchUserProfile()
        .then((user) => {
          setUserProfile(user);
        })
        .catch((error: AxiosError) => {
          toast.error(error.message);
        });
    }
  };

  const signOut = async () => {
    setIsLogged(false);
    setUserProfile({} as UserProfile);
    authService.deleteLocalToken();
  };

  // 2. fetches a userProfile given a new JWT.
  useEffect(fetchNewUserProfile, [isLogged]);

  /**
   *
   * @description Optimization
   */
  const memoizedValues = useMemo(() => {
    return {
      isLogged, userProfile, signIn, signOut,
    };
  }, [isLogged, userProfile]);


  return (
    <Context.Provider value={memoizedValues}>
      {children}
    </Context.Provider>
  );
};
