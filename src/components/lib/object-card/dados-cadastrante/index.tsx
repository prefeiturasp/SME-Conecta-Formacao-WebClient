import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PropostaInformacoesCadastranteDTO } from '~/core/dto/informacoes-cadastrante-dto';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { AreaPromotoraTipoEnum } from '~/core/enum/area-promotora-tipo';
import {
  obterDadosCadastrante,
  obterRoteiroPropostaFormativa,
} from '~/core/services/proposta-service';
import { Colors } from '~/core/styles/colors';
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

type CardInformacoesCadastranteProps = {
  setTipoInstituicao?: React.Dispatch<React.SetStateAction<AreaPromotoraTipoEnum | undefined>>;
};
const CardInformacoesCadastrante: FC<CardInformacoesCadastranteProps> = ({
  setTipoInstituicao,
}) => {
  const paramsRoute = useParams();
  const propostaId = Number(paramsRoute.id);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dados, setDados] = useState<PropostaInformacoesCadastranteDTO>();
  const [roteiro, setRoteiro] = useState<RetornoListagemDTO>();

  const abrirModal = async () => {
    await obterRoteiro();
    setOpenModal(true);
  };

  const obterDados = async (propostaId?: number) => {
    setLoading(true);
    const resposta = await obterDadosCadastrante(propostaId);
    if (resposta.sucesso) {
      setDados(resposta.dados);
      setTipoInstituicao && setTipoInstituicao(resposta.dados.areaPromotoraTipoId);
    }
    setLoading(false);
  };

  const obterRoteiro = async () => {
    if (!roteiro) {
      setLoading(true);

      const resposta = await obterRoteiroPropostaFormativa();
      if (resposta.sucesso) {
        setRoteiro(resposta.dados);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (propostaId) {
      obterDados(propostaId);
    } else {
      obterDados();
    }
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
          width={'auto'}
        >
          <Typography
            style={{ fontSize: 16, height: 'auto', width: 'auto', textAlign: 'justify' }}
            dangerouslySetInnerHTML={{ __html: roteiro?.descricao || '' }}
          />
        </Modal>
      ) : (
        <></>
      )}
      <Container>
        <Card
          style={{ marginBottom: 16 }}
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
                icon={<ExclamationCircleOutlined style={{ color: Colors.Suporte.Primary.INFO }} />}
                ghost
                style={{
                  color: Colors.Neutral.DARK,
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
