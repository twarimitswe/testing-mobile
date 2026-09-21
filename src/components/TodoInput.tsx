import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

// Define the props for the input component
interface TodoInputProps {
  onAdd: (text: string) => void; // Callback fired when the user submits a new task
}

/**
 * A component responsible for capturing user input and passing it up.
 * Maintains its own local state for the input field to keep the parent clean (KISS).
 */
export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  // Local state to track the text currently in the input field
  const [text, setText] = useState('');

  /**
   * Handles the submission of the new task.
   */
  const handleAdd = () => {
    // Only proceed if there's actual text (not just whitespace)
    if (text.trim().length > 0) {
      // Call the parent's onAdd function with the trimmed text
      onAdd(text.trim());
      // Clear the local input field after successful addition
      setText('');
    }
  };

  return (
    // Container for the input row.
    // Flex-row puts elements side-by-side, p-4 adds padding around the edges
    <View className="flex-row p-4 bg-white shadow-sm border-b border-gray-100 items-center">
      
      {/* 
        The text input field where the user types.
        flex-1 makes it take up most of the space.
      */}
      <TextInput
        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mr-3 text-lg text-gray-800"
        placeholder="What needs to be done?" // Hint text when empty
        value={text} // Bound to our local state
        onChangeText={setText} // Updates local state as user types
        onSubmitEditing={handleAdd} // Allows submitting by pressing 'Enter' on keyboard
        testID="todo-input" // Identifier for testing
        placeholderTextColor="#9ca3af" // Better placeholder contrast
      />

      {/* 
        The 'Add' button.
        Disabled visually if the input is empty to prevent useless clicks.
      */}
      <TouchableOpacity
        className={`px-6 py-4 rounded-xl justify-center items-center shadow-sm ${
          text.trim().length > 0 ? 'bg-indigo-600' : 'bg-indigo-300' // Conditional background color
        }`}
        onPress={handleAdd} // Trigger the add logic on tap
        disabled={text.trim().length === 0} // Native disabled state to prevent interactions
        testID="todo-add-btn" // Identifier for testing
      >
        <Text className="text-white font-bold text-lg">Add</Text>
      </TouchableOpacity>
      
    </View>
  );
};
