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
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0%;
  margin-bottom: 0;

  .anticon, svg {
    font-size: 14px;
  }
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

export const DesktopCardContainer = styled.div`
  display: block;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const MobileCardContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex !important;
    flex-direction: column;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
    padding: 16px;
    box-sizing: border-box;
    width: 100%;
    margin-bottom: 16px;
  }
`;

export const MobileBadgeConecta = styled.img`
  width: 58px;
  height: auto;
  display: block;
`;

export const MobileTitulo = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #42474a;
  margin: 8px 0 12px 0;
`;

export const MobileInfoRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
`;

export const MobileLabel = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #42474a;
  line-height: 1.3;
`;

export const MobileValue = styled.span`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #58616a;
  line-height: 1.3;
`;

export const CardDivider = styled.hr`
  border: none;
  border-top: 1px solid #eaeaea;
  margin: 12px 0;
  width: 100%;
`;

export const AreaPromotoraTitulo = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #42474a;
  margin: 0 0 8px 0;
  line-height: 1.3;
`;

export const AreaPromotoraTagsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
`;

export const MobileDivider = CardDivider;
export const MobileAreaPromotoraTitulo = AreaPromotoraTitulo;

