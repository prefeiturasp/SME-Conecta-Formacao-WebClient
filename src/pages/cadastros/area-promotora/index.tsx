import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_NOVO, CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';

const AreaPromotora: React.FC = () => {
  const navigate = useNavigate();
  const onClickVoltar = () => navigate(ROUTES.PRINCIPAL);
  const onClickNovo = () => navigate(ROUTES.AREA_PROMOTORA_NOVO);
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
      <CardContent>
        <Row gutter={[8, 16]}>
          <Col span={12}>
            <Input type='text' placeholder='Nome' prefix={<SearchOutlined />} />
          </Col>
          <Col span={12}>
            <Input type='text' placeholder='Tipo' prefix={<SearchOutlined />} />
          </Col>
        </Row>
      </CardContent>
    </Col>
  );
};
export default AreaPromotora;
