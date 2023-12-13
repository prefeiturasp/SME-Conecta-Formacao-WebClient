import React from 'react';

import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

export const DivInscricaoEncerrada = styled.div`
  background-color: ${Colors.Suporte.Primary.ERROR};
  color: ${Colors.Neutral.WHITE};
  text-align: center;
  position: relative;
  margin-top: -28px;
  font-weight: bold;
  font-size: 18px;
`;

type ImgFormacaoProps = {
  url?: string;
  inscricaoEncerrada?: boolean;
};

export const ImgFormacao: React.FC<ImgFormacaoProps> = ({ url, inscricaoEncerrada }) => {
  return (
    <>
      <img alt='divulgacao' src={url} height={200} />
      {inscricaoEncerrada && <DivInscricaoEncerrada>Inscrições encerradas</DivInscricaoEncerrada>}
    </>
  );
};
