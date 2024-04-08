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
import { cloneDeep } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { SelectDRE } from '~/components/main/input/dre';
import { validateMessages } from '~/core/constants/validate-messages';
import { PropostaTurmaFormDTO } from '~/core/dto/proposta-dto';
import { DreDTO } from '~/core/dto/retorno-listagem-dto';
import { SituacaoProposta } from '~/core/enum/situacao-proposta';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  children: React.ReactNode;
  dres: DreDTO[];
  listaDres: any;
  todosSelecionado: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  children,
  dres,
  listaDres,
  todosSelecionado,
  ...restProps
}) => {
  let inputNode = <Input />;

  if (dataIndex === 'dres') {
    const options = cloneDeep(listaDres);

    inputNode = (
      <SelectDRE
        carregarDadosAutomaticamente={false}
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
          disabled: !todosSelecionado,
          options,
        }}
      />
    );
  } else if (dataIndex === 'nome') {
    inputNode = <Input maxLength={200} />;
  }

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

  const situacaoProposta = formProposta.getFieldValue('situacao');

  const { desabilitarCampos } = useContext(PermissaoContext);

  const quantidadeTurmasOriginal = formProposta.getFieldValue('quantidadeTurmasOriginal');
  const quantidadeTurmas = Form.useWatch('quantidadeTurmas', formProposta);
  const dresWatch = Form.useWatch('dres', formProposta);

  const [editingKey, setEditingKey] = useState<number | undefined>();
  const [editInValues, setEditInValues] = useState<PropostaTurmaFormDTO>();

  const newDresTurmas: DreDTO[] = dresWatch?.length ? dresWatch : [];

  const isEditing = (record: PropostaTurmaFormDTO) => record.key === editingKey;

  const pagination: TablePaginationConfig = {
    locale: { items_per_page: '' },
    hideOnSinglePage: true,
  };

  useEffect(() => {
    const quantidadeTurmasEmEdicao = formProposta.isFieldTouched('quantidadeTurmas');

    if (quantidadeTurmasEmEdicao) {
      if (quantidadeTurmas) {
        const currentTurmas: PropostaTurmaFormDTO[] = formProposta.getFieldValue('turmas') || [];
        const novaQuantidade = Number(quantidadeTurmas);
        const currentLength = currentTurmas?.length;

        if (
          (situacaoProposta !== SituacaoProposta.Publicada &&
            situacaoProposta !== SituacaoProposta.Alterando &&
            novaQuantidade <= currentLength) ||
          ((situacaoProposta === SituacaoProposta.Publicada ||
            situacaoProposta === SituacaoProposta.Alterando) &&
            novaQuantidade <= currentLength &&
            novaQuantidade >= quantidadeTurmasOriginal)
        ) {
          const newTurmas = currentTurmas.slice(0, novaQuantidade);
          formProposta.setFieldValue('turmas', [...newTurmas]);
        } else {
          const adicionaQuantidade = novaQuantidade - currentLength;

          const novasTurmas = Array.from({ length: adicionaQuantidade }, (_, i) => {
            return {
              key: currentLength + i,
              nome: `Turma ${currentLength + i + 1}`,
              id: undefined,
              dres: formProposta.getFieldValue('dres'),
            };
          });

          formProposta.setFieldValue('turmas', [...currentTurmas, ...novasTurmas]);
        }
      } else {
        if (
          situacaoProposta !== SituacaoProposta.Publicada &&
          situacaoProposta !== SituacaoProposta.Alterando
        ) {
          formProposta.setFieldValue('turmas', []);
        }
      }
    }
  }, [quantidadeTurmas]);

  useEffect(() => {
    const dresEmEdicao = formProposta.isFieldTouched('dres');
    if (dresEmEdicao) {
      const turmas: PropostaTurmaFormDTO[] = formProposta.getFieldValue('turmas');

      if (turmas?.length) {
        const newTurmas = turmas.map((turma) => ({
          ...turma,
          dres: newDresTurmas,
        }));

        formProposta.setFieldValue('turmas', [...newTurmas]);
      }
    }
  }, [dresWatch]);

  const edit = (record: PropostaTurmaFormDTO) => {
    let dresEdicao = Array<DreDTO>();

    if (record.dres?.length) {
      dresEdicao = record.dres?.length > 1 ? record.dres?.filter((dre) => !dre.todos) : record.dres;
      record.dres = dresEdicao;
    }
    if (record && dresEdicao) {
      setEditInValues({ ...record, dres: dresEdicao });
      setEditingKey(record.key);
    }
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
      editable: true,
      width: '40%',
      render: (turmaNome: string) => (
        <div style={{ wordBreak: 'break-word', width: 380 }}>{turmaNome}</div>
      ),
    },
    {
      title: 'DRE',
      dataIndex: 'dres',
      editable: true,
      width: '40%',
      render: (dresExibicao: DreDTO[]) => {
        if (!dresExibicao?.length) return <></>;
        const filteredDres =
          dresExibicao?.length > 1 ? dresExibicao.filter((dre) => !dre.todos) : dresExibicao;
        return (
          <Col>
            <Row gutter={[8, 8]}>
              {filteredDres.map((dre: DreDTO, i: number) => (
                <Tag key={i}>{dre?.label}</Tag>
              ))}
            </Row>
          </Col>
        );
      },
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
            <Button
              type='primary'
              size='small'
              disabled={!!editingKey || editingKey === 0 || desabilitarCampos}
            >
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
        const todosSelecionado = dresWatch?.find((dre: DreDTO) => dre?.todos);
        return {
          record,
          align: col.align,
          title: col.title,
          dataIndex: col.dataIndex,
          dres: record.dres,
          editing: isEditing(record),
          listaDres,
          todosSelecionado,
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
