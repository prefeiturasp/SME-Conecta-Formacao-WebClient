import styled from 'styled-components';
import { Typography, Tag, Divider } from 'antd';
import { Colors } from '~/core/styles/colors';

const tituloPadrao = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 700,
  fontStyle: 'normal',
  fontSize: 20,
  lineHeight: '100%',
  letterSpacing: '0%',
  color: '#58616A',
};

export const typographyStyles = {
  tituloNivel3: { ...tituloPadrao },
  tituloPublicoAlvo: { ...tituloPadrao },
  textoJustificativa: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: 14,
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#58616A',
  },
  textoPublicoAlvo: {
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: 12,
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#58616A',
  },
};

export const PalavrasTag = styled(Tag)`
  height: 22px;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 30px;
  margin: 4px 8px;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0;
  color: ${Colors.Neutral.WHITE};
  background-color: ${Colors.Neutral.DARK};
  border: none;
`;

export const TurmasTitulo = styled(Typography.Title)`
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
  color: #42474A;
  padding-bottom: 20px;
`;

export const CustomDivider = styled(Divider)`
  border-top: none; /* remove o border-top padrão */
  border-bottom: 1px solid #DADADADD;
  padding-bottom: 10px;
`;