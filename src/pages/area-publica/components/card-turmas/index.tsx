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
  titulo: string;
  datas: string[];
  turmaEncerrada: boolean;
  local: string;
};

const CardTurmasPublico: FC<CardTurmasPublicoProps> = ({
  titulo,
  datas,
  turmaEncerrada,
  local,
}) => {
  return (
    <Card
      hoverable
      style={cardStyle}
      headStyle={headStyle}
      bodyStyle={bodyStyle}
      title={<p style={tituloHeadStyleBorder}>{titulo}</p>}
    >
      {turmaEncerrada ? (
        <div style={turmaEncerradaStyle}>
          <div style={turmaEncerradaStyleBackground}>{INSCRICAO_ENCERRADA}</div>
        </div>
      ) : (
        <></>
      )}
      <Meta
        title={datas.map((r) => (
          <>
            <p style={titleStyle}>
              <CalendarOutlined /> {r}
            </p>
          </>
        ))}
        description={
          local && (
            <p style={descriptionStyle}>
              <IoLocationOutline /> {local}
            </p>
          )
        }
      />
    </Card>
  );
};

export default CardTurmasPublico;
