import { Button, Card, Col, Row } from 'antd';
import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SAIBA_MAIS } from '~/core/constants/mensagens';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { ImgFormacao } from '../img-formacao';
import { Info, Label, TagTipoFormacaoFormato, Titulo, Value, ValueDuplo } from './styles';

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
      cover={<ImgFormacao url={formacao.imagemUrl} inscricaoEncerrada={formacao.inscricaoEncerrada} /> }>

      <Titulo>{formacao.titulo}</Titulo>

      <Info>
        <Label>Período de realização:</Label>
        <Value>{formacao.periodo}</Value>
      </Info>

      <Info>
        <Label>Período de inscrição:</Label>
        <Value>{formacao.periodoInscricao}</Value>
      </Info>
      <Info>
        <Label>Área promotora:</Label>
        <ValueDuplo>
          {formacao.areaPromotora}
        </ValueDuplo>
      </Info>

      <Info>
        <Row gutter={10} wrap={false}>
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
      </Info>


      <Button
        type="primary"
        size="large"
        block
        onClick={abrirFormacao}
        style={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontStyle: 'normal',
          fontSize: '14px',
          lineHeight: '100%',
          letterSpacing: '0%',
        }}
      >
        {SAIBA_MAIS}
      </Button>

    </Card>
  );
};
