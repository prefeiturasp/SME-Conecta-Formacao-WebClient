import { Form, Input, Table, TablePaginationConfig, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { SelectDRE } from '~/components/main/input/dre';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaTurmaFormDTO } from '~/core/dto/proposta-dto';

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
    dataIndex === 'dreNome' ? (
      <SelectDRE
        formItemProps={{
          label: '',
          name: 'dre',
          required: false,
          style: { marginTop: 25 },
        }}
        selectProps={{ mode: undefined, labelInValue: true }}
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
              required: dataIndex === 'nome',
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
  const [formRow] = Form.useForm();
  const formProposta = Form.useFormInstance();
  const quantidadeTurmas = Form.useWatch('quantidadeTurmas', formProposta);

  const [editingKey, setEditingKey] = useState<number | undefined>();
  const [editInValues, setEditInValues] = useState<PropostaTurmaFormDTO>();

  const isEditing = (record: PropostaTurmaFormDTO) => record.key === editingKey;
  const pagination: TablePaginationConfig = {
    locale: { items_per_page: '' },
    hideOnSinglePage: true,
  };

  // TODO - Quando alterar remontar a tabela!
  // const alterouQtdTurmas = quantidadeTurmas && turmas?.length !== quantidadeTurmas;

  useEffect(() => {
    if (formProposta.isFieldTouched('quantidadeTurmas')) {
      if (quantidadeTurmas) {
        const originData: PropostaTurmaFormDTO[] = [];
        for (let i = 0; i < quantidadeTurmas; i++) {
          originData.push({
            key: i,
            nome: `Turma ${i}`,
            id: undefined,
            dreId: undefined,
            dreNome: '',
          });

          formProposta.setFieldValue('turmas', [...originData]);
        }
      } else {
        formProposta.setFieldValue('turmas', []);
      }
    }
  }, [quantidadeTurmas, formProposta]);

  const edit = (record: PropostaTurmaFormDTO) => {
    setEditInValues({ ...record });
    setEditingKey(record.key);
  };

  useEffect(() => {
    formRow.resetFields();
  }, [formRow, editInValues]);

  const cancel = () => setEditingKey(undefined);

  const save = async (key: React.Key) => {
    formRow.validateFields().then((row) => {
      const newData: PropostaTurmaFormDTO[] = formProposta.getFieldValue('turmas');
      const index = newData.findIndex((item: PropostaTurmaFormDTO) => key === item.key);
      if (index > -1) {
        const item = newData[index];

        newData.splice(index, 1, {
          ...item,
          ...row,
          dreId: row?.dre?.value,
          dreNome: row?.dre?.label,
        });

        formProposta.setFieldValue('turmas', [...newData]);

        cancel();
      }
    });
  };

  const columns = [
    {
      title: 'Turma',
      dataIndex: 'nome',
      width: '20%',
      editable: true,
    },
    {
      title: 'DRE',
      dataIndex: 'dreNome',
      editable: true,
    },
    {
      title: 'Operação',
      width: '20%',
      render: (_: any, record: PropostaTurmaFormDTO) => {
        const editable = isEditing(record);

        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Salvar
            </Typography.Link>
            <Typography.Link onClick={cancel}>Cancelar</Typography.Link>
          </span>
        ) : (
          <Typography.Link disabled={!!editingKey || editingKey === 0} onClick={() => edit(record)}>
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
      onCell: (record: PropostaTurmaFormDTO) => ({
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
        const turmas: PropostaTurmaFormDTO[] = formTeste?.getFieldValue('turmas');
        const dataSource = turmas?.length ? turmas : [];
        return (
          <Form
            form={formRow}
            component={false}
            validateMessages={validateMessages}
            initialValues={editInValues}
          >
            <Table
              rowKey='key'
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={dataSource}
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
