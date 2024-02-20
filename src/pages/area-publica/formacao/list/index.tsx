import { Form, List } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { PaginationConfig } from 'antd/es/pagination';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FiltroFormacaoDTO } from '~/core/dto/filtro-formacao-dto';
import { FiltroFormacaoFormDTO } from '~/core/dto/filtro-formacao-form-dto';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { obterFormacaoPaginada } from '~/core/services/area-publica-service';
import { scrollNoInicio } from '~/core/utils/functions';
import { CardFiltroFormacao } from './components/card-filtro-formacao';
import { CardFormacao } from './components/card-formacao';
import { DivTitulo, TextTitulo } from './styles';

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
    const [dataInicial, dataFinal] = (values?.data ?? []).map((data) =>
      dayjs(data).format('YYYY-MM-DD'),
    );

    const filtro: FiltroFormacaoDTO = {
      areasPromotorasIds: values.areasPromotorasIds,
      dataInicial,
      dataFinal,
      formatosIds: values.formatosIds,
      palavrasChavesIds: values.palavrasChavesIds,
      publicosAlvosIds: values.publicosAlvosIds,
      titulo: values.titulo,
    };

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

  useEffect(() => {
    scrollNoInicio();
  }, [listParams.pagination?.current, !listParams.pagination?.pageSize]);

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
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
        pagination={{ ...listParams.pagination, onChange: onListChange }}
        dataSource={formacoes}
        loading={loading}
        locale={{ emptyText: 'Nenhuma formação encontrada' }}
        renderItem={(item) => (
          <List.Item>
            <CardFormacao formacao={item} />
          </List.Item>
        )}
      />
    </>
  );
};
