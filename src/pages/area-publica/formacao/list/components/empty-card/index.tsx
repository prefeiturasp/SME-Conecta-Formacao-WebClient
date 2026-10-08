import { Empty } from 'antd';
import React from 'react';
import styled from 'styled-components';

export const EmptyCardContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;

  .ant-empty {
    margin: 0;
  }

  .ant-empty-image {
    height: 100px;
    margin-bottom: 20px;
  }
`;

export const EmptyTitle = styled.h3`
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #42474a;
  margin: 0 0 6px 0;
  line-height: 1.3;
  text-align: center;
`;

export const EmptySubtitle = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #58616a;
  margin: 0;
  line-height: 1.3;
  text-align: center;
`;

export const EmptyCard: React.FC = () => {
  return (
    <EmptyCardContainer data-testid='empty-card'>
      <Empty
        image={Empty.PRESENTED_IMAGE_DEFAULT}
        description={
          <div>
            <EmptyTitle>Não encontramos dados para essa busca!</EmptyTitle>
            <EmptySubtitle>Experimente buscar com um novo nome.</EmptySubtitle>
          </div>
        }
      />
    </EmptyCardContainer>
  );
};

export default EmptyCard;
