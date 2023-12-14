import React from 'react';
import { Button, Card, Flex, Typography } from 'antd';
import { Colors } from '~/core/styles/colors';
import { ROUTES } from '~/core/enum/routes-enum';

const cardStyle: React.CSSProperties = {
  width: 1100,
  background: Colors.Suporte.Primary.ERROR,
};

const imgStyle: React.CSSProperties = {
  display: 'block',
  width: 473,
};

const DadosDestaque: React.FC = () => (
  <Card hoverable style={cardStyle} bodyStyle={{ padding: 0, overflow: 'hidden' }}>
    <Flex justify='left'>
      <img
        alt='avatar'
        src='https://fia.com.br/wp-content/uploads/2022/06/pod.jpg'
        style={imgStyle}
      />
      <Flex
        vertical
        align='flex-start'
        justify='space-between'
        style={{ paddingLeft: 20, paddingBottom: 10 }}
      >
        <Typography.Title level={2}>Rádio escolar e podcast na educação</Typography.Title>
        <Typography.Title level={5}>Área Promotora: CODAE</Typography.Title>
        <Typography.Title level={5}>Área Promotora: CODAE</Typography.Title>
        <Typography.Title level={5}>Área Promotora: CODAE</Typography.Title>
        <Button type='primary' shape='round' href={ROUTES.PRINCIPAL}>
          Enviar inscrição
        </Button>
      </Flex>
    </Flex>
  </Card>
);

export default DadosDestaque;
