import { Form, List, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { PaginationConfig } from 'antd/es/pagination';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BreadcrumbConecta from '~/components/main/breadcrumb';
import VoltarAoTopoButton from '~/components/main/button/voltar-topo';
import { FiltroFormacaoDTO } from '~/core/dto/filtro-formacao-dto';
import { FiltroFormacaoFormDTO } from '~/core/dto/filtro-formacao-form-dto';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { obterFormacaoPaginada } from '~/core/services/area-publica-service';
import { scrollNoInicio } from '~/core/utils/functions';
import { CardFiltroFormacao } from './components/card-filtro-formacao';
import { CardFormacao } from './components/card-formacao';
import { EmptyCard } from './components/empty-card';
import { ListaFormacoesMobile } from './components/lista-formacoes-mobile';

const { Title, Text } = Typography;

const BreadcrumbWrapper = styled.div`
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const DesktopListWrapper = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

const MobileListWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex !important;
    flex-direction: column;
    width: 100%;
  }
`;

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
      areasPromotorasIds: values?.areasPromotorasIds,
      dataInicial,
      dataFinal,
      formatosIds: values?.formatosIds,
      palavrasChavesIds: values?.palavrasChavesIds,
      publicosAlvosIds: values?.publicosAlvosIds,
      titulo: values?.titulo,
      codigoFormacao: values?.codigoFormacao,
      codigoHomologacao: values?.codigoHomologacao,
    };

    setFiltroFormacao(filtro);
  };

  const limparFiltros = () => {
    formAreaPublica.resetFields();
    setFiltroFormacao({});
  };

  const carregarDados = (listParams: ListParams, filtroFormacao: FiltroFormacaoDTO) => {
    if (globalThis.window !== undefined && globalThis.window.innerWidth <= 768) {
      return;
    }

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

  useEffect(() => {
    const handleResize = () => {
      if (globalThis.window !== undefined && globalThis.window.innerWidth > 768 && formacoes.length === 0) {
        carregarDados(listParams, filtroFormacao);
      }
    };
    globalThis.window.addEventListener('resize', handleResize);
    return () => globalThis.window.removeEventListener('resize', handleResize);
  }, [formacoes.length, listParams, filtroFormacao]);

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
      <BreadcrumbWrapper>
        <BreadcrumbConecta
          menu='Minhas inscrições'
          mainPage='Minhas inscrições'
          urlMainPage={ROUTES.MINHAS_INSCRICOES}
          title='Explorar formações'
        />
      </BreadcrumbWrapper>

      <Form
        form={formAreaPublica}
        layout='vertical'
        autoComplete='off'
        style={{ width: '100%' }}
        onFinish={buscarInformacoes}
      >
        <CardFiltroFormacao form={formAreaPublica} onLimpar={limparFiltros} />
      </Form>

      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <Title
          level={3}
          style={{
            marginBottom: 8,
            fontFamily: 'Roboto',
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '1.2',
            color: '#42474A',
          }}
        >
          Próximas formações
        </Title>
        <Text
          type='secondary'
          style={{
            color: '#58616A',
            fontFamily: 'Roboto',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '1.4',
          }}
        >
          Estas são as próximas formações planejadas. Antes de se inscrever, confira as restrições que podem haver para o seu perfil.
        </Text>
      </div>

      <DesktopListWrapper>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
          pagination={{ ...listParams.pagination, onChange: onListChange }}
          dataSource={formacoes}
          loading={loading}
          locale={{ emptyText: <EmptyCard /> }}
          renderItem={(item) => (
            <List.Item>
              <CardFormacao formacao={item} />
            </List.Item>
          )}
        />
      </DesktopListWrapper>

      <MobileListWrapper>
        <ListaFormacoesMobile filtroFormacao={filtroFormacao} />
      </MobileListWrapper>

      <VoltarAoTopoButton />
    </>
  );
};

