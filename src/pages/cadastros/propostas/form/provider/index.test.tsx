/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { useContext } from 'react';
import { render, act, screen } from '@testing-library/react';
import {
  PropostaContext,
  PropostaContextProvider,
} from './index';

describe('PropostaContext', () => {
  it('deve fornecer valores iniciais do contexto', () => {
    const Consumer = () => {
      const { formInitialValues } = useContext(PropostaContext);
      return <div data-testid="value">{JSON.stringify(formInitialValues)}</div>;
    };

    render(
      <PropostaContextProvider>
        <Consumer />
      </PropostaContextProvider>,
    );

    expect(screen.getByTestId('value')).toHaveTextContent('{}');
  });

  it('deve atualizar formInitialValues através do provider', () => {
    const Consumer = () => {
      const { formInitialValues, setFormInitialValues } =
        useContext(PropostaContext);

      return (
        <div>
          <span data-testid="value">
            {JSON.stringify(formInitialValues)}
          </span>

          <button
            data-testid="btn"
            onClick={() =>
              setFormInitialValues({
                nome: 'teste',
              } as any)
            }
          >
            update
          </button>
        </div>
      );
    };

    render(
      <PropostaContextProvider>
        <Consumer />
      </PropostaContextProvider>,
    );

    expect(screen.getByTestId('value')).toHaveTextContent('{}');

    act(() => {
      screen.getByTestId('btn').click();
    });

    expect(screen.getByTestId('value')).toHaveTextContent(
      JSON.stringify({ nome: 'teste' }),
    );
  });

  it('deve expor setFormInitialValues como função utilizável', () => {
    const Consumer = () => {
      const ctx = useContext(PropostaContext);
      return <div data-testid="type">{typeof ctx.setFormInitialValues}</div>;
    };

    render(
      <PropostaContextProvider>
        <Consumer />
      </PropostaContextProvider>,
    );

    expect(screen.getByTestId('type')).toHaveTextContent('function');
  });
});