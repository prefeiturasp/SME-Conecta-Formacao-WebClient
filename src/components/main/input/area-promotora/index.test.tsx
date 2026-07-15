/**
 * @jest-environment jsdom
 */

import { render, waitFor } from '@testing-library/react';

import SelectAreaPromotora from './index';

import {
  obterAreaPromotoraLista,
  obterUsuarioRedeParceria,
} from '../../../../core/services/area-promotora-service';

import { obterAreaPromotoraPublico } from '../../../../core/services/area-publica-service';


jest.mock('~/core/services/area-promotora-service');

jest.mock('~/core/services/area-publica-service');


const setFieldValueMock = jest.fn();


jest.mock('antd', () => ({
  Form: {
    Item: ({ children }: any) => <>{children}</>,
    useFormInstance: () => ({
      setFieldValue: setFieldValueMock,
    }),
  },
}));


const selectMock = jest.fn();

jest.mock('~/components/lib/inputs/select', () => (props: any) => {
  selectMock(props);

  return (
    <div data-testid="select-area-promotora" />
  );
});


const obterAreaPromotoraListaMock =
  obterAreaPromotoraLista as jest.MockedFunction<
    typeof obterAreaPromotoraLista
  >;


const obterUsuarioRedeParceriaMock =
  obterUsuarioRedeParceria as jest.MockedFunction<
    typeof obterUsuarioRedeParceria
  >;


const obterAreaPromotoraPublicoMock =
  obterAreaPromotoraPublico as jest.MockedFunction<
    typeof obterAreaPromotoraPublico
  >;


describe('SelectAreaPromotora', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('deve buscar áreas promotoras padrão', async () => {

    obterAreaPromotoraListaMock.mockResolvedValue({
      sucesso: true,
      dados: [
        {
          id: 1,
          descricao: 'SME',
        },
        {
          id: 2,
          descricao: 'CODAE',
        },
      ],
    } as any);


    render(<SelectAreaPromotora />);


    await waitFor(() => {

      expect(obterAreaPromotoraListaMock)
        .toHaveBeenCalled();

      expect(selectMock)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            options: [
              {
                label: 'SME',
                value: 1,
              },
              {
                label: 'CODAE',
                value: 2,
              },
            ],
          }),
        );

    });

  });



  it('deve buscar área pública quando areaPublica for verdadeiro', async () => {

    obterAreaPromotoraPublicoMock.mockResolvedValue({
      sucesso: true,
      dados: [],
    } as any);


    render(
      <SelectAreaPromotora areaPublica />
    );


    await waitFor(() => {

      expect(obterAreaPromotoraPublicoMock)
        .toHaveBeenCalled();

    });

  });



  it('deve buscar rede parceria quando usuarioRedeParceria for verdadeiro', async () => {

    obterUsuarioRedeParceriaMock.mockResolvedValue({
      sucesso: true,
      dados: [],
    } as any);


    render(
      <SelectAreaPromotora usuarioRedeParceria />
    );


    await waitFor(() => {

      expect(obterUsuarioRedeParceriaMock)
        .toHaveBeenCalled();

    });

  });



  it('deve preencher automaticamente quando existir apenas uma opção', async () => {

    obterAreaPromotoraListaMock.mockResolvedValue({
      sucesso: true,
      dados: [
        {
          id: 10,
          descricao: 'Área única',
        },
      ],
    } as any);


    render(<SelectAreaPromotora />);


    await waitFor(() => {

      expect(setFieldValueMock)
        .toHaveBeenCalledWith(
          'areaPromotoraId',
          10,
        );


      expect(selectMock)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            disabled: true,
          }),
        );

    });

  });



  it('deve limpar opções quando serviço retornar erro', async () => {

    obterAreaPromotoraListaMock.mockResolvedValue({
      sucesso: false,
      dados: [],
    } as any);


    render(<SelectAreaPromotora />);


    await waitFor(() => {

      expect(selectMock)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            options: [],
          }),
        );

    });

  });



  it('deve repassar propriedades do select', async () => {

    obterAreaPromotoraListaMock.mockResolvedValue({
      sucesso: true,
      dados: [],
    } as any);


    const onChange = jest.fn();


    render(
      <SelectAreaPromotora
        selectProps={{
          onChange,
          disabled: true,
        }}
      />
    );


    expect(selectMock)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          onChange,
          disabled: true,
        }),
      );

  });

});