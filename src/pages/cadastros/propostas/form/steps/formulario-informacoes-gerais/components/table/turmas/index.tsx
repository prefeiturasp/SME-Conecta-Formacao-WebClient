import { Button, Flex, Form, Input, Table, TablePaginationConfig, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SelectDRE } from '~/components/main/input/dre';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaTurmaFormDTO } from '~/core/dto/proposta-dto';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  children: React.ReactNode;
  dreTodos: boolean;
  dresIds: any;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  children,
  dreTodos,
  dresIds,
  ...restProps
}) => {
  const inputNode =
    dataIndex === 'dreNome' ? (
      <SelectDRE
        labelInValue
        exibirOpcaoTodos
        formItemProps={{
          label: '',
          name: 'dre',
          initialValue: dresIds,
          style: { marginTop: 25 },
          rules: [
            {
              required: false,
            },
          ],
        }}
        selectProps={{ mode: 'multiple', labelInValue: true, disabled: dreTodos }}
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
  const paramsRoute = useParams();
  const [formRow] = Form.useForm();
  const formProposta = Form.useFormInstance();
  const quantidadeTurmas = Form.useWatch('quantidadeTurmas', formProposta);

  const [editingKey, setEditingKey] = useState<number | undefined>();
  const [setarDreAutomatica, setSetarDreAutomatica] = useState();
  const [editInValues, setEditInValues] = useState<PropostaTurmaFormDTO>();

  const id = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const isEditing = (record: PropostaTurmaFormDTO) => record.key === editingKey;
  const pagination: TablePaginationConfig = {
    locale: { items_per_page: '' },
    hideOnSinglePage: true,
  };

  // TODO - Quando alterar remontar a tabela!
  // const alterouQtdTurmas = quantidadeTurmas && turmas?.length !== quantidadeTurmas;

  //TODO - Validar quando a DRE da proposta tiver com a OPCAO TODOS, habilitar o select na tabela

  useEffect(() => {
    // if (formProposta.isFieldTouched('quantidadeTurmas')) {
    const dresAutomaticas = formProposta.getFieldValue('dres');
    const turmas = formProposta.getFieldValue('turmas');
    // obterDREVinculada(dresAutomaticas);

    if (quantidadeTurmas) {
      const originData: PropostaTurmaFormDTO[] = [];
      for (let i = 0; i < quantidadeTurmas; i++) {
        const turma = turmas?.[i];
        const existeTurma = id && turma;

        originData.push({
          key: existeTurma ? turma.key : i,
          nome: existeTurma ? turma.nome : `Turma ${i + 1}`,
          id: existeTurma ? turma.id : undefined,
          dresIds: existeTurma
            ? turma?.dres?.map((item: any) => item.dreId)
            : dresAutomaticas.map((item: any) => item.value),
          dreNome: existeTurma
            ? turma?.dres?.map((item: any) => item.nome)
            : dresAutomaticas.map((item: any) => item.label),
          todos: dresAutomaticas.map((item: any) => item.todos),
        });

        formProposta.setFieldValue('turmas', [...originData]);
      }
    } else {
      formProposta.setFieldValue('turmas', []);
    }
    // }
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
      align: 'center' as const,
      render: (_: any, record: PropostaTurmaFormDTO) => {
        const editable = isEditing(record);

        return editable ? (
          <Flex gap={2}>
            <Typography onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              <Button type='primary' size='small'>
                Salvar
              </Button>
            </Typography>
            <Typography onClick={cancel}>
              <Button type='default' size='small'>
                Cancelar
              </Button>
            </Typography>
          </Flex>
        ) : (
          <Typography onClick={() => edit(record)}>
            <Button type='primary' size='small' disabled={!!editingKey || editingKey === 0}>
              Editar
            </Button>
          </Typography>
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
        align: col.align,
        title: col.title,
        dataIndex: col.dataIndex,
        dreTodos: record.todos,
        dresIds: record.dresIds,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form.Item shouldUpdate style={{ marginBottom: 0, marginTop: 0 }}>
      {(formItem) => {
        const turmas: PropostaTurmaFormDTO[] = formItem?.getFieldValue('turmas');
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
