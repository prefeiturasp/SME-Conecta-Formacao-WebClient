import { Col, Flex, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import { Colors } from '~/core/styles/colors';
import { onClickVoltar } from '~/core/utils/form';

export const NotificacoesDetalhes = () => {
  const navigate = useNavigate();

  return (
    <>
      <HeaderPage title='Notificações'>
        <Row>
          <Col span={24}>
            <ButtonVoltar
              onClick={() => onClickVoltar({ navigate, route: ROUTES.NOTIFICACOES })}
              id={CF_BUTTON_VOLTAR}
            />
          </Col>
        </Row>
      </HeaderPage>
      <CardContent>
        <Row
          gutter={[16, 16]}
          style={{ border: `1px solid ${Colors.Neutral.LIGHT}`, borderRadius: 4, padding: 12 }}
        >
          <Col
            xs={8}
            md={8}
            style={{
              background: Colors.BACKGROUND_CONTENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
            }}
          >
            <Row>
              <Space direction='vertical' align='center' style={{ paddingTop: 12 }}>
                <Typography.Title level={5}>CÓDIGO</Typography.Title>
                <Typography.Title level={3}>12345678</Typography.Title>
              </Space>
            </Row>
          </Col>
          <Col xs={8} md={12} lg={12}>
            <Flex vertical justify='space-between'>
              <Typography.Text style={{ color: Colors.Neutral.LIGHT }}>
                Notificação automática
              </Typography.Text>

              <Row justify='space-between'>
                <Col>
                  <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    Tipo
                  </Typography.Title>
                  <Typography>Relatorio</Typography>
                </Col>
                <Col>
                  <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    Titulo
                  </Typography.Title>
                  <Typography>Teste de titulo</Typography>
                </Col>
                <Col>
                  <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    Situacao
                  </Typography.Title>
                  <Typography>Lida ou Não Lida</Typography>
                </Col>
              </Row>
            </Flex>
          </Col>
        </Row>
      </CardContent>
    </>
  );
};
