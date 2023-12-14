import { FC } from 'react';
import DadosDestaque from '../list/components/dados-destaque';
import { useParams } from 'react-router-dom';
import { Col, Row, Space, Tag, Typography } from 'antd';
import { Colors } from '~/core/styles/colors';
import styled from 'styled-components';
import CardTurmasPublico from '../../components/card-turmas';

const PalavraChave = styled(Tag)`
  font-size: 14px;
  border-radius: 20px;
  padding: 5px 10px 5px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  background-color: ${Colors.Neutral.DARK};
  color: ${Colors.Neutral.WHITE};
`;

const VisualizarFormacao: FC = () => {
  const paramsRoute = useParams();
  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;
  console.log(id);
  return (
    <>
      <DadosDestaque
        srcImagem='https://fia.com.br/wp-content/uploads/2022/06/pod.jpg'
        areaPromotra='CODAE'
        formato='Presencial'
        tipoFormacao='Curso'
        datas='20 ate 27 de Novembro '
        titulo='Rádio e podcast na educação'
      />
      <Row>
        <Typography.Title level={3} style={{ paddingTop: 25 }}>
          Sobre este evento
        </Typography.Title>
      </Row>
      <Space>
        <Typography.Title level={3} style={{ paddingRight: 200 }}>
          Publico-alvo
          <ul style={{ paddingLeft: 20 }}>
            <li>primeiro item</li>
            <li>segundo item</li>
            <li>terceiro item</li>
          </ul>
        </Typography.Title>
        <Typography.Title level={3} style={{ paddingLeft: 200 }}>
          Palavras-chave
          <Row>
            <PalavraChave>Comunicação</PalavraChave>
            <PalavraChave>Educação</PalavraChave>
          </Row>
        </Typography.Title>
      </Space>
      <Row>
        <CardTurmasPublico
          tituloHead='TURMA A'
          titulo='27 ate 29 de Fevereiro'
          descricao='Presencial'
          turmaEncerrada={true}
        />
        <CardTurmasPublico
          tituloHead='TURMA A'
          titulo='27 ate 29 de Fevereiro'
          descricao='Presencial'
          turmaEncerrada={true}
        />
        <CardTurmasPublico
          tituloHead='TURMA A'
          titulo='27 ate 29 de Fevereiro'
          descricao='Presencial'
          turmaEncerrada={false}
        />
        <CardTurmasPublico
          tituloHead='TURMA A'
          titulo='27 ate 29 de Fevereiro'
          descricao='Presencial'
          turmaEncerrada={true}
        />{' '}
        <CardTurmasPublico
          tituloHead='TURMA A'
          titulo='27 ate 29 de Fevereiro'
          descricao='Presencial'
          turmaEncerrada={false}
        />{' '}
        <CardTurmasPublico
          tituloHead='TURMA A'
          titulo='27 ate 29 de Fevereiro'
          descricao='Presencial'
          turmaEncerrada={true}
        />{' '}
        <CardTurmasPublico
          tituloHead='TURMA A'
          titulo='27 ate 29 de Fevereiro'
          descricao='Presencial'
          turmaEncerrada={true}
        />
      </Row>
    </>
  );
};

export default VisualizarFormacao;
