import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, createTheme, Button } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

const theme = createTheme({
  lightColors: {
    primary: '#2089dc',
    secondary: '#ad1457',
    background: '#ffffff',
  },
  darkColors: {
    primary: '#73c2fb',
    secondary: '#ff5c8d',
    background: '#121212',
  },
  mode: 'light',
});

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <Button title="Welcome to DressMe!" />
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
