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
    >
      <Row>
        <Col>
          <TextPeriodo>{formacao.periodo}</TextPeriodo>
        </Col>
      </Row>
      <Row>
        <Col>
          <TextTitulo>{formacao.titulo}</TextTitulo>
        </Col>
      </Row>
      <Row>
        <Col>
          <TextAreaPromotora>Área promotora: {formacao.areaPromotora}</TextAreaPromotora>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col>
          <TagTipoFormacaoFormato icon={<FaGraduationCap />}>
            {formacao.tipoFormacaoDescricao}
          </TagTipoFormacaoFormato>
        </Col>
        <Col>
          <TagTipoFormacaoFormato icon={<FaMapMarkerAlt />}>
            {formacao.formatoDescricao}
          </TagTipoFormacaoFormato>
        </Col>
      </Row>
      <Button type='primary' shape='round' size='large' block onClick={abrirFormacao}>
        Saiba mais
      </Button>
    </Card>
  );
};
