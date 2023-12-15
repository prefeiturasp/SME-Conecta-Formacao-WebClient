import { Tag, Typography } from 'antd';
import styled from 'styled-components';
import { Colors } from '~/core/styles/colors';

export const TagTipoFormacaoFormato = styled(Tag)`
  font-size: 14px;
  border-radius: 20px;
  padding: 5px 10px 5px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  background-color: ${Colors.Neutral.LIGHTEST};
`;

export const TextPeriodo = styled(Typography.Text)`
  font-size: 18px;
  color: ${Colors.SystemSME.ConectaFormacao.PRIMARY_DARK};
  font-weight: bold;
`;

export const TextTitulo = styled(Typography.Text)`
  font-size: 28px;
  font-weight: bold;
`;

export const TextAreaPromotora = styled(Typography.Text)`
  font-size: 18px;
`;
