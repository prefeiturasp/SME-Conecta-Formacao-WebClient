import { Button, Col, Form, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import HeaderPage from '~/components/lib/header-page';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { ENVIAR_INSCRICAO, NOVA_INSCRICAO } from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';

export const MinhasInscricoes = () => {
  const navigate = useNavigate();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const enviouInscricao = true;
  const labelButton = enviouInscricao ? NOVA_INSCRICAO : ENVIAR_INSCRICAO;
  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  //TODO - mudar tipagem das columns
  const columns: ColumnsType<any> = [
    { title: 'Código da formação', dataIndex: 'registroFuncional' },
    { title: 'Título da formação', dataIndex: 'tituloFormacao' },
    { title: 'Turma', dataIndex: 'turma' },
    { title: 'Datas', dataIndex: 'datas' },
    { title: 'Cargo/Função', dataIndex: 'cargoFuncao' },
    {
      title: 'Situação',
      dataIndex: 'situacao',
      render: () => {
        return (
          <Button type='default' size='small'>
            Cancelar inscrição
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    if (!ehCursista) {
      navigate(ROUTES.PRINCIPAL);
    }
  }, [perfilSelecionado]);

  const novaInscricao = () => {
    navigate(ROUTES.AREA_PUBLICA);
  };

  const onFinish = () => {
    if (enviouInscricao) {
      novaInscricao();
    }
  };

  return (
    <Col>
      <Form onFinish={onFinish}>
        <HeaderPage title='Minhas Inscrições'>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col>
                <Button
                  block
                  type='primary'
                  htmlType='submit'
                  id={CF_BUTTON_NOVO}
                  style={{ fontWeight: 700 }}
                >
                  {labelButton}
                </Button>
              </Col>
            </Row>
          </Col>
        </HeaderPage>

        <CardContent>
          <Col span={24}>
            <DataTable url={`v1/`} columns={columns} />
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
