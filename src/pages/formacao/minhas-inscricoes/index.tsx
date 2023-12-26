import { Button, Col, Form, Row } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import { ENVIAR_INSCRICAO, NOVA_INSCRICAO } from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';

export interface Inscricao {
  registroFuncional: string;
  tituloFormacao: string;
  turma: string;
  datas: string;
  cargoFuncao: string;
  situacao: string;
  acoes: React.ReactNode;
}

export const MinhasInscricoes = () => {
  const navigate = useNavigate();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const enviouInscricao = true;
  const labelButton = enviouInscricao ? NOVA_INSCRICAO : ENVIAR_INSCRICAO;
  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  const dataSource: Inscricao[] = [
    {
      registroFuncional: 'aaa',
      tituloFormacao: 'aaa',
      turma: 'aaa',
      datas: 'aaa',
      cargoFuncao: 'aaa',
      situacao: 'aaa',
      acoes: false,
    },
    {
      registroFuncional: 'bbb',
      tituloFormacao: 'bbb',
      turma: 'bbb',
      datas: 'bbb',
      cargoFuncao: 'bbb',
      situacao: 'bbb',
      acoes: true,
    },
  ];

  const columns: ColumnsType<Inscricao> = [
    { title: 'Código da formação', dataIndex: 'registroFuncional', width: '6%' },
    { title: 'Título da formação', dataIndex: 'tituloFormacao', width: '10%' },
    { title: 'Turma', dataIndex: 'turma', width: '10%' },
    { title: 'Datas', dataIndex: 'datas', width: '10%' },
    { title: 'Cargo/Função', dataIndex: 'cargoFuncao', width: '10%' },
    { title: 'Situação', dataIndex: 'situacao', width: '10%' },
    {
      title: 'Ações',
      dataIndex: 'acoes',
      width: '2%',
      render: (desabilitarSituacao) => {
        return (
          <Button type='default' size='small' disabled={desabilitarSituacao}>
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
            {/* TODO - trocar pra datatable quando tiver enpoint */}
            {/* <DataTable url={`v1/`} columns={columns} /> */}
            <Table bordered dataSource={dataSource} columns={columns} />
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
