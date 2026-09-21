describe('Todo App End-to-End', () => {
  beforeAll(async () => {
    // This connects Detox to the app running in the simulator
    await device.launchApp();
  });

  beforeEach(async () => {
    // Restart the app clean before every test
    await device.reloadReactNative();
  });

  it('should show the empty state initially', async () => {
    // Verify the empty list message is visible
    await expect(element(by.text('No tasks yet! Add one above to get started.'))).toBeVisible();
  });

  it('should allow adding and removing a task', async () => {
    // 1. Find the input and type
    await element(by.id('todo-input')).typeText('My Detox Task');
    
    // 2. Tap the add button
    await element(by.id('todo-add-btn')).tap();
    
    // 3. Verify the new task is in the list
    await expect(element(by.text('My Detox Task'))).toBeVisible();

    // 4. Delete the task
    // Using testID we assigned in TodoItem.tsx, assuming it gets an ID of '1' for the first item
    // In a real e2e test, we might look for the first delete button
    await element(by.id('delete-btn-1')).tap();
    
    // 5. Verify it's gone
    await expect(element(by.text('My Detox Task'))).toNotExist();
  });
});
