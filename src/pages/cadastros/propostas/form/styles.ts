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
export const styles = {
  container: {
    marginTop: 10,
    height: 64,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    background: '#FF9A52',
    borderRadius: 4,
    opacity: 1
  },
  icon: {
    fontSize: 20,
    color: '#fff'
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '14px', // 100%
    letterSpacing: '0%',
    color: '#fff'
  }
};