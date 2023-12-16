import { Tag, Typography } from 'antd';
import styled from 'styled-components';

export const TagTipoFormacaoFormato = styled(Tag)`
  gap: 5px;
  display: flex;
  align-items: center;
  border-radius: 50px;
  padding: 5px 10px;
  border: none;
  background-color: #ececee;
  color: #58616a;
  font-weight: bold;
`;

export const TextPeriodo = styled(Typography.Text)`
  font-size: 16px;
  color: #f86041;
  font-weight: bold;
`;

export const TextTitulo = styled(Typography.Text)`
  font-size: 22px;
  font-weight: bold;
  color: #1c2833;
`;

export const TextAreaPromotora = styled(Typography.Text)`
  font-size: 18px;
  color: #58616a;
  font-weight: 500;
`;
