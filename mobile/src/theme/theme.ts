import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Custom colors based on the mockup
const colors = {
  primary: '#8B1538', // Dark red/maroon from mockup
  primaryContainer: '#B71C1C',
  secondary: '#FF5722',
  secondaryContainer: '#FFCDD2',
  tertiary: '#4CAF50',
  tertiaryContainer: '#C8E6C9',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F5F5',
  background: '#FFFFFF',
  error: '#F44336',
  errorContainer: '#FFCDD2',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#000000',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#000000',
  onSurface: '#000000',
  onSurfaceVariant: '#424242',
  onBackground: '#000000',
  onError: '#FFFFFF',
  onErrorContainer: '#000000',
  outline: '#E0E0E0',
  outlineVariant: '#F5F5F5',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#303030',
  inverseOnSurface: '#FFFFFF',
  inversePrimary: '#FFCDD2',
  elevation: {
    level0: 'transparent',
    level1: '#FFFFFF',
    level2: '#FFFFFF',
    level3: '#FFFFFF',
    level4: '#FFFFFF',
    level5: '#FFFFFF',
  },
  // Custom colors
  text: '#424242',
  textSecondary: '#757575',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  card: '#FFFFFF',
  cardBorder: '#E0E0E0',
  inputBackground: '#FAFAFA',
  inputBorder: '#E0E0E0',
  tabBar: '#F5F5F5',
  drawerBackground: '#FFFFFF',
  notification: '#FF5722',
};

export const theme = {
  ...MD3LightTheme,
  colors,
  roundness: 12,
  fonts: {
    ...MD3LightTheme.fonts,
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: 'Roboto',
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: 'Roboto',
    },
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: 'Roboto',
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: 'Roboto-Bold',
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: 'Roboto-Bold',
    },
    headlineSmall: {
      ...MD3LightTheme.fonts.headlineSmall,
      fontFamily: 'Roboto-Bold',
    },
    titleLarge: {
      ...MD3LightTheme.fonts.titleLarge,
      fontFamily: 'Roboto-Bold',
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: 'Roboto-Bold',
    },
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: 'Roboto',
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: 'Roboto',
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: 'Roboto',
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: 'Roboto',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF6B6B',
    primaryContainer: '#8B1538',
    secondary: '#4ECDC4',
    surface: '#121212',
    background: '#000000',
    onPrimary: '#FFFFFF',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    card: '#1E1E1E',
    cardBorder: '#333333',
    inputBackground: '#2A2A2A',
    inputBorder: '#333333',
    tabBar: '#1E1E1E',
    drawerBackground: '#121212',
  },
  roundness: 12,
  fonts: theme.fonts,
};
