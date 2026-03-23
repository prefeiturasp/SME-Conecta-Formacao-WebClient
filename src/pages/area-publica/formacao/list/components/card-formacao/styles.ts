import { Tag, Typography } from 'antd';
import styled from 'styled-components';

export const TagTipoFormacaoFormato = styled(Tag)`
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 50px;
  padding: 5px 10px;
  border: none;
  background-color: #ececee;
  color: #58616a;
  font-family: 'Roboto';
  font-weight: 700;
  font-style: normal;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  margin-bottom: 15px;
`;

export const TextLabel = styled(Typography.Text)`
  font-size: 15px;
  font-weight: bold;
`;

export const Titulo = styled(Typography.Text)`
  font-family: "Roboto";
  font-size: 20px;
  font-weight: 700;
  line-height: 100%;
  letter-spacing: 0%;
  margin-bottom: 12px;

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
  display: block;
  font-family: 'Roboto';
  font-weight: 700;
  font-style: normal;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  margin-bottom: 2px;
`;

export const Value = styled.span`
  display: block;
  font-family: 'Roboto';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
`;

export const ValueDuplo = styled.div`
  display: block;
  font-family: 'Roboto';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
  
  line-height: 1.4em;
  min-height: calc(1.4em * 2);

  overflow: hidden;

  margin-bottom: 10px;
`;