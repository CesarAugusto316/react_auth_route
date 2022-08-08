import {
  createContext, FC, ReactNode, ReducerWithoutAction, useContext, useMemo, useReducer,
} from 'react';


type Theme = 'light' | 'dark';

interface ContextProps {
  theme: Theme,
  onToggleTheme: () => void
}

const Context = createContext({} as ContextProps);

export const useThemeContext = () => {
  return useContext(Context);
};

const themeReducer: ReducerWithoutAction<Theme> = (state) => {
  if (state === 'light') {
    return 'dark';
  }
  return 'light';
};

const setInitialTheme = (): Theme => {
  const initialState: string | null = localStorage.getItem('react-theme');
  if ((initialState === null)) {
    return 'light'; // default theme
  }
  return initialState as Theme;
};

export const ThemeProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useReducer(themeReducer, setInitialTheme());

  const onToggleTheme = () => {
    setTheme();
    if (theme === 'light') {
      localStorage.setItem('react-theme', 'dark');
    } else {
      localStorage.setItem('react-theme', 'light');
    }
  };

  /**
   *
   * @description Optimization
   */
  const memoizedValues = useMemo(() => {
    return {
      theme, onToggleTheme,
    };
  }, [theme]);


  return (
    <Context.Provider value={memoizedValues}>
      <div id="app" data-theme={theme}>
        {children}
      </div>
    </Context.Provider>
  );
};
