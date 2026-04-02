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

export const AlertaIconWrapper = styled.div`
  background-color: #ff9a52;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const AlertaIconInner = styled.div`
  background-color: #fff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: #ff9a52;
    font-size: 16px;
  }
`;

export const AlertaTexto = styled.span`
  font-family: Roboto;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #fff;
`;