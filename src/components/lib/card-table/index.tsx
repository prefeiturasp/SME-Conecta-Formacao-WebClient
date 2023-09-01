import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import { useState, useEffect } from 'react';
import api from '~/core/services/api';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import queryString from 'query-string';

interface TableParams {
  pagination?: TablePaginationConfig;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
} & TableProps<T>;

const DataTable = <T extends object>({ filters, url, columns, ...rest }: DataTableProps<T>) => {
  const [data, setData] = useState<T[]>();
  const [loading, setLoading] = useState(false);
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

  const fetchData = () => {
    setLoading(true);
    api
      .get<PaginacaoResultadoDTO<T[]>>(url, {
        headers: {
          numeroPagina: tableParams.pagination?.current,
          numeroRegistros: tableParams.pagination?.pageSize,
        },
        params: filters,
        paramsSerializer: {
          serialize: (params) => {
            return queryString.stringify(params, {
              skipNull: true,
              skipEmptyString: true,
              arrayFormat: 'bracket',
            });
          },
        },
      })
      .then((response) => {
        if (response?.data.items) {
          setData(response.data.items);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: response.data.totalRegistros,
            },
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams), JSON.stringify(filters)]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTableParams({
      ...tableParams,
      pagination,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
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
