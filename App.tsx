import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, createTheme, useTheme } from '@rneui/themed';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { TryOnScreen } from './src/screens/TryOnScreen';
import { WardrobeScreen } from './src/screens/WardrobeScreen';
import { Icon } from '@rneui/themed';
import { Platform, useColorScheme } from 'react-native';
import * as Updates from 'expo-updates';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const theme = createTheme({
  lightColors: {
    primary: '#7C3AED', // Vibrant purple
    secondary: '#EC4899', // Pink
    background: '#1F2937', // Dark background for light mode too
    white: '#FFFFFF',
    black: '#1F2937',
    grey0: '#F9FAFB',
    grey1: '#F3F4F6',
    grey2: '#E5E7EB',
    grey3: '#D1D5DB',
    grey4: '#9CA3AF',
    grey5: '#6B7280',
    greyOutline: '#4B5563',
    searchBg: '#374151',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    divider: '#374151',
  },
  darkColors: {
    primary: '#8B5CF6', // Lighter purple for dark mode
    secondary: '#F472B6', // Lighter pink for dark mode
    background: '#111827', // Darker background
    white: '#FFFFFF',
    black: '#1F2937',
    grey0: '#F9FAFB',
    grey1: '#F3F4F6',
    grey2: '#E5E7EB',
    grey3: '#D1D5DB',
    grey4: '#9CA3AF',
    grey5: '#6B7280',
    greyOutline: '#4B5563',
    searchBg: '#374151',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    divider: '#1F2937',
  },
  mode: 'dark',
  components: {
    Button: {
      raised: true,
      buttonStyle: {
        borderRadius: 12,
        paddingVertical: 12,
      },
      containerStyle: {
        borderRadius: 12,
      },
    },
    Card: {
      containerStyle: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: '#1F2937',
      },
    },
    Text: {
      h1Style: {
        fontWeight: '700',
        color: '#F9FAFB',
      },
      h2Style: {
        fontWeight: '600',
        color: '#F9FAFB',
      },
      h3Style: {
        fontWeight: '600',
        color: '#F9FAFB',
      },
      h4Style: {
        fontWeight: '600',
        color: '#F9FAFB',
      },
      style: {
        color: '#F3F4F6',
      },
    },
  },
});

function TabNavigator() {
  const { theme: currentTheme } = useTheme();
  const colorScheme = useColorScheme();

  const onReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.log('Error reloading app:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111827',
          borderTopColor: '#1F2937',
          borderTopWidth: 1,
          paddingVertical: 8,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'TryOnTab') {
            iconName = 'tshirt';
          } else if (route.name === 'WardrobeTab') {
            iconName = 'closet';
          } else if (route.name === 'ReloadTab') {
            iconName = 'reload';
          }

          return (
            <Icon
              name={iconName}
              type={route.name === 'TryOnTab' ? 'font-awesome-5' : 'material-community'}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: currentTheme.colors.primary,
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 4,
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="TryOnTab" 
        component={TryOnScreen}
        options={{ title: 'Try On' }}
      />
      <Tab.Screen 
        name="WardrobeTab" 
        component={WardrobeScreen}
        options={{ title: 'Wardrobe' }}
      />
      {__DEV__ && (
        <Tab.Screen
          name="ReloadTab"
          component={HomeScreen}
          options={{ 
            title: 'Reload',
            tabBarButton: (props) => (
              <Icon
                {...props}
                name="reload"
                type="material-community"
                size={25}
                color={currentTheme.colors.primary}
                containerStyle={{ padding: 15 }}
                onPress={onReload}
              />
            )
          }}
        />
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme} useDark={true}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="MainTabs" component={TabNavigator} />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
