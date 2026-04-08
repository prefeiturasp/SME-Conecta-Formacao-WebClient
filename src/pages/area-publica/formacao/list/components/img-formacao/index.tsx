import React from 'react';
import imagemFormacao from '~/assets/conecta-formacao-logo.svg';

import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

export const DivInscricaoEncerrada = styled.div`
  background-color: #d32f2f;
  color: ${Colors.Neutral.WHITE};
  text-align: center;
  position: relative;
  margin-top: -28px;
  font-weight: bold;
  font-size: 18px;
  height: 32px;
`;

type ImgFormacaoProps = {
  url?: string;
  inscricaoEncerrada?: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const ImgWrapper = styled.div`
  width: 100%;
  height: 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const ImgCustom = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ImgDefault = styled.img`
  height: calc(100% - 20px);
  width: auto;
  display: block;
  padding: 10px;
`;

export const ImgFormacao: React.FC<ImgFormacaoProps> = ({ url, inscricaoEncerrada }) => (
  <Container>
    <ImgWrapper>
      {url ? (
        <ImgCustom alt='divulgacao' src={url} />
      ) : (
        <ImgDefault alt='divulgacao' src={imagemFormacao} />
      )}
    </ImgWrapper>
    {inscricaoEncerrada && <DivInscricaoEncerrada>Inscrições encerradas</DivInscricaoEncerrada>}
  </Container>
);
