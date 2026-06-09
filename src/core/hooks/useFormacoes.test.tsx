/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { renderHook, waitFor } from '@testing-library/react';
import { useFormacoesSimples } from './useFormacoes';
import api from '~/core/services/api';

/* ---------------- MOCKS ---------------- */

jest.mock('~/core/services/api', () => ({
  get: jest.fn(),
}));

jest.mock('query-string', () => ({
  stringify: jest.fn((params) => JSON.stringify(params)),
}));

/* ---------------- TESTS ---------------- */

describe('useFormacoesSimples', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and return data successfully', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        items: [
          {
            id: 1,
            codigoFormacao: 10,
            nomeFormacao: 'Formação Teste',
            turmas: [],
          },
        ],
      },
    });

    const { result } = renderHook(() =>
      useFormacoesSimples({ codigoFormacao: 10 }),
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].nomeFormacao).toBe('Formação Teste');

    expect(api.get).toHaveBeenCalledWith(
      'v1/Inscricao/formacao-turmas',
      expect.objectContaining({
        headers: {
          numeroPagina: 1,
          numeroRegistros: 999999,
        },
        params: { codigoFormacao: 10 },
      }),
    );
  });

  it('should handle API error with custom message', async () => {
    (api.get as jest.Mock).mockRejectedValue({
      response: {
        data: {
          mensagens: ['Erro 1', 'Erro 2'],
        },
      },
    });

    const { result } = renderHook(() =>
      useFormacoesSimples({ nomeFormacao: 'abc' }),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.erro).toBe('Erro 1, Erro 2');
    expect(result.current.data).toEqual([]);
  });

  it('should return default error message when API fails without response', async () => {
    (api.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useFormacoesSimples({}));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.erro).toBe('Erro ao carregar formações');
  });

  it('should refetch when filters change', async () => {
    (api.get as jest.Mock).mockResolvedValue({
      data: { items: [] },
    });

    const { rerender } = renderHook(
      ({ filters }) => useFormacoesSimples(filters),
      {
        initialProps: {
          filters: { codigoFormacao: 1 },
        },
      },
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(1);
    });

    rerender({
      filters: { codigoFormacao: 2 },
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2);
    });
  });
});