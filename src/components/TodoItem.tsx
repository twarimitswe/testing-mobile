import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Todo } from '../hooks/useTodos';

// Define the props expected by the TodoItem component
interface TodoItemProps {
  todo: Todo; // The specific todo item data to render
  onToggle: (id: string) => void; // Callback fired when the item is tapped to toggle completion
  onRemove: (id: string) => void; // Callback fired when the delete button is tapped
}

/**
 * A purely presentational component (KISS) that renders a single Todo item.
 * It uses Tailwind classes (via NativeWind) for styling.
 */
export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onRemove }) => {
  return (
    // Main container for the list item.
    // Uses flexbox to align items horizontally (row), adds padding (p-4),
    // a bottom border (border-b), and subtle colors.
    <View className="flex-row items-center justify-between p-5 mb-3 rounded-2xl bg-white shadow-sm border border-gray-100 mx-4 mt-2">
      
      {/* 
        The main touchable area for the task text. 
        Tapping this toggles the task completion status.
      */}
      <TouchableOpacity 
        className="flex-1 mr-4" // flex-1 allows text to take up remaining space, mr-4 adds margin right
        onPress={() => onToggle(todo.id)} // Fire toggle callback with item ID
        testID={`todo-item-${todo.id}`} // testID used by testing libraries to find this element
      >
        <Text 
          // Dynamically apply line-through and gray text if the task is completed
          className={`text-xl font-medium ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}
        >
          {todo.text} {/* Display the actual task text */}
        </Text>
      </TouchableOpacity>

      {/* 
        The delete button. 
        Kept separate so the user can explicitly remove the task.
      */}
      <TouchableOpacity 
        className="bg-red-500/10 px-4 py-3 rounded-xl border border-red-100" // Red background, padding, rounded corners
        onPress={() => onRemove(todo.id)} // Fire remove callback with item ID
        testID={`delete-btn-${todo.id}`} // testID for testing tools
      >
        <Text className="text-red-600 font-bold text-base">Delete</Text>
      </TouchableOpacity>
      
    </View>
  );
};
