import { useEffect, useState } from 'react';

import { Table } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd/es/table';
import queryString from 'query-string';
import ButtonOrdenacao from '~/components/main/button/ordenacao';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import { TipoOrdenacaoEnum } from '~/core/enum/tipo-ordenacao';
import api from '~/core/services/api';

interface TableParams {
  pagination?: TablePaginationConfig;
  order?: TipoOrdenacaoEnum;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
} & TableProps<T>;

const DataTableOrdenacao = <T extends object>({
  filters,
  url,
  columns,
  ...rest
}: DataTableProps<T>) => {
  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      locale: { items_per_page: '' },
      disabled: false,
      pageSizeOptions: [10, 20, 50, 100],
    },
    order: TipoOrdenacaoEnum.DATA,
  });

  const fetchData = (newParams: TableParams) => {
    setLoading(true);
    const urlQuery = `${url}?numeroPagina=${newParams?.pagination?.current}&numeroRegistros=${newParams?.pagination?.pageSize}&ordenacao=${newParams.order}`;

    api
      .get<PaginacaoResultadoDTO<T[]>>(urlQuery, {
        params: filters,
        paramsSerializer: {
          serialize: (params) => {
            return queryString.stringify(params, {
              arrayFormat: 'bracket',
              skipEmptyString: true,
              skipNull: true,
            });
          },
        },
      })
      .then((response) => {
        if (response?.data.items) {
          setData(response.data.items);
          setTableParams({
            ...newParams,
            pagination: {
              ...newParams.pagination,
              total: response.data.totalRegistros,
            },
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(tableParams);
  }, [JSON.stringify(filters)]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const newParams = {
      ...tableParams,
      pagination,
    };

    setTableParams(newParams);

    fetchData(newParams);

    if (pagination.pageSize !== newParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const onClickOrdenar = (ordenacaoNova: TipoOrdenacaoEnum) => {
    const newParams = {
      ...tableParams,
      order: ordenacaoNova,
    };

    setTableParams(newParams);

    fetchData(newParams);
  };

  return (
    <>
      <ButtonOrdenacao onClick={onClickOrdenar} />
      <Table
        columns={columns}
        rowKey='id'
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        bordered
        locale={{ emptyText: 'Sem dados' }}
        size='small'
        {...rest}
      />
    </>
  );
};

export default DataTableOrdenacao;
