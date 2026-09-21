import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TodoItem } from '../TodoItem';

/**
 * COMPONENT TESTING
 * These tests focus purely on the rendering and interactions of a single isolated component.
 * We don't care about where the data comes from or where it goes, just that the UI works.
 */
describe('TodoItem Component', () => {
  // Setup standard mock functions to pass as props
  const mockOnToggle = jest.fn();
  const mockOnRemove = jest.fn();
  
  // A standard piece of fake data for testing
  const mockTodo = {
    id: '1',
    text: 'Buy Groceries',
    completed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the text correctly', () => {
    // Render the component in isolation
    const { getByText } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />
    );
    
    // Verify the text is visible on the screen
    expect(getByText('Buy Groceries')).toBeTruthy();
  });

  it('calls onToggle when the text area is pressed', () => {
    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />
    );
    
    // Find the touchable area using the testID we added to the component
    const touchable = getByTestId('todo-item-1');
    // Simulate a user tap
    fireEvent.press(touchable);
    
    // Verify our callback was fired with the correct ID
    expect(mockOnToggle).toHaveBeenCalledWith('1');
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove when the delete button is pressed', () => {
    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onRemove={mockOnRemove} />
    );
    
    // Find the delete button
    const deleteBtn = getByTestId('delete-btn-1');
    // Simulate a user tap
    fireEvent.press(deleteBtn);
    
    // Verify the remove callback was fired
    expect(mockOnRemove).toHaveBeenCalledWith('1');
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });
});
