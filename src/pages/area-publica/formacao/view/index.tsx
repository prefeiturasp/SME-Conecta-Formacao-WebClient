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
const ListaPublicAlvo = styled.ul`
  padding-left: 27px;
`;
const listaTurmas = [
  {
    tituloHead: 'TURMA A',
    titulo: '27 ate 79 de Fevereiro',
    descricao: 'Presencial',
    turmaEncerrada: true,
  },
  {
    tituloHead: 'TURMA V',
    titulo: '27 ate 29 de Fevereiro',
    descricao: 'Presencial',
    turmaEncerrada: false,
  },
  {
    tituloHead: 'TURMA A',
    titulo: '27 ate 29 de Fevereiro',
    descricao: 'Presencial',
    turmaEncerrada: true,
  },
  {
    tituloHead: 'TURMA B',
    titulo: '27 ate 59 de Fevereiro',
    descricao: 'Presencial',
    turmaEncerrada: false,
  },
  {
    tituloHead: 'TURMA Z',
    titulo: '27 ate 29 de Março',
    descricao: 'Presencial',
    turmaEncerrada: true,
  },
  {
    tituloHead: 'TURMA C',
    titulo: '27 ate 29 de Abril',
    descricao: 'Presencial',
    turmaEncerrada: true,
  },
  {
    tituloHead: 'TURMA XYZ',
    titulo: '27 ate 29 de Fevereiro',
    descricao: 'Presencial',
    turmaEncerrada: true,
  },
  {
    tituloHead: 'TURMA A',
    titulo: '27 ate 29 de Fevereiro',
    descricao: 'Presencial',
    turmaEncerrada: true,
  },
];
const palavrasChaves = ['Comunicação', 'Educação', 'Educação', 'Educação'];
const publicosAlvos = [
  'Anal.Inf. Cult. e Desp. - Ed.Física',
  'Coord. Esportes e Lazer',
  'Prof. Ens. Fund. 2 e Med. - Ed.Física',
];
const sobreOEvento = `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
of classical Latin literature from 45 BC, making it over 2000 years old. Richard
McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the
more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the
cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum
comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of
Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of
ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum
dolor sit amet.., comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum
used since the 1500s is reproduced below for those interested. Sections 1.10.32 and
1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact
original form, accompanied by English versions from the 1914 translation by H. Rackham.`;

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
        <Typography.Text>{sobreOEvento} </Typography.Text>
      </Row>
      <Space style={{ paddingTop: 20 }}>
        <Typography.Title level={4} style={{ paddingRight: 80 }}>
          Publico-alvo
          <Col>
            <ListaPublicAlvo>
              {publicosAlvos.map((publico, i) => {
                return (
                  <li key={i}>
                    <Typography.Text>{publico}</Typography.Text>
                  </li>
                );
              })}
            </ListaPublicAlvo>
          </Col>
        </Typography.Title>
        <Typography.Title level={4} style={{ paddingLeft: 180 }}>
          Palavras-chave
          <Row>
            {palavrasChaves.map((palavra) => {
              return <PalavraChave key={palavra}>{palavra}</PalavraChave>;
            })}
          </Row>
        </Typography.Title>
      </Space>
      <Row>
        {listaTurmas.map((turma, i) => {
          return (
            <CardTurmasPublico
              key={i}
              tituloHead={turma.tituloHead}
              titulo={turma.titulo}
              descricao={turma.descricao}
              turmaEncerrada={turma.turmaEncerrada}
            />
          );
        })}
      </Row>
    </>
  );
};

export default VisualizarFormacao;
