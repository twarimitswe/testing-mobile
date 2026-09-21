import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from './mockAsyncStorage';

// Define the shape of a single Todo item to maintain type safety across the app
export interface Todo {
  id: string; // Unique identifier for each todo
  text: string; // The actual content of the task
  completed: boolean; // Status of the task (done or not done)
}

// Key used to store and retrieve the todo list from AsyncStorage
const STORAGE_KEY = '@todos_key';

/**
 * Custom hook to manage Todo state and persistence.
 * Follows the DRY principle by centralizing all todo-related logic here,
 * so components remain simple and just handle rendering (KISS principle).
 */
export const useTodos = () => {
  // State to hold the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State to track if we are currently loading data from storage
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State to hold any error that might occur during async operations
  const [error, setError] = useState<string | null>(null);

  // Function to load todos from AsyncStorage when the app starts
  const loadTodos = async () => {
    try {
      // Set loading state to true before fetching
      setIsLoading(true);
      // Attempt to get the stringified data from storage
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      // If data exists, parse it from JSON to array, otherwise use empty array
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (e) {
      // If an error occurs (e.g., storage full, parsing error), capture it
      setError('Failed to load todos from storage.');
      console.error(e);
    } finally {
      // Always set loading to false when done, whether successful or not
      setIsLoading(false);
    }
  };

  // Run the load function exactly once when the hook is first used (on mount)
  useEffect(() => {
    loadTodos();
  }, []);

  /**
   * Helper function to save the current state of todos back to storage.
   * This ensures our local state and persistent storage stay in sync.
   * @param newTodos The updated list of todos to save
   */
  const saveTodos = async (newTodos: Todo[]) => {
    try {
      // Convert the array to a JSON string and save it to the specified key
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
      // Update the local React state so the UI re-renders
      setTodos(newTodos);
    } catch (e) {
      // Capture and log any errors during the save process
      setError('Failed to save todos.');
      console.error(e);
    }
  };

  /**
   * Adds a new todo item to the list.
   * Wrapped in useCallback to prevent unnecessary re-renders in child components.
   * @param text The text for the new todo
   */
  const addTodo = useCallback(async (text: string) => {
    // Basic validation to prevent empty tasks
    if (!text.trim()) return;

    // Create a new todo object with a unique timestamp ID
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false, // New tasks are not completed by default
    };

    // Prepend the new todo to the existing list (LIFO behavior)
    const updatedTodos = [newTodo, ...todos];
    // Save the updated list, which also updates local state
    await saveTodos(updatedTodos);
  }, [todos]);

  /**
   * Toggles the completed status of a specific todo item.
   * @param id The ID of the todo to toggle
   */
  const toggleTodo = useCallback(async (id: string) => {
    // Map over existing todos, flip the completed boolean if the ID matches
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    // Save the updated list, which also updates local state
    await saveTodos(updatedTodos);
  }, [todos]);

  /**
   * Removes a specific todo item from the list entirely.
   * @param id The ID of the todo to remove
   */
  const removeTodo = useCallback(async (id: string) => {
    // Filter out the todo whose ID matches the one we want to delete
    const updatedTodos = todos.filter(todo => todo.id !== id);
    // Save the updated list, which also updates local state
    await saveTodos(updatedTodos);
  }, [todos]);

  // Return the necessary state and functions for components to consume
  return {
    todos,
    isLoading,
    error,
    addTodo,
    toggleTodo,
    removeTodo,
  };
};
