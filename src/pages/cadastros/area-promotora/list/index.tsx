import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useState } from 'react';
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
import { onClickVoltar } from '~/core/utils/form';
import { obterPermissaoPorMenu } from '~/core/utils/perfil';

const ListAreaPromotora: React.FC = () => {
  const { Option } = Select;
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ nome: '', tipo: 0 });

  const [listaTipos, setListaTipos] = useState<AreaPromotoraTipoDTO[]>();

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
      <CardContent>
        <Row gutter={[8, 16]}>
          <Col span={12}>
            <Input
              type='text'
              maxLength={100}
              placeholder='Nome'
              prefix={<SearchOutlined />}
              onChange={(e: any) =>
                setFilters((oldState) => {
                  return { ...oldState, nome: e.target.value };
                })
              }
            />
          </Col>
          <Col span={12}>
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
    </Col>
  );
};
export default ListAreaPromotora;
