// Test básico para verificar que Jest está funcionando
describe('Test Setup', () => {
  test('Jest is configured correctly', () => {
    expect(true).toBe(true);
  });

  test('Simple math operation', () => {
    expect(2 + 2).toBe(4);
    expect(10 * 5).toBe(50);
  });
});