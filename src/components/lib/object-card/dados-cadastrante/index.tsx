import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Modal, Typography } from 'antd';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { InformacoesCadastranteDto } from '~/core/dto/informacoes-cadastrante-dto';
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
interface CardInformacoesCadastranteProps {
  dadosCadastrante: InformacoesCadastranteDto;
}
const CardInformacoesCadastrante: FC<CardInformacoesCadastranteProps> = ({ dadosCadastrante }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const abrirModal = () => {
    setOpenModal(true);
  };
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
            {dadosCadastrante.roteiro.length > 0
              ? dadosCadastrante.roteiro
              : 'Proposta Sem Roteiro'}
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
        >
          <DadosCadastrante>
            <div style={{ borderRight: '2px solid #DADADA', width: '50%' }}>
              <p>{dadosCadastrante.nome}</p>
              <p>E-mail: {dadosCadastrante.email}</p>
              <p>Área promotora: {dadosCadastrante.areaPromotora}</p>
              <p>Tipo de intituição: {dadosCadastrante.tipo}</p>
            </div>
            <div style={{ paddingLeft: '50px' }}>
              <p>Telefone: {dadosCadastrante.telefone}</p>
              <p>E-mail área promotora: {dadosCadastrante.emailAreaPromotora}</p>
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
                Confira o roteiro para elaboração de propostas formativas
              </Button>
            </div>
          </DadosCadastrante>
        </Card>
      </Container>
    </>
  );
};

export default CardInformacoesCadastrante;
