import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

export const ContainerErroGeralLogin = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 0.28px;
  color: ${Colors.ERROR};
  border-radius: 4px;
  border: solid 2px ${Colors.ERROR};
  text-align: center;
  margin-bottom: 24px;

  p {
    margin: 0.5em;
  }
`;
