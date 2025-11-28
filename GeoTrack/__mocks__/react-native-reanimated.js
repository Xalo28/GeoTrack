export default {
  Value: jest.fn(),
  event: jest.fn(),
  createAnimatedComponent: (component) => component,
  interpolate: jest.fn(),
  Extrapolate: { CLAMP: jest.fn() },
  useSharedValue: jest.fn(),
  useAnimatedStyle: jest.fn(() => ({})),
  withSpring: jest.fn(),
  withTiming: jest.fn(),
  runOnJS: jest.fn(),
  cancelAnimation: jest.fn(),
};