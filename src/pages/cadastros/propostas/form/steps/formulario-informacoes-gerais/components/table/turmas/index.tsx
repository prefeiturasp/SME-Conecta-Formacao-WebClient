import { Form, Input, Table, TablePaginationConfig, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { validateMessages } from '~/core/constants/validate-messages';
import { SelectDRECadastroPropostas } from '~/pages/cadastros/propostas/form/steps/formulario-informacoes-gerais/components/select-dre';

interface Item {
  id?: number;
  key: string;
  turma: string;
  dreId: number;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  children,
  ...restProps
}) => {
  const inputNode =
    dataIndex === 'dreId' ? (
      <SelectDRECadastroPropostas
        exibirOpcaoOutros={false}
        formItemProps={{
          label: '',
          required: false,
          style: { marginTop: 25 },
        }}
        selectProps={{ mode: undefined }}
      />
    ) : (
      <Input />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: dataIndex === 'turma',
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TabelaEditavel: React.FC = () => {
  const formProposta = Form.useFormInstance();

  const [formRow] = Form.useForm();
  const isEditing = (record: Item) => record.key === editingKey;

  const [editingKey, setEditingKey] = useState('');

  const quantidadeTurmas = Form.useWatch('quantidadeTurmas', formProposta);

  // TODO - Quando alterar remontar a tabela!
  // const alterouQtdTurmas = quantidadeTurmas && turmas?.length !== quantidadeTurmas;

  useEffect(() => {
    if (quantidadeTurmas) {
      const originData: Item[] = [];

      for (let i = 0; i < quantidadeTurmas; i++) {
        originData.push({
          key: i.toString(),
          turma: `Turma ${i}`,
          dreId: 0,
        });

        formProposta.setFieldValue('turmas', [...originData]);
      }
    } else {
      formProposta.setFieldValue('turmas', []);
    }
  }, [quantidadeTurmas, formProposta]);

  const pagination: TablePaginationConfig = {
    locale: { items_per_page: '' },
    hideOnSinglePage: true,
  };

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    formRow.setFieldsValue({ turma: '', dreId: undefined, ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    formRow.validateFields().then((row) => {
      const newData = formProposta.getFieldValue('turmas');

      const index = newData.findIndex((item: Item) => key === item.key);

      if (index > -1) {
        const item = newData[index];

        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        formProposta.setFieldValue('turmas', newData);

        setEditingKey('');
      } else {
        newData.push(row);
        formProposta.setFieldValue('turmas', newData);

        setEditingKey('');
      }
    });
  };

  const columns = [
    {
      title: 'Turma',
      dataIndex: 'turma',
      width: '20%',
      editable: true,
    },
    {
      title: 'DRE',
      dataIndex: 'dreId',
      editable: true,
      render: (dreId: any) => dreId,
    },
    {
      title: 'Operação',
      dataIndex: 'operacao',
      width: '15%',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Salvar
            </Typography.Link>
            <Typography.Link onClick={cancel}>Cancelar</Typography.Link>
          </span>
        ) : (
          <Typography.Link disabled={!!editingKey} onClick={() => edit(record)}>
            Editar
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        title: col.title,
        dataIndex: col.dataIndex,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0, marginTop: 0 }}>
      {(formTeste) => {
        const turmas: Item[] = formTeste?.getFieldValue('turmas');

        return (
          <Form form={formRow} component={false} validateMessages={validateMessages}>
            <Table
              rowKey='key'
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={turmas ? [...turmas] : []}
              columns={mergedColumns}
              rowClassName='editable-row'
              pagination={pagination}
              locale={{ emptyText: 'Sem dados' }}
            />
          </Form>
        );
      }}
    </Form.Item>
  );
};

export default TabelaEditavel;
