import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import queryString from 'query-string';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import api from '~/core/services/api';
import { DataTableContext } from './provider';

interface TableParams {
  pagination?: TablePaginationConfig;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
} & TableProps<T>;

const DataTable = <T extends object>({ filters, url, columns, ...rest }: DataTableProps<T>) => {
  const { setTableState } = useContext(DataTableContext);

  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      position: ['bottomCenter'],
      locale: { items_per_page: '' },
      disabled: false,
      pageSizeOptions: [10, 20, 50, 100],
    },
  });

  const fetchData = useCallback(
    (newParams: TableParams) => {
      setLoading(true);

      api
        .get<PaginacaoResultadoDTO<T[]>>(url, {
          headers: {
            numeroPagina: newParams.pagination?.current,
            numeroRegistros: newParams.pagination?.pageSize,
          },
          params: filters,
          paramsSerializer: {
            serialize: (params) => {
              return queryString.stringify(params, {
                skipNull: true,
                skipEmptyString: true,
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
    },
    [url, filters],
  );
  useEffect(() => {
    fetchData(tableParams);
    setTableState({
      reloadData: () => {
        fetchData(tableParams);
      },
    });
  }, [JSON.stringify(filters), fetchData]);

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

  return (
    <Table
      bordered
      rowKey='id'
      size='small'
      dataSource={data}
      columns={columns}
      loading={loading}
      onChange={handleTableChange}
      pagination={tableParams.pagination}
      locale={{ emptyText: 'Sem dados' }}
      {...rest}
    />
  );
};

export default DataTable;
