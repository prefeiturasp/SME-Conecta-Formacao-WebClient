import React from 'react';
import styled from 'styled-components';
import {
  CalendarOutlined,
  TeamOutlined,
  RightOutlined,
  ClockCircleOutlined,
  CloseCircleFilled,
  SwapOutlined,
} from '@ant-design/icons';
import { FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { IoIosPaperPlane } from 'react-icons/io';
import { InscricaoProps } from '../../listagem';

export interface CardInscricaoMobileProps {
  record: InscricaoProps;
  onExibirDetalhes: (record: InscricaoProps) => void;
  onCancelarInscricao?: (record: InscricaoProps) => void;
  mostrarCancelar?: boolean;
}

export const getStatusConfig = (situacao?: string) => {
  const normalized = (situacao || '').toLowerCase().trim();

  if (normalized.includes('confirmad')) {
    return {
      color: '#039D03',
      bg: 'rgba(3, 157, 3, 0.1)',
      label: 'Confirmada',
      icon: <FaCheckCircle size={12} />,
    };
  }

  if (normalized.includes('enviad')) {
    return {
      color: '#0D99D5',
      bg: 'rgba(13, 153, 213, 0.1)',
      label: 'Enviada',
      icon: <IoIosPaperPlane size={13} />,
    };
  }

  if (normalized.includes('aguardando')) {
    return {
      color: '#797979',
      bg: 'rgba(121, 121, 121, 0.1)',
      label: 'Aguardando análise',
      icon: <ClockCircleOutlined style={{ fontSize: 13 }} />,
    };
  }

  if (normalized.includes('espera')) {
    return {
      color: '#785C00',
      bg: 'rgba(120, 92, 0, 0.1)',
      label: 'Em espera',
      icon: <FaHourglassHalf size={12} />,
    };
  }

  if (normalized.includes('cancelad')) {
    return {
      color: '#B40C02',
      bg: 'rgba(180, 12, 2, 0.1)',
      label: 'Cancelada',
      icon: <CloseCircleFilled style={{ fontSize: 13 }} />,
    };
  }

  if (normalized.includes('transferid')) {
    return {
      color: '#277E77',
      bg: 'rgba(39, 126, 119, 0.1)',
      label: 'Transferida',
      icon: <SwapOutlined style={{ fontSize: 13 }} />,
    };
  }

  return {
    color: '#797979',
    bg: 'rgba(121, 121, 121, 0.1)',
    label: situacao || 'Pendente',
    icon: <ClockCircleOutlined style={{ fontSize: 13 }} />,
  };
};

const CardContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #dadada;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const CodigoFormacao = styled.span`
  font-size: 12px;
  color: #929494;
  font-weight: 500;
`;

const NomeFormacao = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.3;
  word-break: break-word;
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
  white-space: nowrap;
  flex-shrink: 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #42474a;
  line-height: 1.4;

  .info-icon {
    color: #929494;
    font-size: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .info-text {
    flex: 1;
    word-break: break-word;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;

const DetalhesButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: #ff9a52;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: #f28a3e;
  }
`;

const CancelarButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 40px;
  background-color: #ffffff;
  border: 1px solid ${(props) => (props.disabled ? '#dadada' : '#ff9a52')};
  border-radius: 8px;
  color: ${(props) => (props.disabled ? '#bfbfc2' : '#ff9a52')};
  font-size: 14px;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    background-color: rgba(255, 154, 82, 0.08);
  }
`;

export const CardInscricaoMobile: React.FC<CardInscricaoMobileProps> = ({
  record,
  onExibirDetalhes,
  onCancelarInscricao,
  mostrarCancelar = true,
}) => {
  const status = getStatusConfig(record.situacao);

  return (
    <CardContainer data-testid={`card-inscricao-${record.id}`}>
      <HeaderRow>
        <HeaderInfo>
          <CodigoFormacao>Cód. {record.codigoFormacao}</CodigoFormacao>
          <NomeFormacao>{record.nomeFormacao}</NomeFormacao>
        </HeaderInfo>
        <StatusBadge
          $color={status.color}
          $bg={status.bg}
          data-testid={`status-badge-${record.id}`}
        >
          {status.icon}
          <span>{status.label}</span>
        </StatusBadge>
      </HeaderRow>

      {record.datas && (
        <InfoRow>
          <span className='info-icon'>
            <CalendarOutlined />
          </span>
          <span className='info-text'>{record.datas}</span>
        </InfoRow>
      )}

      {record.nomeTurma && (
        <InfoRow>
          <span className='info-icon'>
            <TeamOutlined />
          </span>
          <span className='info-text'>{record.nomeTurma}</span>
        </InfoRow>
      )}

      <ActionsContainer>
        <DetalhesButton
          type='button'
          onClick={() => onExibirDetalhes(record)}
          data-testid={`btn-detalhes-${record.id}`}
        >
          <span>Exibir detalhes</span>
          <RightOutlined style={{ fontSize: 12 }} />
        </DetalhesButton>

        {mostrarCancelar && onCancelarInscricao && (
          <CancelarButton
            type='button'
            disabled={!record.podeCancelar}
            onClick={() => record.podeCancelar && onCancelarInscricao(record)}
            data-testid={`btn-cancelar-${record.id}`}
          >
            Cancelar inscrição
          </CancelarButton>
        )}
      </ActionsContainer>
    </CardContainer>
  );
};

export default CardInscricaoMobile;
