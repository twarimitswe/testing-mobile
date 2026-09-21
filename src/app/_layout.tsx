import { Stack } from 'expo-router';
import '../global.css'; // Import the global CSS which includes Tailwind directives

/**
 * The main layout wrapper for the Expo Router app.
 * Since we are building a simple Todo app, we just use a basic Stack layout.
 */
export default function Layout() {
  return (
    // Stack navigator provides the standard navigation bar at the top
    <Stack>
      {/* Configure the main index screen */}
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Todos', // The title displayed in the header
          headerStyle: {
            backgroundColor: '#2563eb', // Tailwind blue-600 color for the header
          },
          headerTintColor: '#ffffff', // White text for the header
          headerTitleStyle: {
            fontWeight: 'bold', // Bold text for the title
          },
        }} 
      />
    </Stack>
  );
}
