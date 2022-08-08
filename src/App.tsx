import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
  Navbar, LoginForm, Welcome, RequiredAuth,
} from './components';
import { useThemeContext } from './contexts';


export const App: FC = () => {
  const { theme } = useThemeContext();

  return (
    <>
      <Navbar />
      <section className="section">
        <Routes>
          <Route
            path="/"
            element={(
              <RequiredAuth>
                <Welcome />
              </RequiredAuth>
            )}
          />
          <Route
            path="/login"
            element={<LoginForm />}
          />
        </Routes>
      </section>
      <ToastContainer autoClose={1_200} theme={theme} />
    </>
  );
};
