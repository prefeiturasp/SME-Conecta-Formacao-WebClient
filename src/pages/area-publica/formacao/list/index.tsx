import { Form, List } from 'antd';
import React, { useEffect, useState } from 'react';
import { CardFormacao } from './components/card-formacao';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { DivTitulo, TextTitulo } from './styles';
import { CardFiltroFormacao } from './components/card-filtro-formacao';
import { useForm } from 'antd/es/form/Form';
import { obterFormacaoPaginada } from '~/core/services/area-publica-service';
import { FiltroFormacaoDTO } from '~/core/dto/filtro-formacao-dto';
import { PaginationConfig } from 'antd/es/pagination';
import { FiltroFormacaoFormDTO } from '~/core/dto/filtro-formacao-form-dto';

type ListParams = {
  pagination?: PaginationConfig;
};

export const ListFormacao: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formacoes, setFormacoes] = useState<FormacaoDTO[]>([]);

  const [filtroFormacao, setFiltroFormacao] = useState<FiltroFormacaoDTO>({});
  const [listParams, setListParams] = useState<ListParams>({
    pagination: {
      current: 1,
      pageSize: 12,
      showSizeChanger: true,
      position: 'bottom',
      align: 'center',
      locale: { items_per_page: '' },
      disabled: false,
      pageSizeOptions: [12, 20, 52, 104],
    },
  });

  const [formAreaPublica] = useForm();

  const buscarInformacoes = (values: FiltroFormacaoFormDTO) => {
    const filtro: FiltroFormacaoDTO = { ...values };

    filtro.dataInicial = values?.data?.[0];
    filtro.dataFinal = values?.data?.[1];

    setFiltroFormacao(filtro);
  };

  const carregarDados = (listParams: ListParams, filtroFormacao: FiltroFormacaoDTO) => {
    const numeroPagina = listParams.pagination?.current;
    const numeroRegistros = listParams.pagination?.pageSize;

    setLoading(true);
    obterFormacaoPaginada(filtroFormacao, numeroPagina, numeroRegistros)
      .then((response) => {
        if (response.sucesso) {
          setFormacoes(response.dados.items);
          setListParams({
            ...listParams,
            pagination: {
              ...listParams.pagination,
              total: response.dados.totalRegistros,
            },
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarDados(listParams, filtroFormacao);
  }, [filtroFormacao]);

  const onListChange = (current: number, pageSize: number) => {
    const newListParams = {
      ...listParams,
      pagination: {
        ...listParams.pagination,
        current,
        pageSize,
      },
    };

    carregarDados(newListParams, filtroFormacao);
  };

  return (
    <>
      <Form
        form={formAreaPublica}
        layout='vertical'
        autoComplete='off'
        style={{ width: '100%' }}
        onFinish={buscarInformacoes}
      >
        <CardFiltroFormacao />
      </Form>

      <DivTitulo>
        <TextTitulo>Próximas formações</TextTitulo>
      </DivTitulo>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        pagination={{ ...listParams.pagination, onChange: onListChange }}
        dataSource={formacoes}
        loading={loading}
        locale={{ emptyText: 'Nenhuma formação encontrada' }}
        renderItem={(item) => (
          <List.Item>
            <CardFormacao formacao={item}></CardFormacao>
          </List.Item>
        )}
      />
    </>
  );
};
