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
  margin-bottom: 15px;
`;

export const TextLabel = styled(Typography.Text)`
  font-size: 15px;
  font-weight: bold;
`;

export const Titulo = styled(Typography.Text)`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;

  line-height: 1.2em;
  min-height: calc(1.2em * 2);

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Info = styled.div`
  margin-bottom: 8px;
`;

export const Label = styled.span`
  font-weight: 700;
`;

export const Value = styled.span`
  font-weight: 400;
  margin-left: 4px;
`;

export const ValueDuplo = styled.div`
  font-weight: 400;
  margin-top: 4px;

  line-height: 1.4em;
  min-height: calc(1.4em * 2);

  overflow: hidden;

  margin-bottom: 10px;
`;