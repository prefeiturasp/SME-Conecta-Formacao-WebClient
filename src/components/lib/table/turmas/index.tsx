import React, { useContext, useEffect, useRef, useState } from 'react';
import type { InputRef, TablePaginationConfig } from 'antd';
import { Button, Form, Input, Popconfirm, Select, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { OpcaoListagem } from '~/core/enum/opcao-listagem';
import { SelectDRECadastroPropostas } from '~/pages/cadastros/propostas/form/steps/formulario-informacoes-gerais/components/select-dre';
import { SelectDRE } from '~/components/main/input/dre';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} é obrigatório.`,
          },
        ]}
      >
        {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
        <SelectDRE formItemProps={{label: ''}} selectProps={{
          ref: inputRef
        }}  />
      </Form.Item>
    ) : (
      <div className='editable-cell-value-wrap' style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  dre: number
}

interface TableParams {
  pagination?: TablePaginationConfig;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const TabelaEditavel: React.FC = () => {
  const form = Form.useFormInstance();
  const dreIdPropostas = Form?.useWatch('dreIdPropostas', form);
  const quantidadeTurmas = Form?.useWatch('quantidadeTurmas', form);




  const [count, setCount] = useState(1);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
          locale: { items_per_page: '' },
          hideOnSinglePage: true
        },
      });


  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: 'Turma',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: 'DRE',
      dataIndex: 'dre',
      editable: dreIdPropostas?.value === 1,
      // editable: dreIdPropostas === OpcaoListagem.Todos,
    },
  ];

 

  const adicionarRemoverLinhas = () => {
    if (quantidadeTurmas) {
      const novasLinhas: DataType[] = [];
      for (let i = 0; i < quantidadeTurmas; i++) {
        const newData: DataType = {
          key: count + i,
          name: `Turma ${count + i}`,
          dre: dreIdPropostas?.label
        };
        novasLinhas.push(newData);
      }


        setDataSource([...dataSource, ...novasLinhas]);
        setCount(count + quantidadeTurmas);
      
    } else if (quantidadeTurmas <= 0 || quantidadeTurmas === undefined) {
      setDataSource([]);
      setCount(1);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      adicionarRemoverLinhas();
    }, 500);
  }, [quantidadeTurmas]);
  
  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        locale={{ emptyText: 'Sem dados' }}
              pagination={tableParams.pagination}
      />
    </div>
  );
};

export default TabelaEditavel;
