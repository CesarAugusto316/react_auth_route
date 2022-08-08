import { FC, ReactElement } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts';


export const RequiredAuth: FC<{children: ReactElement}> = ({ children }) => {
  const { isLogged } = useAuthContext();
  const location = useLocation();

  if (!isLogged) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};
