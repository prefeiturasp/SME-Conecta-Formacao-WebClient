import { Col, Divider, Row, Space, Typography } from 'antd';
import parse, { DOMNode, Element, HTMLReactParserOptions, domToReact } from 'html-react-parser';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { NotificacoDetalheDTO } from '~/core/dto/notificacao-detalhe-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import notificacaoService from '~/core/services/notificacao-service';
import { Colors } from '~/core/styles/colors';
import { onClickVoltar } from '~/core/utils/form';

export const NotificacoesDetalhes = () => {
  const navigate = useNavigate();
  const paramsRoute = useParams();
  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const [detalhes, setDetalhes] = useState<NotificacoDetalheDTO>();

  const optionsParseDescription: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'p') {
        return <p style={{ marginBottom: 0 }}>{domToReact(domNode.children as DOMNode[])}</p>;
      }
    },
  };

  const mensagem = detalhes && parse(detalhes?.mensagem, optionsParseDescription);

  const obterDetalhes = useCallback(async () => {
    const resposta = await notificacaoService.obterNotificacoesDetalhe(id);
    if (resposta.sucesso) {
      const dados = resposta.dados;

      setDetalhes({
        id: dados.id,
        titulo: dados.titulo,
        mensagem: dados.mensagem,
        categoria: dados.categoria,
        categoriaDescricao: dados.categoriaDescricao,
        tipo: dados.tipo,
        tipoDescricao: dados.tipoDescricao,
        parametros: dados.parametros,
      });
    }
  }, [id]);

  useEffect(() => {
    obterDetalhes();
  }, [obterDetalhes, id]);

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
          align='bottom'
          gutter={[16, 16]}
          style={{ border: `1px solid ${Colors.Neutral.LIGHT}`, borderRadius: 4, padding: 12 }}
        >
          <Col
            xs={24}
            md={24}
            lg={8}
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
                <Typography.Title level={3}>{detalhes?.id}</Typography.Title>
              </Space>
            </Row>
          </Col>

          <Col xs={24} md={24} lg={16}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  Tipo
                </Typography.Title>
                <Typography>{detalhes?.tipoDescricao}</Typography>
              </Col>
              <Col xs={24} md={16}>
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  Titulo
                </Typography.Title>
                <Typography>{detalhes?.titulo}</Typography>
              </Col>
            </Row>
          </Col>
          {detalhes?.mensagem && (
            <>
              <Divider />
              <Col>{mensagem}</Col>
            </>
          )}
        </Row>
      </CardContent>
    </>
  );
};
