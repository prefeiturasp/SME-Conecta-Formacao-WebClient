import { CalendarOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import React, { FC } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import styled from 'styled-components';
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

const CardContainer = styled(Card)`
  .ant-card-head-title {
    white-space: wrap;
  }
`;

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
    <CardContainer
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
        title={datas.map((r, i) => (
          <React.Fragment key={i}>
            <p style={titleStyle}>
              <CalendarOutlined /> {r}
            </p>
          </React.Fragment>
        ))}
        description={
          local && (
            <p style={descriptionStyle}>
              <div>
                <IoLocationOutline size={24} />
              </div>
              {local}
            </p>
          )
        }
      />
    </CardContainer>
  );
};

export default CardTurmasPublico;
