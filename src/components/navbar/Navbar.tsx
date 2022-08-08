import { FC } from 'react';
import { FaStream, FaSun, FaMoon } from 'react-icons/fa';
import { useThemeContext } from '../../contexts';
import './navbar.css';


export const Navbar: FC = () => {
  const { theme, onToggleTheme } = useThemeContext();

  return (
    <nav className="navbar">
      <FaStream className="navbar__icon" />

      <h2 className="navbar__heading">LarnU Bootcamp</h2>

      <span onClick={() => onToggleTheme()}>
        {theme === 'dark' && <FaMoon className="navbar__icon" title="change theme" />}
        {theme === 'light' && <FaSun className="navbar__icon" title="change theme" />}
      </span>
    </nav>
  );
};
