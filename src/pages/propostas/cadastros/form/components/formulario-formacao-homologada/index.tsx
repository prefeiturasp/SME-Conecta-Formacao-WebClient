import React from 'react';

import { Col, Row } from 'antd';

import { SelectPerfilGestao } from './components/select-perfil-gestao';

const FormularioFormacaoHomologada: React.FC = () => {
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={24} md={12} lg={16} xl={18}>
        <SelectPerfilGestao />
      </Col>
    </Row>
  );
};

export default FormularioFormacaoHomologada;
