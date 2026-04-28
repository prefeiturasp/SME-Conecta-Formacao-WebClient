/**
 * @jest-environment jsdom
 */
import { useAppDispatch, useAppSelector } from './use-redux';

const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    mockSelector(selector),
  TypedUseSelectorHook: jest.fn(),
}));

jest.mock('../redux', () => ({
  store: {},
}));

describe('use-redux', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAppDispatch', () => {
    it('should be a function', () => {
      expect(typeof useAppDispatch).toBe('function');
    });

    it('should return the dispatch function from react-redux', () => {
      const dispatch = useAppDispatch();
      expect(dispatch).toBe(mockDispatch);
    });

    it('should return a callable dispatch', () => {
      const dispatch = useAppDispatch();
      const action = { type: 'TEST_ACTION' };
      dispatch(action as any);
      expect(mockDispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('useAppSelector', () => {
    it('should be defined', () => {
      expect(useAppSelector).toBeDefined();
    });

    it('should call selector with state', () => {
      const selector = (state: unknown) => state;
      mockSelector.mockReturnValue('someValue');

      const result = useAppSelector(selector);

      expect(mockSelector).toHaveBeenCalledWith(selector);
      expect(result).toBe('someValue');
    });

    it('should return value from selector', () => {
      const selector = jest.fn().mockReturnValue(42);
      mockSelector.mockImplementation((sel: (s: unknown) => unknown) =>
        sel({}),
      );

      const result = useAppSelector(selector);

      expect(result).toBe(42);
    });
  });
});
