import { CalendarOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { FC } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { INSCRICAO_ENCERRADA } from '~/core/constants/mensagens';
import { Colors } from '~/core/styles/colors';

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
        style={{
          border: 1,
          width: 230,
          padding: 10,
        }}
        headStyle={{
          backgroundColor: Colors.SystemSME.ConectaFormacao.PRIMARY,
          border: 1,
          fontSize: 22,
          color: Colors.Neutral.WHITE,
          paddingTop: 30,
        }}
        bodyStyle={{
          backgroundColor: Colors.BACKGROUND_CONTENT,
          border: 1,
          padding: 0,
          paddingTop: 0,
        }}
        title={
          <p
            style={{
              border: 'solid',
              borderColor: Colors.Neutral.WHITE,
              padding: 10,
              paddingLeft: 30,
            }}
          >
            {tituloHead}
          </p>
        }
      >
        {turmaEncerrada ? (
          <div
            style={{
              background: Colors.Neutral.RED,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                background: Colors.Neutral.RED,
                color: Colors.Neutral.WHITE,
                fontWeight: 'bolder',
              }}
            >
              {INSCRICAO_ENCERRADA}
            </div>
          </div>
        ) : (
          <></>
        )}
        <Meta
          title={
            <p style={{ paddingTop: 15, paddingLeft: 10, paddingRight: 10 }}>
              <CalendarOutlined /> {titulo}
            </p>
          }
          description={
            <p style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 5 }}>
              <IoLocationOutline /> {descricao}
            </p>
          }
        />
      </Card>
    </>
  );
};

export default CardTurmasPublico;
