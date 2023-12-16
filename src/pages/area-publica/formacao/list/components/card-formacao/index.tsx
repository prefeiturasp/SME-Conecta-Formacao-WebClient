import React from 'react';
import { Button, Card, Col, Row } from 'antd';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { TagTipoFormacaoFormato, TextAreaPromotora, TextPeriodo, TextTitulo } from './styles';
import { ImgFormacao } from '../img-formacao';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { ROUTES } from '~/core/enum/routes-enum';
import { useNavigate } from 'react-router-dom';

type CardFormacaoProps = {
  formacao: FormacaoDTO;
};

export const CardFormacao: React.FC<CardFormacaoProps> = ({ formacao }) => {
  const navigate = useNavigate();

  const abrirFormacao = () =>
    navigate(`${ROUTES.AREA_PUBLICA}/visualizar/${formacao.id}`, { replace: true });
  return (
    <Card
      cover={
        <ImgFormacao url={formacao.imagemUrl} inscricaoEncerrada={formacao.inscricaoEncerrada} />
      }
      bodyStyle={{ height: '336px' }}
    >
      <Row
        gutter={[10, 10]}
        justify='space-between'
        wrap={false}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <TextPeriodo>{formacao.periodo}</TextPeriodo>
          </Col>

          <Col xs={24} style={{ maxHeight: 104, overflow: 'auto' }}>
            <TextTitulo>{formacao.titulo}</TextTitulo>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
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
              Saiba mais
            </Button>
          </Col>
        </Row>
      </Row>
    </Card>
  );
};
