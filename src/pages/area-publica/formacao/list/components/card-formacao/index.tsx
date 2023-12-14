import React from 'react';
import { Button, Card, Col, Row } from 'antd';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { TagTipoFormacaoFormato, TextAreaPromotora, TextPeriodo, TextTitulo } from './styles';
import { ImgFormacao } from '../img-formacao';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';

type CardFormacaoProps = {
  formacao: FormacaoDTO;
};

export const CardFormacao: React.FC<CardFormacaoProps> = ({ formacao }) => {
  const abrirFormacao = () => {
    alert(formacao.id);
  };
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
        Saiba Mais
      </Button>
    </Card>
  );
};
