/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import CheckboxAcaoInformatica from './index';
import { ACAO_INFORMATIVA_NAO_ACEITA } from '~/core/constants/mensagens';
import { obterComunicadoAcaoInformatica } from '~/core/services/proposta-service';

const mockGetFieldValue = jest.fn();
const mockSetFieldValue = jest.fn();
const mockUseParams = jest.fn();
let ultimoPropsFormItem: any;

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  useParams: () => mockUseParams(),
}));

jest.mock('~/core/services/proposta-service', () => ({
  obterComunicadoAcaoInformatica: jest.fn(),
}));

jest.mock('antd', () => ({
  Checkbox: ({ children }: any) => <label>{children}</label>,
  Form: {
    useFormInstance: () => ({
      getFieldValue: (...args: any[]) => mockGetFieldValue(...args),
      setFieldValue: (...args: any[]) => mockSetFieldValue(...args),
    }),
    Item: (props: any) => {
      ultimoPropsFormItem = props;
      return <div>{props.children}</div>;
    },
  },
}));

describe('CheckboxAcaoInformatica behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ultimoPropsFormItem = undefined;
    mockUseParams.mockReturnValue({ id: '10' });
    mockGetFieldValue.mockImplementation((field: string) => {
      if (field === 'acaoFormativaTexto') return 'Texto link';
      if (field === 'acaoFormativaLink') return 'http://exemplo';
      return '';
    });
  });

  test('deve preencher campos quando serviço retorna sucesso', async () => {
    (obterComunicadoAcaoInformatica as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        descricao: 'Comunicado Ação Formativa',
        url: 'https://sme.prefeitura.sp.gov.br',
      },
    });

    render(<CheckboxAcaoInformatica />);

    await waitFor(() => {
      expect(obterComunicadoAcaoInformatica).toHaveBeenCalledWith('10');
      expect(mockSetFieldValue).toHaveBeenCalledWith('acaoFormativaTexto', 'Comunicado Ação Formativa');
      expect(mockSetFieldValue).toHaveBeenCalledWith('acaoFormativaLink', 'https://sme.prefeitura.sp.gov.br');
    });
  });

  test('deve limpar campos quando serviço falha', async () => {
    (obterComunicadoAcaoInformatica as jest.Mock).mockResolvedValue({
      sucesso: false,
    });

    render(<CheckboxAcaoInformatica />);

    await waitFor(() => {
      expect(mockSetFieldValue).toHaveBeenCalledWith('acaoFormativaTexto', '');
      expect(mockSetFieldValue).toHaveBeenCalledWith('acaoFormativaLink', '');
    });
  });

  test('deve limpar campos quando rota não tem propostaId', async () => {
    mockUseParams.mockReturnValue({});

    render(<CheckboxAcaoInformatica />);

    await waitFor(() => {
      expect(obterComunicadoAcaoInformatica).not.toHaveBeenCalled();
      expect(mockSetFieldValue).toHaveBeenCalledWith('acaoFormativaTexto', '');
      expect(mockSetFieldValue).toHaveBeenCalledWith('acaoFormativaLink', '');
    });
  });

  test('validator deve resolver quando valor for true', async () => {
    (obterComunicadoAcaoInformatica as jest.Mock).mockResolvedValue({ sucesso: false });

    render(<CheckboxAcaoInformatica />);

    await expect(ultimoPropsFormItem.rules[0].validator({}, true)).resolves.toBeUndefined();
  });

  test('validator deve rejeitar quando valor for false', async () => {
    (obterComunicadoAcaoInformatica as jest.Mock).mockResolvedValue({ sucesso: false });

    render(<CheckboxAcaoInformatica />);

    await expect(ultimoPropsFormItem.rules[0].validator({}, false)).rejects.toBe(
      ACAO_INFORMATIVA_NAO_ACEITA,
    );
  });
});
