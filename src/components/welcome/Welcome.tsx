import { FC, useEffect, useState } from 'react';
import { useAuthContext } from '../../contexts';
import { Spinner } from '../spinner/Spinner';
import './welcome.css';


export const Welcome: FC = () => {
  const [isLoading, setIsloading] = useState(true);
  const { userProfile, signOut } = useAuthContext();

  useEffect(() => {
    if (userProfile.id || userProfile.username) {
      setIsloading(false);
    }
  }, [userProfile]);


  if (isLoading) {
    return <Spinner size="font-6" />;
  }
  return (
    <div className="welcome">
      <h1 className="welcome__heading">
        <span>Welcome</span>
        <span className="welcome__user">{userProfile.username}</span>
      </h1>
      <button onClick={() => signOut()} className="btn" type="button">log out</button>
    </div>
  );
};
