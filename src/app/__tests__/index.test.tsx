import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TodoApp from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage for the entire integration test
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

/**
 * INTEGRATION TESTING
 * These tests verify that multiple units (TodoInput, TodoItem, useTodos hook, and the index screen)
 * work together correctly. It simulates real user workflows.
 */
describe('TodoApp Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to returning null (empty storage) for tests unless overridden
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('shows loading state initially, then shows empty message', async () => {
    const { getByTestId, getByText, queryByTestId } = await render(<TodoApp />);
    
    // Initially, it should be loading
    expect(getByTestId('loading-indicator')).toBeTruthy();
    
    // Wait for the async load to finish
    await waitFor(() => {
      // The loading indicator should disappear
      expect(queryByTestId('loading-indicator')).toBeNull();
    });

    // The empty list message should appear
    expect(getByText('No tasks yet! Add one above to get started.')).toBeTruthy();
  });

  it('allows user to add a new task and displays it', async () => {
    const { getByTestId, getByText, queryByText } = await render(<TodoApp />);
    
    // Wait for loading to finish
    await waitFor(() => expect(queryByText('Loading your tasks...')).toBeNull());

    // 1. User types in the input
    const input = getByTestId('todo-input');
    fireEvent.changeText(input, 'Write integration tests');

    // 2. User taps the Add button
    const addButton = getByTestId('todo-add-btn');
    fireEvent.press(addButton);

    // 3. Verify the new task appears in the list (Integration check!)
    // We have to wait for the state update and async storage save to complete
    await waitFor(() => {
      expect(getByText('Write integration tests')).toBeTruthy();
    });

    // Verify it was saved to storage
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('loads existing tasks from storage and displays them', async () => {
    // Setup fake data that exists in storage before the app boots
    const fakeData = [{ id: '99', text: 'Pre-existing Task', completed: false }];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(fakeData));

    const { getByText, queryByTestId } = await render(<TodoApp />);
    
    // Wait for loading to finish
    await waitFor(() => expect(queryByTestId('loading-indicator')).toBeNull());

    // Verify the pre-existing task is rendered on the screen
    expect(getByText('Pre-existing Task')).toBeTruthy();
  });
});
