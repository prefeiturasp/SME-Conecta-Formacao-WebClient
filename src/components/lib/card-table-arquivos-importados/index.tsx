import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import queryString from 'query-string';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ArquivoInscricaoImportadoDTO } from '~/core/dto/arquivo-inscricao-importado-dto';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import api from '~/core/services/api';

interface TableParams {
  pagination?: TablePaginationConfig;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
} & TableProps<T>;

const DataTableArquivosImportados = forwardRef(
  ({ filters, url, columns, ...rest }: DataTableProps<ArquivoInscricaoImportadoDTO>, ref) => {
    const [data, setData] = useState<ArquivoInscricaoImportadoDTO[]>();
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

    const fetchData = () => {
      setLoading(true);
      api
        .get<PaginacaoResultadoDTO<ArquivoInscricaoImportadoDTO[]>>(url, {
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

    useImperativeHandle(
      ref,
      () => {
        return {
          reloadTable() {
            fetchData();
          },
        };
      },
      [url, fetchData],
    );

    return (
      <Table
        ref={ref as any}
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
  },
);

DataTableArquivosImportados.displayName = 'DataTableArquivosImportados';

export default DataTableArquivosImportados;
