import { CalendarOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { FC } from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { Colors } from '~/core/styles/colors';

const CardTurmasPublico: FC = () => {
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
          color: 'white',
        }}
        bodyStyle={{
          backgroundColor: Colors.BACKGROUND_CONTENT,
          border: 1,
          padding: 0,
          paddingTop: 0,
        }}
        title='Turma C'
      >
        <div style={{ background: '#D32F2F', color: 'white' }}>Incrições Encerradas</div>
        <Meta
          title={
            <p style={{ paddingTop: 15, paddingLeft: 10, paddingRight: 10 }}>
              <CalendarOutlined /> 20 até 27 de Fevereiro
            </p>
          }
          description={
            <p style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 5 }}>
              <IoLocationOutline /> Unip Barra Funda Av. Marques de São Vicente, 3001 - Água Branca,
              São Paulo
            </p>
          }
        />
      </Card>
    </>
  );
};

export default CardTurmasPublico;
