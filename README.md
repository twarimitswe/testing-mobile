# React Native Todo App - Testing Strategy & Architecture

This repository demonstrates a modern, well-tested React Native Todo application built with Expo and NativeWind (Tailwind CSS). It is specifically designed to showcase a clean architecture (following DRY and KISS principles) and a comprehensive, multi-layered testing strategy.

---

## 🏗️ The Testing Pyramid

Our testing strategy follows the standard testing pyramid, ensuring confidence at every level of the application. The tests are located alongside the code they test (`__tests__` folders) and in the root `e2e` folder.

### 1. Unit & Async Testing (`src/hooks/__tests__`)
**Purpose**: To verify that the core business logic (state management and side effects) works exactly as expected in complete isolation from the UI.
- **Layout**: Tests are located right next to the hook they test. For example, `src/hooks/__tests__/useTodos.test.ts`.
- **How it's wired**: We use `@testing-library/react-native`'s `renderHook` to execute our custom hooks in a virtual environment. We use `jest.mock()` to intercept calls to external dependencies like `AsyncStorage`, preventing actual disk I/O during tests.
- **What happens if missing**: Without unit tests, you risk shipping broken logic. If a developer accidentally introduces a bug in how tasks are saved or deleted, it might silently corrupt user data without anyone noticing until the app crashes in production.
- **Best Practices**:
  - Mock all external dependencies (like `AsyncStorage` or network calls).
  - Use `act()` when testing functions that trigger state updates.
  - Assert that loading states correctly transition from `true` to `false`.

### 2. Component Testing (`src/components/__tests__`)
**Purpose**: To ensure that purely presentational UI components render correctly and trigger the right callbacks when interacted with by the user.
- **Layout**: Located next to the components. For example, `src/components/__tests__/TodoItem.test.tsx`.
- **How it's wired**: We render the component in a simulated DOM using `@testing-library/react-native`. We pass "fake" data via props and use `jest.fn()` to create spy functions that monitor if buttons were clicked.
- **What happens if missing**: Without component tests, a CSS refactor or a prop name change could break a button's functionality, making the UI unusable even if the underlying logic (the custom hook) is perfectly fine.
- **Best Practices**:
  - Test the component in isolation. Don't worry about where the data came from.
  - Use `testID` props in your components to easily query elements (e.g., `getByTestId('todo-add-btn')`).
  - Verify that mock callbacks (`jest.fn()`) are called with the correct arguments when simulated events (`fireEvent.press`) occur.

### 3. Integration Testing (`src/app/__tests__`)
**Purpose**: To verify that the different layers of the app (the UI components, the custom hooks, and the mocked storage) work together seamlessly to complete a user workflow.
- **Layout**: Usually placed at the screen/page level. For example, `src/app/__tests__/index.test.tsx`.
- **How it's wired**: We render the entire `TodoApp` screen. The UI triggers the real hook, which updates the real state, which triggers a re-render of the UI. We still mock `AsyncStorage` so tests run fast.
- **What happens if missing**: You might have perfect unit tests and perfect component tests, but if you forgot to pass the `addTodo` function from the hook into the `TodoInput` component, the app simply won't work. Integration tests catch these "wiring" bugs.
- **Best Practices**:
  - Interact with the app exactly how a user would (find input, type text, find button, click it).
  - Test asynchronous UI updates using `waitFor` (e.g., waiting for the loading spinner to disappear before checking for the list).
  - Avoid mocking internal components; only mock external boundaries (like databases or APIs).

### 4. End-to-End (E2E) Testing (`e2e/`)
**Purpose**: To test the fully compiled application running on a real device or simulator, ensuring the entire stack (including native modules and real databases) functions correctly.
- **Layout**: Placed in a root `e2e` directory.
- **How it's wired**: We use **Detox**, which compiles the app natively, installs it on a simulator, and uses native automation frameworks (like XCUITest for iOS) to physically tap the screen and read the pixel output.
- **What happens if missing**: E2E tests are your final safety net. Without them, an issue with a native library configuration (e.g., the app crashing on startup due to a bad linking issue in Expo) might slip through, resulting in an app that immediately crashes when a user opens it.
- **Best Practices**:
  - Keep E2E tests focused on the most critical "happy paths" (e.g., logging in, creating a task, deleting a task).
  - They are slow and flaky, so don't write an E2E test for every minor edge case (use unit/integration tests for that).
  - Always clean state (`device.reloadReactNative()`) before each test.

---

## 🚀 Running the Tests

We use Jest as our test runner for Unit, Component, and Integration tests.

```bash
# Run all tests
pnpm run test

# Run tests with a coverage report to see what lines of code are untested
pnpm run test -- --coverage
```

*(Note: E2E tests require specific Detox native configuration and prebuilding the app, which involves setting up Xcode and Android Studio).*
