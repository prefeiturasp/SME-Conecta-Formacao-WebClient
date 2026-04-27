import { Button, Col, Form, Input, Row, Select, Spin, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import Empty from '~/components/main/empty';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { AreaPromotoraTipoDTO } from '~/core/dto/area-promotora-tipo-dto';
import { CadastroAreaPromotoraDTO } from '~/core/dto/cadastro-area-promotora-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { obterTiposAreaPromotora } from '~/core/services/area-promotora-service';
import { CadastroCoordenadoriaDTO, CoordenadoriaFiltroDTO, listarCoordenadorias } from '~/core/services/coordenadoria-service';
import { onClickVoltar } from '~/core/utils/form';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';

const ListAreaPromotora: React.FC = () => {
  const { Option } = Select;
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ nome: '', tipo: 0 });

  const [listaTipos, setListaTipos] = useState<AreaPromotoraTipoDTO[]>([]);

  const [listaCoordenadorias, setListaCoordenadorias] = useState<CadastroCoordenadoriaDTO[]>([]);
  const [loadingCoordenadorias, setLoadingCoordenadorias] = useState(false);
  const [paginaCoordenadoria, setPaginaCoordenadoria] = useState(1);
  const [temMaisCoordenadorias, setTemMaisCoordenadorias] = useState(true);
  const [termoBuscaCoordenadoria, setTermoBuscaCoordenadoria] = useState('');
  const timeoutBuscaRef = useRef<NodeJS.Timeout | null>(null);

  const permissao = obterPermissaoPorMenu(MenuEnum.AreaPromotora);

  const columns: ColumnsType<CadastroAreaPromotoraDTO> = [
    {
      key: 'nome',
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      key: 'tipo',
      title: 'Tipo',
      dataIndex: 'tipo',
    },
    {
      key: 'coordenadoria',
      title: 'Coordenadoria',
      dataIndex: 'nomeCoordenadoria',
    }
  ];

  const obterTipos = useCallback(async () => {
    const resposta = await obterTiposAreaPromotora();
    if (resposta.sucesso) {
      setListaTipos(resposta.dados);
    }
  }, []);

  useEffect(() => {
    obterTipos();
  }, [obterTipos]);

  const carregarCoordenadorias = async (pagina: number, termo: string, limparListaAtual: boolean = false) => {
    setLoadingCoordenadorias(true);
    
    const filtros: CoordenadoriaFiltroDTO = { 
        nome: termo, 
        sigla: '', 
        numeroPagina: pagina, 
        numeroRegistros: 15
    };
    
    const resposta = await listarCoordenadorias(filtros);
    
    if (resposta.sucesso && resposta.dados) {
      const novosItens = resposta.dados.items || [];
      const totalPaginas = resposta.dados.totalPaginas || 1;

      setListaCoordenadorias(prev => limparListaAtual ? novosItens : [...prev, ...novosItens]);
      setTemMaisCoordenadorias(pagina < totalPaginas);
      setPaginaCoordenadoria(pagina);
    }
    
    setLoadingCoordenadorias(false);
  };

  useEffect(() => {
    carregarCoordenadorias(1, '');
  }, []);

  const handleSearchCoordenadoria = (value: string) => {
    setTermoBuscaCoordenadoria(value);
    
    if (timeoutBuscaRef.current) clearTimeout(timeoutBuscaRef.current);
    
    timeoutBuscaRef.current = setTimeout(() => {
      carregarCoordenadorias(1, value, true);
    }, 600);
  };

  const handleScrollCoordenadoria = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight + 5 >= target.scrollHeight) {
      if (temMaisCoordenadorias && !loadingCoordenadorias) {
        carregarCoordenadorias(paginaCoordenadoria + 1, termoBuscaCoordenadoria, false);
      }
    }
  };

  const onClickNovo = () => navigate(ROUTES.AREA_PROMOTORA_NOVO);

  const onClickEditar = (id: number) =>
    navigate(`${ROUTES.AREA_PROMOTORA}/editar/${id}`, { replace: true });

  return (
    <Col>
      <HeaderPage title='Área Promotora'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar
                onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
                id={CF_BUTTON_VOLTAR}
              />
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CF_BUTTON_NOVO}
                style={{ fontWeight: 700 }}
                onClick={() => onClickNovo()}
                disabled={!permissao?.podeIncluir}
              >
                Novo
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <Form layout="vertical" autoComplete="off">
        <CardContent>
          <Row gutter={[8, 16]}>
            <Col span={24}>
                <Typography.Title level={4} style={{ marginBottom: 0 }}>
                    Refine sua busca
                </Typography.Title>
            </Col>
            <Col span={24}>
                <Typography.Paragraph style={{ marginBottom: 0, color: "#42474A" }}>
                    Utilize o filtro para localizar as areas promotoras
                </Typography.Paragraph>
            </Col>    
            <Col span={8}>
            <Form.Item label={<b>Nome</b>} style={{ marginBottom: 0 }}>
              <Input
                type='text'
                maxLength={100}
                placeholder='Digite o nome'
                onChange={(e: any) =>
                  setFilters((oldState) => {
                    return { ...oldState, nome: e.target.value };
                  })
                }
              />
            </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<b>Tipo</b>} style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder='Selecione o Tipo'
                  notFoundContent={<Empty />}
                  onChange={(e: any) =>
                    setFilters((oldState) => {
                      return { ...oldState, tipo: e };
                    })
                  }
                >
                  {listaTipos?.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.nome}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={<b>Coordenadoria</b>} style={{ marginBottom: 0 }}>
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder='Selecione a Coordenadoria'
                  filterOption={false}
                  notFoundContent={loadingCoordenadorias ? <Spin size="small" /> : <Empty />}
                  onSearch={handleSearchCoordenadoria}
                  onPopupScroll={handleScrollCoordenadoria}
                  loading={loadingCoordenadorias}
                  onChange={(e: any) => setFilters(prev => ({ ...prev, coordenadoriaId: e }))}
                >
                  {listaCoordenadorias?.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.nome}
                    </Option>
                  ))}
                  {loadingCoordenadorias && paginaCoordenadoria > 1 && (
                    <Option disabled key="loading-more" className="text-center">
                      <Spin size="small" /> Carregando...
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <DataTable
                filters={filters}
                columns={columns}
                url='v1/AreaPromotora'
                alterarRealizouFiltro={() => {
                  () => {
                    ('');
                  };
                }}
                onRow={(row) => ({
                  onClick: () => {
                    onClickEditar(row.id);
                  },
                })}
              />
            </Col>
          </Row>
        </CardContent>
      </Form>
    </Col>
  );
};
export default ListAreaPromotora;
