import React from 'react';
import { View } from 'react-native';

/**
 * A beautiful skeleton loader that mimics the shape of the Todo input and items.
 * Uses Tailwind's built-in animate-pulse for a smooth loading effect.
 */
export const SkeletonLoader: React.FC = () => {
  return (
    <View className="flex-1 bg-slate-50 w-full" testID="loading-indicator">
      
      {/* Mock TodoInput Skeleton */}
      <View className="flex-row p-4 bg-white shadow-sm border-b border-gray-100 items-center">
        <View className="flex-1 bg-gray-200 h-14 rounded-xl mr-3 animate-pulse" />
        <View className="bg-gray-200 h-14 w-20 rounded-xl shadow-sm animate-pulse" />
      </View>

      {/* Mock TodoItems Skeletons */}
      <View className="mt-2">
        {[1, 2, 3, 4].map((key) => (
          <View 
            key={key}
            className="flex-row items-center justify-between p-5 mb-3 rounded-2xl bg-white shadow-sm border border-gray-100 mx-4 animate-pulse"
          >
            {/* Mock text area */}
            <View className="bg-gray-200 h-6 w-3/4 rounded flex-1 mr-4" />
            
            {/* Mock delete button */}
            <View className="bg-gray-200 h-10 w-20 rounded-xl" />
          </View>
        ))}
      </View>

    </View>
  );
};
