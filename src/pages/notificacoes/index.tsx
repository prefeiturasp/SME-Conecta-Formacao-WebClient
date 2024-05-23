import { Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickVoltar } from '~/core/utils/form';

const MOCK_DATA = [
  {
    codigo: '1',
    tipo: 'Relatório',
    categoria: 'Aviso',
    titulo: 'Teste de notificacoes',
    situacao: 'Lida',
    dataHora: '22/05/204 15:45',
  },
  {
    codigo: '2',
    tipo: 'Relatório',
    categoria: 'Aviso',
    titulo: 'Teste de notificacoes 2',
    situacao: 'Não Lida',
    dataHora: '22/05/204 15:45',
  },
];

export const Notificacoes = () => {
  const navigate = useNavigate();
  const columns: ColumnsType = [
    { key: 'codigo', title: 'Código', dataIndex: 'codigo' },
    { key: 'tipo', title: 'Tipo', dataIndex: 'tipo' },
    { key: 'categoria', title: 'Categoria', dataIndex: 'categoria' },
    { key: 'titulo', title: 'Título', dataIndex: 'titulo' },
    { key: 'situacao', title: 'Situação', dataIndex: 'situacao' },
    { key: 'dataHora', title: 'Data/Hora', dataIndex: 'dataHora' },
  ];

  const onClickEditar = (id: number) =>
    navigate(`${ROUTES.NOTIFICACOES}/detalhes/${id}`, { replace: true });

  return (
    <>
      <HeaderPage title='Notificações'>
        <Row>
          <Col span={24}>
            <ButtonVoltar
              onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })}
              id={CF_BUTTON_VOLTAR}
            />
          </Col>
        </Row>
      </HeaderPage>
      <CardContent>
        <DataTable
          columns={columns}
          dataSource={MOCK_DATA}
          onRow={(row) => ({
            onClick: () => {
              onClickEditar(row.codigo);
            },
          })}
        />
      </CardContent>
    </>
  );
};
