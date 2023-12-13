import { CalendarOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { FC } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { INSCRICAO_ENCERRADA } from '~/core/constants/mensagens';
import {
  bodyStyle,
  cardStyle,
  descriptionStyle,
  headStyle,
  titleStyle,
  tituloHeadStyleBorder,
  turmaEncerradaStyle,
  turmaEncerradaStyleBackground,
} from './styles';
type CardTurmasPublicoProps = {
  tituloHead: string;
  titulo: string;
  turmaEncerrada: boolean;
  descricao: string;
};

const CardTurmasPublico: FC<CardTurmasPublicoProps> = ({
  tituloHead,
  titulo,
  turmaEncerrada,
  descricao,
}) => {
  return (
    <>
      <Card
        hoverable
        style={cardStyle}
        headStyle={headStyle}
        bodyStyle={bodyStyle}
        title={<p style={tituloHeadStyleBorder}>{tituloHead}</p>}
      >
        {turmaEncerrada ? (
          <div style={turmaEncerradaStyle}>
            <div style={turmaEncerradaStyleBackground}>{INSCRICAO_ENCERRADA}</div>
          </div>
        ) : (
          <></>
        )}
        <Meta
          title={
            <p style={titleStyle}>
              <CalendarOutlined /> {titulo}
            </p>
          }
          description={
            <p style={descriptionStyle}>
              <IoLocationOutline /> {descricao}
            </p>
          }
        />
      </Card>
    </>
  );
};

export default CardTurmasPublico;
