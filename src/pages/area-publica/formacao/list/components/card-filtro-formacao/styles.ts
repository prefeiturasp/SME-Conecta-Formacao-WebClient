import { DatePicker, Input, Select } from 'antd';
import styled from 'styled-components';

export const DesktopFiltroContainer = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const MobileFiltroContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block !important;
    width: 100%;
  }
`;

export const MobileCardWrapper = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
`;

export const BotaoFiltrosMobile = styled.button`
  width: 100%;
  height: 44px;
  background-color: #ffffff;
  border: 1px solid #ff9a52;
  border-radius: 8px;
  color: #ff9a52;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    background-color: #fff8f3;
  }

  &:active {
    background-color: #ffebd8;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.2;
`;

export const DateRangeWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  .ant-picker {
    flex: 1;
    min-width: 0;
  }
`;

export const StyledInput = styled(Input)`
  height: 40px;
  border-radius: 8px;
  border-color: #dadada;

  &::placeholder {
    color: #bfbfc2;
  }

  &:hover,
  &:focus {
    border-color: #ff9a52;
  }
`;

export const StyledSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    min-height: 40px !important;
    padding: 4px 11px !important;
    border-radius: 8px !important;
    border-color: #dadada !important;
    display: flex !important;
    align-items: center !important;
    flex-wrap: wrap !important;
  }

  &:hover .ant-select-selector,
  &.ant-select-focused .ant-select-selector {
    border-color: #ff9a52 !important;
  }

  .ant-select-selection-placeholder {
    color: #bfbfc2 !important;
  }
`;


export const StyledDatePicker = styled(DatePicker)`
  height: 40px;
  width: 100%;
  border-radius: 8px;
  border-color: #dadada;

  input::placeholder {
    color: #bfbfc2;
  }

  &:hover,
  &:focus {
    border-color: #ff9a52;
  }
`;
