import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { PropostaInformacoesCadastranteDTO } from '~/core/dto/informacoes-cadastrante-dto';
import { Colors } from '~/core/styles/colors';
import { obterDadosCadastrante } from '~/core/services/proposta-service';
const Container = styled.div`
  .ant-card-head {
    min-height: auto;
    padding: 0 0 0 24px;
    height: 35px;
    .ant-card-head-title {
      padding: 0;
    }
  }
  .anticon {
    vertical-align: middle;
  }
  .fa {
    margin: 0 !important;
  }
  .display-block {
    display: block !important;
  }
`;

const DadosCadastrante = styled.div`
  width: 100%;
  height: 100%;
  color: #42474a;
  display: flex;
  align-items: center;

  p {
    margin-bottom: 0;
  }
`;
const CardInformacoesCadastrante: FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dados, setDados] = useState<PropostaInformacoesCadastranteDTO>();
  const abrirModal = () => {
    setOpenModal(true);
  };
  const obterDados = async () => {
    setLoading(true);
    const resposta = await obterDadosCadastrante();
    if (resposta.sucesso) {
      setDados(resposta.dados);
    }
    setLoading(false);
  };

  useEffect(() => {
    obterDados();
  }, []);

  return (
    <>
      {openModal ? (
        <Modal
          open
          title='Roteiro para elaboração das propostas formativas'
          centered
          destroyOnClose
          footer={null}
          onCancel={() => setOpenModal(false)}
        >
          <Typography.Text
            style={{ fontSize: 16, height: 'auto', width: 'auto', textAlign: 'justify' }}
          >
            `Este roteiro tem como finalidade auxiliar na elaboração das propostas formativas no
            âmbito da Rede Municipal de Ensino. O tema é prioritário para o desenvolvimento dos
            programas e projetos da SME? A carga horária apresentada está em acordo com o disposto
            no Edital NTF 2023? A justificativa apresenta diagnóstico da realidade local e/ou
            necessidade de continuidade ou aprofundamento no tema? Há articulação entre objetivos,
            tema, metodologia, conteúdo, forma de abordagem e carga horária? O conteúdo programático
            está alinhado a um ou mais princípios do Edital NTF 2023, com foco na melhoria das
            aprendizagens dos estudantes? A carga horária possibilita a exploração do conteúdo
            apresentado de forma satisfatória, permitindo o aprofundamento na temática? A
            metodologia e quantidade de participantes por turma são adequadas para promover a
            aquisição de saberes pelos cursistas e estão em acordo com o Edital NTF 2023? A proposta
            tem como princípio metodológico o uso da problematização? Os procedimentos metodológicos
            favorecem a relação entre a teoria e a prática profissional? As referências
            bibliográficas atendem ao conteúdo programático? Os objetivos desta formação serão
            atingidos considerando o público-alvo proposto? O corpo docente tem formação ou
            experiência na temática do curso? No caso das formações a distância, a relação entre
            tutores e cursistas no ambiente virtual de aprendizagem permite a mediação
            satisfatória?`
          </Typography.Text>
        </Modal>
      ) : (
        <></>
      )}
      <Container>
        <Card
          style={{ marginTop: 16 }}
          type='inner'
          title='Informações do cadastrante (Estas Informações não serão divulgadas de forma pública)'
          headStyle={{ borderBottomRightRadius: 0 }}
          bodyStyle={{ borderTopRightRadius: 0 }}
          loading={loading}
        >
          <DadosCadastrante>
            <div style={{ borderRight: '2px solid #DADADA', width: '50%' }}>
              <p style={{ fontWeight: 'bold' }}>{dados?.usuarioLogadoNome}</p>
              <p>
                <b>E-mail: </b>
                {dados?.usuarioLogadoEmail}
              </p>
              <p>
                <b>Área promotora: </b>
                {dados?.areaPromotora}
              </p>
              <p>
                <b>Tipo de intituição: </b>
                {dados?.areaPromotoraTipo}
              </p>
            </div>
            <div style={{ paddingLeft: '50px' }}>
              <p>
                <b>Telefone: </b>
                {dados?.areaPromotoraTelefones}
              </p>
              <p>
                <b>E-mail área promotora: </b>
                {dados?.areaPromotoraEmails}
              </p>
              <Button
                onClick={abrirModal}
                icon={<ExclamationCircleOutlined style={{ color: Colors.TOOLTIP }} />}
                ghost
                style={{
                  color: Colors.TEXTTOOLTIP,
                  paddingLeft: '0px',
                  border: 'none',
                  background: 'none',
                }}
                type='text'
              >
                <u>Confira o roteiro para elaboração de propostas formativas</u>
              </Button>
            </div>
          </DadosCadastrante>
        </Card>
      </Container>
    </>
  );
};

export default CardInformacoesCadastrante;
