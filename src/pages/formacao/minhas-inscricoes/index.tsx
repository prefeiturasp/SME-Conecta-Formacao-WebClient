import { Button, Col, Form, Row, notification } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import HeaderPage from '~/components/lib/header-page';
import { CF_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import {
  DESEJA_CANCELAR_INSCRICAO,
  ENVIAR_INSCRICAO,
  NOVA_INSCRICAO,
} from '~/core/constants/mensagens';
import { ROUTES } from '~/core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '~/core/enum/tipo-perfil';
import { useAppSelector } from '~/core/hooks/use-redux';
import { confirmacao } from '~/core/services/alerta-service';
import { cancelarInscricao } from '~/core/services/inscricao-service';

export interface InscricaoProps {
  id: number;
  nomeFormacao: string;
  nomeTurma: string;
  datas: string;
  cargoFuncao: string;
  situacao: string;
  podeCancelar: boolean;
}

export const MinhasInscricoes = () => {
  const navigate = useNavigate();
  const perfilSelecionado = useAppSelector((store) => store.perfil.perfilSelecionado?.perfilNome);

  const enviouInscricao = true;
  const labelButton = enviouInscricao ? NOVA_INSCRICAO : ENVIAR_INSCRICAO;
  const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[TipoPerfilEnum.Cursista];

  const columns: ColumnsType<InscricaoProps> = [
    { title: 'Código da formação', dataIndex: 'id', width: '6%' },
    { title: 'Título da formação', dataIndex: 'nomeFormacao', width: '10%' },
    { title: 'Turma', dataIndex: 'nomeTurma', width: '10%' },
    { title: 'Datas', dataIndex: 'datas', width: '10%' },
    { title: 'Cargo/Função', dataIndex: 'cargoFuncao', width: '10%' },
    { title: 'Situação', dataIndex: 'situacao', width: '10%' },
    {
      title: 'Ações',
      dataIndex: 'podeCancelar',
      width: '2%',
      render: (_, record) => {
        const cancelar = async () => {
          confirmacao({
            content: DESEJA_CANCELAR_INSCRICAO,
            onOk: async () => {
              const response = await cancelarInscricao(record.id);
              if (response.sucesso) {
                notification.success({
                  message: 'Sucesso',
                  description: 'Inscrição cancelada com sucesso!',
                });
              }
            },
          });
        };

        return (
          <Button type='default' size='small' disabled={!record.podeCancelar} onClick={cancelar}>
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
            <DataTable url={`v1/Inscricao`} columns={columns} />
          </Col>
        </CardContent>
      </Form>
    </Col>
  );
};
