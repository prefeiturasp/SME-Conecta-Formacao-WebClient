import { Typography } from 'antd';
import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

export const DivTitulo = styled.div`
  width: 100%;
  margin-bottom: 30px;
  border-bottom: 1px solid ${Colors.Neutral.LIGHT};
`;

export const TextTitulo = styled(Typography.Text)`
  font-size: 32px;
  font-weight: bold;
  color: #0097a7;
`;
