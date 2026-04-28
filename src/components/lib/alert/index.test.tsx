/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Alert, { TypeAlertEnum } from './index';

jest.mock('~/core/styles/colors', () => ({
  Colors: {
    Neutral: { DARK: '#42474A' },
    SystemSME: { ConectaFormacao: { PRIMARY: '#003d92' } },
  },
}));

describe('Alert', () => {
  it('renders message', () => {
    render(<Alert message='Atenção ao formulário' />);
    expect(screen.getByText('Atenção ao formulário')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<Alert message='Erro' description='Detalhes do erro' />);
    expect(screen.getByText('Detalhes do erro')).toBeInTheDocument();
  });

  it('renders warning type', () => {
    render(<Alert message='Aviso' type='warning' />);
    expect(screen.getByText('Aviso')).toBeInTheDocument();
  });

  it('renders error type', () => {
    render(<Alert message='Erro' type='error' />);
    expect(screen.getByText('Erro')).toBeInTheDocument();
  });

  it('renders success type', () => {
    render(<Alert message='Sucesso' type='success' />);
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
  });

  it('renders info type', () => {
    render(<Alert message='Informação' type='info' />);
    expect(screen.getByText('Informação')).toBeInTheDocument();
  });

  describe('TypeAlertEnum', () => {
    it('Info = "info"', () => expect(TypeAlertEnum.Info).toBe('info'));
    it('Success = "success"', () => expect(TypeAlertEnum.Success).toBe('success'));
    it('Error = "error"', () => expect(TypeAlertEnum.Error).toBe('error'));
    it('Warning = "warning"', () => expect(TypeAlertEnum.Warning).toBe('warning'));
  });
});
