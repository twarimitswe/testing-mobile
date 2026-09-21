import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import { useTodos } from '../hooks/useTodos';
import { TodoInput } from '../components/TodoInput';
import { TodoItem } from '../components/TodoItem';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SkeletonLoader } from '../components/SkeletonLoader';

/**
 * The main screen of the application.
 * Acts as the controller: it fetches state using the custom hook and passes it down
 * to purely presentational components (KISS principle).
 */
export default function TodoApp() {
  // Destructure exactly what we need from our custom hook
  const { todos, isLoading, error, addTodo, toggleTodo, removeTodo } = useTodos();

  // If the app is currently reading from AsyncStorage, show a loading spinner
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50" edges={['bottom', 'left', 'right']}>
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  // If there was an error reading/writing, show an error message
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 p-4">
        <Text className="text-red-500 font-bold text-lg mb-2">Oops!</Text>
        <Text className="text-gray-700 text-center">{error}</Text>
      </View>
    );
  }

  return (
    // SafeAreaView ensures content isn't hidden behind notches or status bars on modern phones
    <SafeAreaView className="flex-1 bg-slate-50" edges={['bottom', 'left', 'right']}>
      
      {/* 
        The input component for adding new tasks.
        We pass the addTodo function from our hook directly to it.
      */}
      <TodoInput onAdd={addTodo} />

      {/* 
        FlatList is highly optimized for rendering long lists in React Native.
        It only renders items currently visible on the screen.
      */}
      <FlatList
        data={todos} // The array of todo items
        keyExtractor={(item) => item.id} // Tells FlatList how to uniquely identify each row
        renderItem={({ item }) => (
          // For each item in the array, render our TodoItem component
          // Pass down the necessary data and callback functions
          <TodoItem 
            todo={item} 
            onToggle={toggleTodo} 
            onRemove={removeTodo} 
          />
        )}
        // What to show if the list is completely empty
        ListEmptyComponent={() => (
          <View className="p-10 items-center justify-center">
            <Text className="text-gray-400 text-lg text-center">
              No tasks yet! Add one above to get started.
            </Text>
          </View>
        )}
        testID="todo-list" // For testing
      />
    </SafeAreaView>
  );
}
