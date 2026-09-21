import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTodos } from '../useTodos';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We need to mock AsyncStorage so our tests don't try to access real device storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

/**
 * UNIT & ASYNC TESTING
 * These tests focus strictly on the logical operations of our custom hook.
 * We test asynchronous behavior like loading from and saving to AsyncStorage.
 */
describe('useTodos Custom Hook', () => {
  // Before each test, clear all mock data to ensure tests are isolated (KISS)
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with an empty array and loading state', async () => {
    // Mock AsyncStorage to return null (no saved data)
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

    // renderHook is used to test React hooks outside of components
    const { result } = await renderHook(() => useTodos());

    // Initially, it should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.todos).toEqual([]);

    // We must wait for the async useEffect to finish processing
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    // After loading finishes, it should still be empty
    expect(result.current.todos).toEqual([]);
  });

  it('should load saved todos from AsyncStorage asynchronously', async () => {
    // Create some fake data that would be in storage
    const fakeData = [{ id: '1', text: 'Test Async', completed: false }];
    // Mock AsyncStorage to return our fake data as a JSON string
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(fakeData));

    const { result } = await renderHook(() => useTodos());

    // Wait for the async load to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Verify the hook parsed and loaded the data correctly
    expect(result.current.todos).toEqual(fakeData);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@todos_key');
  });

  it('should add a new todo and save to storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const { result } = await renderHook(() => useTodos());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // When modifying state in a hook test, we must wrap it in act()
    await act(async () => {
      await result.current.addTodo('New Task');
    });

    // Verify the new task was added to local state
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].text).toBe('New Task');
    expect(result.current.todos[0].completed).toBe(false);

    // Verify setItem was called to save the new state asynchronously
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('should toggle a todo status', async () => {
    const fakeData = [{ id: '1', text: 'Task 1', completed: false }];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(fakeData));
    const { result } = await renderHook(() => useTodos());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.toggleTodo('1');
    });

    // Verify the task is now completed
    expect(result.current.todos[0].completed).toBe(true);
  });

  it('should remove a todo', async () => {
    const fakeData = [{ id: '1', text: 'Task 1', completed: false }];
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(fakeData));
    const { result } = await renderHook(() => useTodos());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.removeTodo('1');
    });

    // Verify the list is now empty
    expect(result.current.todos.length).toBe(0);
  });
});
