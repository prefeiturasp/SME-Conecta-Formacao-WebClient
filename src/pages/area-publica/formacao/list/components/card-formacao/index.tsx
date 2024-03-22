import { Button, Card, Col, Row } from 'antd';
import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SAIBA_MAIS } from '~/core/constants/mensagens';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { ImgFormacao } from '../img-formacao';
import { TagTipoFormacaoFormato, TextAreaPromotora, TextPeriodo, TextTitulo } from './styles';

type CardFormacaoProps = {
  formacao: FormacaoDTO;
};

export const CardFormacao: React.FC<CardFormacaoProps> = ({ formacao }) => {
  const navigate = useNavigate();

  const abrirFormacao = () =>
    navigate(`${ROUTES.AREA_PUBLICA}/visualizar/${formacao.id}`, {
      replace: true,
      state: { location: formacao },
    });
  return (
    <Card
      cover={
        <ImgFormacao url={formacao.imagemUrl} inscricaoEncerrada={formacao.inscricaoEncerrada} />
      }
    >
      <Col xs={24}>
        <Row wrap={false} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Row>
            <Col xs={24} style={{ maxHeight: 104, overflow: 'auto' }}>
              <TextPeriodo>Período de realização: {formacao.periodo}</TextPeriodo>
            </Col>

            <Col xs={24} style={{ maxHeight: 104, overflow: 'auto' }}>
              <TextPeriodo>Período de inscrição: {formacao.periodoInscricao}</TextPeriodo>
            </Col>

            <Col xs={24} style={{ maxHeight: 104, overflow: 'auto' }}>
              <TextTitulo>{formacao.titulo}</TextTitulo>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col xs={24} style={{ maxHeight: 104, overflow: 'auto' }}>
              <TextAreaPromotora>Área promotora: {formacao.areaPromotora}</TextAreaPromotora>
            </Col>

            <Col xs={24}>
              <Row gutter={[10, 10]} wrap={false}>
                <Col>
                  <TagTipoFormacaoFormato icon={<FaGraduationCap size={16} />}>
                    {formacao.tipoFormacaoDescricao}
                  </TagTipoFormacaoFormato>
                </Col>
                <Col>
                  <TagTipoFormacaoFormato icon={<FaMapMarkerAlt size={16} />}>
                    {formacao.formatoDescricao}
                  </TagTipoFormacaoFormato>
                </Col>
              </Row>
            </Col>
            <Col xs={24}>
              <Button type='primary' shape='round' size='large' block onClick={abrirFormacao}>
                {SAIBA_MAIS}
              </Button>
            </Col>
          </Row>
        </Row>
      </Col>
    </Card>
  );
};
