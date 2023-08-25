import { Button, Col, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import CardTableCadastros from '../components/card-table';
import { ColumnsType } from 'antd/es/table';

const AreaPromotora: React.FC = () => {
  const navigate = useNavigate();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);
  const onClickNovo = () => navigate(ROUTES.AREA_PROMOTORA_NOVO);

  interface DataType {
    key: string;
    name: string;
    tipo: string;
  }

  const data: DataType[] = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      key: i.toString(),
      name: `Nome ${i}`,
      tipo: `Tipo ${i}`,
    });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
    },
  ];

  return (
    <Col>
      <HeaderPage title='Área Promotora'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar()} id={CF_BUTTON_VOLTAR} />
            </Col>
            <Col>
              <Button
                block
                type='primary'
                htmlType='submit'
                id={CF_BUTTON_NOVO}
                style={{ fontWeight: 700 }}
                onClick={() => onClickNovo()}
              >
                Novo
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>
      <CardTableCadastros dadosTabela={data} colunasTabela={columns} />
    </Col>
  );
};
export default AreaPromotora;
