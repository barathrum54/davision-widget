import { ThemeConfig } from '../types';

export const createTheme = (customTheme?: Partial<ThemeConfig>): ThemeConfig => {
  const defaultTheme: ThemeConfig = {
    primaryColor: '#007bff',
    secondaryColor: '#735a3c',
    backgroundColor: '#f1ece9',
    textColor: '#333333',
    borderRadius: '25px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
    },
  };

  return { ...defaultTheme, ...customTheme };
}; 