import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Table,
  TablePaginationConfig,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { SelectDRE } from '~/components/main/input/dre';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaTurmaFormDTO } from '~/core/dto/proposta-dto';
import { DreDTO } from '~/core/dto/retorno-listagem-dto';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  children: React.ReactNode;
  dres: any[];
  listaDres: any;
  tagsDres: React.ReactNode[];
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  children,
  dres,
  listaDres,
  ...restProps
}) => {
  const inputNode =
    dataIndex === 'dres' ? (
      <SelectDRE
        carregarDadosAutomaticamente={false}
        exibirOpcaoTodos
        formItemProps={{
          label: '',
          name: 'dres',
          initialValue: dres,
          style: { marginTop: 25 },
          rules: [
            {
              required: false,
            },
          ],
        }}
        selectProps={{
          mode: 'multiple',
          labelInValue: true,
          disabled: true,
          options: listaDres,
        }}
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

type TabelaEditavelProps = {
  listaDres: DreDTO[];
};

const TabelaEditavel: React.FC<TabelaEditavelProps> = ({ listaDres }) => {
  const [formRow] = Form.useForm();
  const formProposta = Form.useFormInstance();
  const quantidadeTurmas = Form.useWatch('quantidadeTurmas', formProposta);

  const [editingKey, setEditingKey] = useState<number | undefined>();
  const [editInValues, setEditInValues] = useState<PropostaTurmaFormDTO>();

  const values = formProposta.getFieldsValue(true);

  const isEditing = (record: PropostaTurmaFormDTO) => record.key === editingKey;
  const pagination: TablePaginationConfig = {
    locale: { items_per_page: '' },
    hideOnSinglePage: true,
  };

  useEffect(() => {
    const dres = values?.dres;

    if (quantidadeTurmas) {
      const originData: PropostaTurmaFormDTO[] = [];

      for (let i = 0; i < quantidadeTurmas; i++) {
        originData.push({
          key: i,
          nome: `Turma ${i + 1}`,
          id: undefined,
          dres,
          todos: false,
        });

        formProposta.setFieldValue('turmas', [...originData]);
      }
    } else {
      formProposta.setFieldValue('turmas', []);
    }
  }, [quantidadeTurmas]);

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
      width: '200px',
      editable: true,
    },
    {
      title: 'DRE',
      dataIndex: 'dres',
      editable: true,
      render: (dresExibicao: DreDTO[]) => {
        if (!dresExibicao?.length) return <></>;

        return (
          <Col>
            <Row gutter={[8, 8]}>
              {dresExibicao.map((dre: DreDTO, i: number) => (
                <Tag key={i}>{dre?.label}</Tag>
              ))}
            </Row>
          </Col>
        );
      },
    },
    {
      title: 'Operação',
      width: '200px',
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
      onCell: (record: PropostaTurmaFormDTO) => {
        return {
          record,
          align: col.align,
          title: col.title,
          dataIndex: col.dataIndex,
          dres: record.dres,
          editing: isEditing(record),
          listaDres,
        };
      },
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
