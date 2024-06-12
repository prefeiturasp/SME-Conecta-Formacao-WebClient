import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import { AxiosError } from 'axios';
import queryString from 'query-string';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import api from '~/core/services/api';
import { scrollNoInicio } from '~/core/utils/functions';
import { openNotificationErrors } from '../notification';
import { DataTableContext } from './provider';

interface TableParams {
  pagination?: TablePaginationConfig;
}

type DataTableProps<T> = {
  filters?: any;
  realizouFiltro?: boolean;
  alterarRealizouFiltro?: (valor: boolean) => void;
  desativarBotaoContinuar?: any;
  url?: string;
} & TableProps<T>;

const DataTable = <T extends object>({
  filters,
  realizouFiltro,
  alterarRealizouFiltro,
  url,
  columns,
  desativarBotaoContinuar,
  rowKey = 'id',
  ...rest
}: DataTableProps<T>) => {
  const { setTableState } = useContext(DataTableContext);

  const [data, setData] = useState<T[]>([]);
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
      if (!url) return;
      setLoading(true);
      api
        .get<PaginacaoResultadoDTO<T[]>>(url, {
          headers: {
            numeroPagina: realizouFiltro ? 1 : newParams.pagination?.current,
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
            if (newParams?.pagination?.current)
              if (newParams?.pagination?.current == 1)
                newParams.pagination.current = realizouFiltro ? 1 : newParams.pagination?.current;
            if (desativarBotaoContinuar) desativarBotaoContinuar(response.data.sucesso);
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
        .catch((error: AxiosError<RetornoBaseDTO>) => {
          const mensagens = error?.response?.data?.mensagens?.length
            ? error?.response?.data?.mensagens
            : [];

          openNotificationErrors(mensagens);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [url, filters, realizouFiltro],
  );

  useEffect(() => {
    fetchData(tableParams);
    if (rest?.id !== 'EXPANDED_DATA_TABLE') {
      setTableState({
        reloadData: () => {
          fetchData(tableParams);
        },
      });
    }
  }, [JSON.stringify(filters), fetchData]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    alterarRealizouFiltro && alterarRealizouFiltro(false);
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

  const handleTableChangeDefaultTable = (pagination: TablePaginationConfig) => {
    const newParams = {
      ...tableParams,
      pagination,
    };

    setTableParams(newParams);
  };

  useEffect(() => {
    scrollNoInicio();
  }, [tableParams.pagination?.current, !tableParams.pagination?.pageSize]);

  useEffect(() => {
    if (rest.rowSelection?.onChange) {
      rest.rowSelection.onChange([], [], { type: 'all' });
    }
  }, [data]);

  return (
    <Table
      bordered
      rowKey={rowKey}
      size='small'
      columns={columns}
      loading={loading}
      pagination={tableParams.pagination}
      locale={{ emptyText: 'Sem dados' }}
      onChange={url ? handleTableChange : handleTableChangeDefaultTable}
      {...rest}
      dataSource={url ? data : rest.dataSource}
    />
  );
};

export default DataTable;
