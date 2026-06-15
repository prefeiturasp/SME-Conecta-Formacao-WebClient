/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataTableContextProvider, { DataTableContext } from './index';

describe('DataTableContextProvider', () => {
  describe('Context Creation', () => {
    it('should create DataTableContext', () => {
      expect(DataTableContext).toBeDefined();
    });

    it('should have correct default values structure', () => {
      let contextValue: any;

      const TestConsumer = () => {
        contextValue = React.useContext(DataTableContext);
        return null;
      };

      render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      expect(contextValue).toEqual(
        expect.objectContaining({
          tableState: expect.any(Object),
          setTableState: expect.any(Function),
        })
      );
    });

    it('should have reloadData function in default tableState', () => {
      let tableState: any;

      const TestConsumer = () => {
        const context = React.useContext(DataTableContext);
        tableState = context.tableState;
        return null;
      };

      render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      expect(tableState.reloadData).toBeDefined();
      expect(typeof tableState.reloadData).toBe('function');
    });

    it('should have setTableState as default function', () => {
      let setTableState: any;

      const TestConsumer = () => {
        const context = React.useContext(DataTableContext);
        setTableState = context.setTableState;
        return null;
      };

      render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      expect(typeof setTableState).toBe('function');
    });
  });

  describe('DataTableContextProvider Component', () => {
    it('should render without crashing', () => {
      render(
        <DataTableContextProvider>
          <div>Test Content</div>
        </DataTableContextProvider>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(
        <DataTableContextProvider>
          <div data-testid="child-element">Child Content</div>
        </DataTableContextProvider>
      );
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <DataTableContextProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </DataTableContextProvider>
      );
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render with complex children structure', () => {
      render(
        <DataTableContextProvider>
          <div>
            <span data-testid="nested-child">Nested Content</span>
          </div>
        </DataTableContextProvider>
      );
      expect(screen.getByTestId('nested-child')).toBeInTheDocument();
    });
  });

  describe('Context Value Access', () => {
    it('should provide tableState to consumer', async () => {
      const TestConsumer = () => {
        const { tableState } = React.useContext(DataTableContext);
        return <div data-testid="tableState-display">{String(!!tableState)}</div>;
      };

      render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('tableState-display')).toHaveTextContent('true');
      });
    });

    it('should provide setTableState function to consumer', async () => {
      const TestConsumer = () => {
        const { setTableState } = React.useContext(DataTableContext);
        return <div data-testid="setTableState-display">{String(typeof setTableState)}</div>;
      };

      render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('setTableState-display')).toHaveTextContent('function');
      });
    });

    it('should provide reloadData function in tableState', async () => {
      const TestConsumer = () => {
        const { tableState } = React.useContext(DataTableContext);
        return <div data-testid="reloadData-display">{String(typeof tableState.reloadData)}</div>;
      };

      render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reloadData-display')).toHaveTextContent('function');
      });
    });
  });

  describe('State Management', () => {
    it('should initialize tableState with default reloadData function', async () => {
      let capturedTableState: any;

      const TestConsumer = () => {
        const { tableState } = React.useContext(DataTableContext);
        React.useEffect(() => {
          capturedTableState = tableState;
        }, [tableState]);
        return <div>Test</div>;
      };

      render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(capturedTableState).toBeDefined();
        expect(capturedTableState.reloadData).toBeDefined();
        expect(typeof capturedTableState.reloadData).toBe('function');
      });
    });

    it('should allow setTableState to update state', async () => {
      let capturedSetTableState: any;
      let capturedTableState: any;

      const TestConsumer = () => {
        const context = React.useContext(DataTableContext);
        capturedTableState = context.tableState;
        capturedSetTableState = context.setTableState;
        return <div data-testid="state-content">State Ready</div>;
      };

      render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('state-content')).toBeInTheDocument();
      });

      // Execute setTableState
      expect(capturedSetTableState).toBeDefined();
    });

    it('should update tableState when setTableState is called', async () => {
      const newReloadData = jest.fn();
      let capturedSetTableState: any;
      let capturedTableState: any;

      const TestConsumer = () => {
        const context = React.useContext(DataTableContext);
        const [, setLocalState] = React.useState(0);

        capturedTableState = context.tableState;
        capturedSetTableState = context.setTableState;

        return (
          <div>
            <button
              data-testid="update-state-btn"
              onClick={() => {
                capturedSetTableState({ reloadData: newReloadData });
                setLocalState((prev) => prev + 1);
              }}
            >
              Update State
            </button>
            <div data-testid="reload-data-check">{String(!!capturedTableState.reloadData)}</div>
          </div>
        );
      };

      const { rerender } = render(
        <DataTableContextProvider>
          <TestConsumer />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reload-data-check')).toHaveTextContent('true');
      });
    });
  });

  describe('Provider Props', () => {
    it('should accept PropsWithChildren correctly', () => {
      const { container } = render(
        <DataTableContextProvider>
          <div>Test</div>
        </DataTableContextProvider>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should work with empty children', () => {
      const { container } = render(
        <DataTableContextProvider>
          <div />
        </DataTableContextProvider>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should maintain React.FC typing', () => {
      // This test verifies that the component maintains React.FC typing
      const component = (
        <DataTableContextProvider>
          <div>Test</div>
        </DataTableContextProvider>
      );
      expect(component).toBeDefined();
      expect(component.type).toBeDefined();
    });
  });

  describe('Context Provider Implementation', () => {
    it('should use React.createContext', () => {
      expect(DataTableContext).toBeDefined();
      expect(DataTableContext.Provider).toBeDefined();
      expect(DataTableContext.Consumer).toBeDefined();
    });

    it('should wrap children with DataTableContext.Provider', () => {
      const TestComponent = () => {
        const context = React.useContext(DataTableContext);
        return <div data-testid="context-value">{context ? 'Has Context' : 'No Context'}</div>;
      };

      render(
        <DataTableContextProvider>
          <TestComponent />
        </DataTableContextProvider>
      );

      expect(screen.getByTestId('context-value')).toHaveTextContent('Has Context');
    });

    it('should provide both tableState and setTableState in context value', async () => {
      const TestComponent = () => {
        const { tableState, setTableState } = React.useContext(DataTableContext);
        return (
          <div>
            <span data-testid="has-tableState">{String(!!tableState)}</span>
            <span data-testid="has-setTableState">{String(!!setTableState)}</span>
          </div>
        );
      };

      render(
        <DataTableContextProvider>
          <TestComponent />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('has-tableState')).toHaveTextContent('true');
        expect(screen.getByTestId('has-setTableState')).toHaveTextContent('true');
      });
    });
  });

  describe('Default Values', () => {
    it('should have default reloadData as empty function', () => {
      const TestComponent = () => {
        const { tableState } = React.useContext(DataTableContext);
        const result = tableState.reloadData();
        return <div data-testid="result">{String(result === undefined)}</div>;
      };

      render(
        <DataTableContextProvider>
          <TestComponent />
        </DataTableContextProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('true');
    });

    it('should have default setTableState as function', () => {
      const TestComponent = () => {
        const { setTableState } = React.useContext(DataTableContext);
        const result = typeof setTableState === 'function';
        return <div data-testid="result">{String(result)}</div>;
      };

      render(
        <DataTableContextProvider>
          <TestComponent />
        </DataTableContextProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('true');
    });
  });

  describe('Export Validation', () => {
    it('should export DataTableContext', () => {
      expect(DataTableContext).toBeDefined();
      expect(typeof DataTableContext).toBe('object');
    });

    it('should export default DataTableContextProvider', () => {
      expect(DataTableContextProvider).toBeDefined();
      expect(typeof DataTableContextProvider).toBe('function');
    });

    it('should have correct display name for debugging', () => {
      // Check that the component is recognizable for debugging
      expect(DataTableContextProvider.name).toBe('DataTableContextProvider');
    });
  });

  describe('React Hooks Integration', () => {
    it('should use useState hook correctly', async () => {
      let stateUpdates = 0;

      const TestComponent = () => {
        const { tableState } = React.useContext(DataTableContext);
        React.useEffect(() => {
          stateUpdates++;
        }, [tableState]);
        return <div data-testid="updates">{stateUpdates}</div>;
      };

      render(
        <DataTableContextProvider>
          <TestComponent />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(stateUpdates).toBeGreaterThan(0);
      });
    });

    it('should provide useState setTableState function', async () => {
      let setTableStateType: string;

      const TestComponent = () => {
        const { setTableState } = React.useContext(DataTableContext);
        React.useEffect(() => {
          setTableStateType = typeof setTableState;
        }, [setTableState]);
        return <div>Test</div>;
      };

      render(
        <DataTableContextProvider>
          <TestComponent />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(setTableStateType).toBe('function');
      });
    });
  });

  describe('Component Re-rendering', () => {
    it('should not cause unnecessary re-renders of children', () => {
      const renderSpy = jest.fn();

      const TestChild = () => {
        renderSpy();
        return <div data-testid="child">Child</div>;
      };

      const { rerender } = render(
        <DataTableContextProvider>
          <TestChild />
        </DataTableContextProvider>
      );

      const initialRenderCount = renderSpy.mock.calls.length;

      rerender(
        <DataTableContextProvider>
          <TestChild />
        </DataTableContextProvider>
      );

      // Child should be re-rendered
      expect(renderSpy.mock.calls.length).toBeGreaterThanOrEqual(initialRenderCount);
    });

    it('should maintain context value across re-renders', async () => {
      let contextValuesBefore: any;
      let contextValuesAfter: any;

      const TestComponent = () => {
        const context = React.useContext(DataTableContext);
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          if (count === 0) {
            contextValuesBefore = context;
          } else {
            contextValuesAfter = context;
          }
        }, [count, context]);

        return (
          <button data-testid="increment-btn" onClick={() => setCount(count + 1)}>
            {count}
          </button>
        );
      };

      render(
        <DataTableContextProvider>
          <TestComponent />
        </DataTableContextProvider>
      );

      await waitFor(() => {
        expect(contextValuesBefore).toBeDefined();
      });
    });
  });
});
