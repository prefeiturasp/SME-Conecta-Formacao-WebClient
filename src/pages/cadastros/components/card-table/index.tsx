import { SearchOutlined } from '@ant-design/icons';
import { Col, Empty, Input, Row, Select, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import CardContent from '~/components/lib/card-content';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import { AreaPromotoraTipoDTO } from '~/core/dto/area-promotora-tipo-dto';
import { useAppDispatch } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import areaPromotoraService from '~/core/services/area-promotora-service';
import { HttpStatusCode } from 'axios';

interface EstruturaDados {
  key: string;
  name: string;
  tipo: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
}

type TableCadastroProps = {
  dadosTabela: EstruturaDados[];
  colunasTabela: ColumnsType<EstruturaDados>;
};

const CardTableCadastros: React.FC<TableCadastroProps> = ({ dadosTabela, colunasTabela }) => {
  const { Option } = Select;

  const dispatch = useAppDispatch();

  const [listaTipos, setListaTipos] = useState<AreaPromotoraTipoDTO[]>();
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter'],
      locale: { items_per_page: '' },
      pageSizeOptions: [10, 20, 50, 100],
    },
  });

  const obterTipos = useCallback(() => {
    dispatch(setSpinning(true));
    areaPromotoraService
      .obterTipo()
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok) {
          setListaTipos(resposta.data);
        }
      })
      .catch(() => alert('erro ao obter meus dados'))
      .finally(() => dispatch(setSpinning(false)));
  }, [dispatch]);

  useEffect(() => {
    obterTipos();
  }, [obterTipos]);

  const handleTableChange = (pagination: TablePaginationConfig) =>
    setTableParams({
      pagination,
    });

  return (
    <CardContent>
      <Row gutter={[8, 16]}>
        <Col span={12}>
          <Input
            type='text'
            maxLength={100}
            placeholder='Nome'
            prefix={<SearchOutlined />}
            onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
              console.table((e.target as HTMLInputElement).value);
            }}
          />
        </Col>
        <Col span={12}>
          <Select
            allowClear
            style={{ width: '100%' }}
            placeholder='Selecione o Tipo'
            notFoundContent={<Empty description='Sem dados' />}
          >
            {listaTipos?.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.nome}
                </Option>
              );
            })}
          </Select>
        </Col>
      </Row>
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      <Table
        bordered
        columns={colunasTabela}
        dataSource={dadosTabela}
        onChange={handleTableChange}
        pagination={tableParams.pagination}
        locale={{ emptyText: <Empty description='Sem dados' /> }}
      />
    </CardContent>
  );
};

CardTableCadastros.propTypes = {
  dadosTabela: PropTypes.array.isRequired,
  colunasTabela: PropTypes.array.isRequired,
};

export default CardTableCadastros;
