import { usePinch } from './';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useMyHook', () => {
  beforeAll(() => {});

  it('should get correct colorMode when fire change event', () => {
    const { result } = renderHook(() => usePinch());

    expect(result.current).toEqual(0);

    act(() => {});

    expect(result.current).toEqual(1);
  });
});
