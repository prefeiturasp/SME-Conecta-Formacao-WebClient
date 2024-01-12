import { Affix, Col, Row, Typography } from 'antd';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { BoxShadow, Colors } from '~/core/styles/colors';

const AffixContainer = styled.div`
  .ant-affix {
    box-shadow: ${BoxShadow.DEFAULT};
  }
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
        <Row
          justify='space-between'
          style={{ marginBottom: 8, background: Colors.BACKGROUND_CONTENT }}
        >
          <Col xs={18} sm={16}>
            <Title ellipsis={{ tooltip: tooltipTitle }}>{title}</Title>
          </Col>
          <Col>
            <ChildrenContainer>{children}</ChildrenContainer>
          </Col>
        </Row>
      </Affix>
    </AffixContainer>
  );
};

export default HeaderPage;
