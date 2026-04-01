import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

export const TituloSecao = styled.div`
  font-size: 18px;
  color: ${Colors.SystemSME.ConectaFormacao.PRIMARY};
  font-weight: bold;
`;

export const TituloListaPaginada = styled.div`
  font-size: 16px;
  color: ${Colors.Neutral.DARK};
  font-weight: bold;
`;

export const AlertaContainer = styled.div`
  margin-top: 10px;
  min-height: 64px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #ff9a52;
  border-radius: 4px;
`;

export const AlertaIcon = styled.div`
  font-size: 20px;
  color: #fff;
  display: flex;
`;

export const AlertaTexto = styled.span`
  font-family: Roboto;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
`;