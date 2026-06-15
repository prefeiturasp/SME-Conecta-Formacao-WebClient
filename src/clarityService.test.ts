import { initClarity } from './clarityService';

describe('initClarity', () => {
  it('deve criar e adicionar o script ao head', () => {
    const scriptMock = {
      type: '',
      async: false,
      innerHTML: '',
    };

    const appendChildMock = jest.fn();
    const createElementMock = jest.fn().mockReturnValue(scriptMock);

    Object.defineProperty(globalThis, 'document', {
      value: {
        createElement: createElementMock,
        head: {
          appendChild: appendChildMock,
        },
      },
      configurable: true,
    });

    initClarity();

    expect(createElementMock).toHaveBeenCalledWith('script');
    expect(scriptMock.type).toBe('text/javascript');
    expect(scriptMock.async).toBe(true);
    expect(scriptMock.innerHTML).toContain('clarity.ms/tag/');
    expect(scriptMock.innerHTML).toContain('vu7wyj6qw2');
    expect(appendChildMock).toHaveBeenCalledWith(scriptMock);
  });
});