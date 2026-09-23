import { ArrowUpOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

const BotaoTopoContainer = styled.button`
  position: fixed;
  bottom: 24px;
  right: 20px;
  z-index: 100;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${Colors.SystemSME.ConectaFormacao.PRIMARY};
  color: ${Colors.Neutral.WHITE};
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  transition: opacity 0.3s ease, transform 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: ${Colors.SystemSME.ConectaFormacao.PRIMARY_DARK};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  /* Invisivel no desktop para nao haver regressao visual */
  @media (min-width: 769px) {
    display: none !important;
  }
`;

export interface VoltarAoTopoButtonProps {
  limiteScroll?: number;
  sempreVisivel?: boolean;
}

export const obterPosicaoScroll = (): number => {
  if (typeof window !== 'undefined' && typeof window.scrollY === 'number' && window.scrollY > 0) {
    return window.scrollY;
  }
  if (
    typeof document !== 'undefined' &&
    document.documentElement &&
    typeof document.documentElement.scrollTop === 'number' &&
    document.documentElement.scrollTop > 0
  ) {
    return document.documentElement.scrollTop;
  }
  return 0;
};

const VoltarAoTopoButton: React.FC<VoltarAoTopoButtonProps> = ({
  limiteScroll = 250,
  sempreVisivel = false,
}) => {
  const [visivel, setVisivel] = useState(sempreVisivel);

  useEffect(() => {
    if (sempreVisivel) {
      setVisivel(true);
      return;
    }

    const handleScroll = () => {
      const scrollAtual = obterPosicaoScroll();
      setVisivel(scrollAtual > limiteScroll);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [limiteScroll, sempreVisivel]);

  const rolarParaTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visivel) {
    return null;
  }

  return (
    <BotaoTopoContainer
      type='button'
      onClick={rolarParaTopo}
      aria-label='Voltar ao topo'
      title='Voltar ao topo'
      data-testid='btn-voltar-ao-topo'
    >
      <ArrowUpOutlined style={{ fontSize: 20, color: '#FFFFFF' }} />
    </BotaoTopoContainer>
  );
};

export default VoltarAoTopoButton;
