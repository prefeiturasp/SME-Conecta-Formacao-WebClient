import { Form, Input, Table, TablePaginationConfig, Typography } from 'antd';
import React, { useState } from 'react';
import { validateMessages } from '~/core/constants/validate-messages';
import { SelectDRECadastroPropostas } from '~/pages/cadastros/propostas/form/steps/formulario-informacoes-gerais/components/select-dre';

interface Item {
  key: string;
  turma: string;
  dreIdPropostas: string[];
}

const originData: Item[] = [];
for (let i = 0; i < 20; i++) {
  originData.push({
    key: i.toString(),
    turma: `Turma ${i}`,
    dreIdPropostas: [],
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    dataIndex === 'dreIdPropostas' ? (
      <SelectDRECadastroPropostas
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
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const pagination: TablePaginationConfig = {
    locale: { items_per_page: '' },
    hideOnSinglePage: true,
  };

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ turma: '', dreIdPropostas: [], ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
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
      dataIndex: 'dreIdPropostas',
      editable: true,
      render: (dre: any) => dre?.label,
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
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false} validateMessages={validateMessages}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={pagination}
        locale={{ emptyText: 'Sem dados' }}
      />
    </Form>
  );
};

export default TabelaEditavel;
