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

export const ImgFormacao: React.FC<ImgFormacaoProps> = ({ url, inscricaoEncerrada }) => (
  <>
    <img alt='divulgacao' src={url ?? imagemFormacao} height={183} />
    {inscricaoEncerrada && <DivInscricaoEncerrada>Inscrições encerradas</DivInscricaoEncerrada>}
  </>
);
