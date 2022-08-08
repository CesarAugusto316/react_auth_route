import { AxiosError } from 'axios';
import {
  createContext, FC, ReactNode, useContext, useEffect, useMemo, useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
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
 * @description ContextProvider
 */
export const AuthProvider: FC<{children: ReactNode}> = ({ children }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({} as UserProfile);
  const [isLogged, setIsLogged] = useState(false);

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

  const onStartUp = () => {
    if (authService.getLocalToken()) {
      authService.fetchUserProfile()
        .then((user) => {
          setUserProfile(user);
          setIsLogged(true);
          navigate('/');
        })
        .catch(() => {
          authService.deleteLocalToken();
        });
    }
  };

  const signOut = async () => {
    setIsLogged(false);
    setUserProfile({} as UserProfile);
    authService.deleteLocalToken();
  };

  // 1.Checks for a valid local token
  useEffect(onStartUp, []);

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
