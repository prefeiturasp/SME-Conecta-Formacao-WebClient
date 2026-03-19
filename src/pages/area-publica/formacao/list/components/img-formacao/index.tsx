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
  align-items: center;
  gap: 12px;
`;

const Img = styled.img`
  height: 50px;
  margin-left: 25px;
  margin-top: 25px;
  display: block;
`;

export const ImgFormacao: React.FC<ImgFormacaoProps> = ({ url, inscricaoEncerrada }) => (
  <Container>
    <Img alt="divulgacao" src={url ?? imagemFormacao} />
    {inscricaoEncerrada && <DivInscricaoEncerrada>Inscrições encerradas</DivInscricaoEncerrada>}
  </Container>
);