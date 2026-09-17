import React from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import { InscricaoProps } from '../../listagem';
import { getStatusConfig } from '../card-inscricao-mobile';
import ModalEditCargoFuncaoButton from '../modal-edit-cargo-funcao/modal-edit-cargo-funcao-button';

export interface ModalDetalhesInscricaoProps {
  open: boolean;
  record?: (InscricaoProps & { origem?: string; dataInscricao?: string }) | null;
  onClose: () => void;
  onCancelar?: (record: InscricaoProps) => void;
  mostrarCancelar?: boolean;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 1050;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90vh;
  background-color: #ffffff;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  z-index: 1051;
  overflow: hidden;
  animation: slideUp 0.25s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #dadada;
  flex-shrink: 0;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.2;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #42474a;
  font-size: 20px;
  line-height: 1;

  &:hover,
  &:focus-visible {
    opacity: 0.75;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  -webkit-overflow-scrolling: touch;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StatusBadge = styled.div<{ $color: string; $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 16px;
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  font-size: 12px;
  font-weight: 700;
`;

const FormacaoTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.3;
`;

const FieldItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 12px;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const FieldLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #929494;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FieldValue = styled.div`
  font-size: 14px;
  color: #42474a;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: break-word;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #dadada;
  background-color: #ffffff;
  flex-shrink: 0;
`;

const VoltarButton = styled.button`
  flex: 1;
  height: 40px;
  background-color: #ffffff;
  border: 1px solid #ff9a52;
  border-radius: 8px;
  color: #ff9a52;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(255, 154, 82, 0.08);
  }
`;

const CancelarButton = styled.button`
  flex: 1;
  height: 40px;
  background-color: #ff9a52;
  border: 1px solid #ff9a52;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: #f28a3e;
    border-color: #f28a3e;
  }
`;

export const ModalDetalhesInscricao: React.FC<ModalDetalhesInscricaoProps> = ({
  open,
  record,
  onClose,
  onCancelar,
  mostrarCancelar = true,
}) => {
  if (!open || !record) {
    return null;
  }

  const status = getStatusConfig(record.situacao);

  return (
    <>
      <Overlay onClick={onClose} data-testid='modal-detalhes-overlay' aria-hidden='true' />
      <ModalContainer
        role='dialog'
        aria-modal='true'
        aria-label='Detalhes da inscrição'
        data-testid='modal-detalhes-inscricao'
      >
        <Header>
          <Title>Detalhes da inscrição</Title>
          <CloseButton
            type='button'
            onClick={onClose}
            aria-label='Fechar detalhes'
            data-testid='btn-fechar-detalhes'
          >
            <CloseOutlined style={{ fontSize: 20 }} />
          </CloseButton>
        </Header>

        <Content data-testid='modal-detalhes-content'>
          <StatusWrapper>
            <StatusBadge $color={status.color} $bg={status.bg} data-testid='modal-detalhes-status'>
              {status.icon}
              <span>{status.label}</span>
            </StatusBadge>
          </StatusWrapper>

          <FormacaoTitle>{record.nomeFormacao}</FormacaoTitle>

          <FieldItem>
            <FieldLabel>Código da formação</FieldLabel>
            <FieldValue>{record.codigoFormacao || '-'}</FieldValue>
          </FieldItem>

          {record.dataInscricao && (
            <FieldItem>
              <FieldLabel>Data da inscrição</FieldLabel>
              <FieldValue>{record.dataInscricao}</FieldValue>
            </FieldItem>
          )}

          <FieldItem>
            <FieldLabel>Turma</FieldLabel>
            <FieldValue>{record.nomeTurma || '-'}</FieldValue>
          </FieldItem>

          <FieldItem>
            <FieldLabel>Período de realização</FieldLabel>
            <FieldValue>{record.datas || '-'}</FieldValue>
          </FieldItem>

          <FieldItem>
            <FieldLabel>Cargo/Função</FieldLabel>
            <FieldValue>
              <span>{record.cargoFuncao || '-'}</span>
              {record.cargoFuncao && <ModalEditCargoFuncaoButton record={record} />}
            </FieldValue>
          </FieldItem>

          {record.origem && (
            <FieldItem>
              <FieldLabel>Origem</FieldLabel>
              <FieldValue>{record.origem}</FieldValue>
            </FieldItem>
          )}
        </Content>

        <Footer data-testid='modal-detalhes-footer'>
          <VoltarButton type='button' onClick={onClose} data-testid='btn-voltar-detalhes'>
            Voltar
          </VoltarButton>
          {mostrarCancelar && record.podeCancelar && onCancelar && (
            <CancelarButton
              type='button'
              onClick={() => onCancelar(record)}
              data-testid='btn-cancelar-modal-detalhes'
            >
              Cancelar inscrição
            </CancelarButton>
          )}
        </Footer>
      </ModalContainer>
    </>
  );
};

export default ModalDetalhesInscricao;
