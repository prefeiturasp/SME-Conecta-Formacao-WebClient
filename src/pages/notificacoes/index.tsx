import { Col, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import DataTable from '~/components/lib/card-table';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';
import {
  CF_INPUT_CATEGORIA_NOTIFICACAO,
  CF_INPUT_CODIGO_NOTIFICACAO,
  CF_INPUT_SITUACAO_NOTIFICACAO,
  CF_INPUT_TIPO_NOTIFICACAO,
  CF_INPUT_TITULO_NOTIFICACAO,
} from '~/core/constants/ids/input';
import { NotificacaoFiltroDTO } from '~/core/dto/notificacao-filtro-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { onClickVoltar } from '~/core/utils/form';

const MOCK_DATA = [
  {
    codigo: '1',
    tipo: 'Relatório',
    categoria: 'Aviso',
    titulo: 'MOCK Teste de notificacoes',
    situacao: 'Lida',
    dataHora: '22/05/204 15:45',
  },
  {
    codigo: '2',
    tipo: 'Relatório',
    categoria: 'Aviso',
    titulo: 'MOCK Teste de notificacoes 2',
    situacao: 'Não Lida',
    dataHora: '22/05/204 15:45',
  },
];

export const Notificacoes = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<NotificacaoFiltroDTO>({
    id: null,
    titulo: null,
    categoria: null,
    tipo: null,
    situacao: null,
  });

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

  const obterFiltros = () => {
    const codigo = form.getFieldValue('codigo');
    const titulo = form.getFieldValue('titulo');
    const categoria = form.getFieldValue('categoria');
    const tipo = form.getFieldValue('tipo');
    const situacao = form.getFieldValue('situacao');

    setFilters({
      id: codigo,
      titulo: titulo,
      categoria: categoria,
      tipo: tipo,
      situacao: situacao,
    });
  };

  return (
    <Form form={form} layout='vertical' autoComplete='off'>
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
        <Row gutter={[16, 8]}>
          <Col xs={24} sm={8}>
            <InputNumero
              formItemProps={{
                label: 'Código',
                name: 'codigo',
                style: { fontWeight: 'bold' },
              }}
              inputProps={{
                onChange: obterFiltros,
                id: CF_INPUT_CODIGO_NOTIFICACAO,
                placeholder: 'Código',
              }}
            />
          </Col>

          <Col xs={24} sm={8}>
            <InputTexto
              formItemProps={{
                label: 'Tipo',
                name: 'tipo',
                style: { fontWeight: 'bold' },
              }}
              inputProps={{
                id: CF_INPUT_TIPO_NOTIFICACAO,
                placeholder: 'Tipo',
                onChange: obterFiltros,
              }}
            />
          </Col>

          <Col xs={24} sm={8}>
            <InputTexto
              formItemProps={{
                label: 'Categoria',
                name: 'categoria',
                style: { fontWeight: 'bold' },
              }}
              inputProps={{
                id: CF_INPUT_CATEGORIA_NOTIFICACAO,
                placeholder: 'Categoria',
                onChange: obterFiltros,
              }}
            />
          </Col>

          <Col xs={24} sm={8}>
            <InputTexto
              formItemProps={{
                label: 'Título',
                name: 'titulo',
                style: { fontWeight: 'bold' },
              }}
              inputProps={{
                id: CF_INPUT_TITULO_NOTIFICACAO,
                placeholder: 'Título',
                onChange: obterFiltros,
              }}
            />
          </Col>

          <Col xs={24} sm={8}>
            <InputNumero
              formItemProps={{
                label: 'Situação',
                name: 'situacao',
                style: { fontWeight: 'bold' },
              }}
              inputProps={{
                onChange: obterFiltros,
                id: CF_INPUT_SITUACAO_NOTIFICACAO,
                placeholder: 'Situação',
              }}
            />
          </Col>
        </Row>
        <DataTable
          filters={filters}
          columns={columns}
          dataSource={MOCK_DATA}
          onRow={(row) => ({
            onClick: () => {
              onClickEditar(row.codigo);
            },
          })}
        />
      </CardContent>
    </Form>
  );
};
