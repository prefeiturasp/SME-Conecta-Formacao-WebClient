import { Affix, Col, Typography } from 'antd';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { BoxShadow, Colors } from '~/core/styles/colors';

const AffixContainer = styled.div`
  .ant-affix {
    box-shadow: ${BoxShadow.DEFAULT};
  }
`;

const HeaderContainer = styled.div`
  height: 53px;
  display: flex;
  align-items: end;
  margin-left: -32px;
  margin-right: -32px;
  padding-bottom: 8px;
  background-color: ${Colors.BACKGROUND_CONTENT};
`;

const HeaderContentContainer = styled.div`
  width: 100%;
  display: flex;
  margin-left: 32px;
  margin-right: 32px;
  justify-content: space-between;
  align-items: end;
  overflow: hidden;
`;

const Title = styled(Typography.Text)`
  font-size: 23px;
  font-weight: 700;
  color: ${Colors.Neutral.DARK};
`;

const ChildrenContainer = styled.div``;

type HeaderPage = {
  title: string;
  tooltipTitle?: string;
} & PropsWithChildren;

const HeaderPage: React.FC<HeaderPage> = ({ title, children, tooltipTitle }) => {
  return (
    <AffixContainer>
      <Affix offsetTop={70}>
        <HeaderContainer>
          <HeaderContentContainer>
            <Col xs={18}>
              <Title ellipsis={{ tooltip: tooltipTitle }}>{title}</Title>
            </Col>
            <ChildrenContainer>{children}</ChildrenContainer>
          </HeaderContentContainer>
        </HeaderContainer>
      </Affix>
    </AffixContainer>
  );
};

export default HeaderPage;
