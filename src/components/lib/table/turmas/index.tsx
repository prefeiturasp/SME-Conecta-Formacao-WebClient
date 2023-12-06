import type { InputRef } from 'antd';
import { Form, Input, Table } from 'antd';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { EditableContext, EditarLinhaTabela } from '../provider';

interface Item {
  key: string;
  nome: string;
}
interface EditarCelulaProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditarCelula: React.FC<EditarCelulaProps> = ({
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
      // const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record });
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
            message: `${title} é obrigatório`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
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
  nome: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const TabelaEditavel: React.FC = () => {
  const form = Form.useFormInstance();
  const quantidadeTurmas = Form?.useWatch('quantidadeTurmas', form);

  const [indexTurmas, setIndexTurmas] = useState<number>(1);
  const [dataSource, setDataSource] = useState<DataType[]>([]);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      editable: true,
      title: 'Turmas',
      dataIndex: 'nome',
    },
  ];

  const adicionarRemoverLinhas = () => {
    if (quantidadeTurmas) {
      const novasLinhas: DataType[] = [];
      for (let i = 0; i < quantidadeTurmas; i++) {
        const newData: DataType = {
          id: indexTurmas + i,
          nome: `Turma ${indexTurmas + i}`,
        };
        novasLinhas.push(newData);
      }
      setDataSource([...dataSource, ...novasLinhas]);
      setIndexTurmas(indexTurmas + quantidadeTurmas);
    } else if (quantidadeTurmas <= 0) {
      setDataSource([]);
      setIndexTurmas(1);
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
      row: EditarLinhaTabela,
      cell: EditarCelula,
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
    <Table
      bordered
      dataSource={dataSource}
      components={components}
      columns={columns as ColumnTypes}
      rowClassName={() => 'editable-row'}
      locale={{ emptyText: 'Sem dados' }}
    />
  );
};

export default TabelaEditavel;
