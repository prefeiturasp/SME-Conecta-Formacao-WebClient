import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import api from '~/core/services/api';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import queryString from 'query-string';
import { PropostaRegenteDTO } from '~/core/dto/proposta-regente-dto';
import { formatterCPFMask } from '~/core/utils/functions';
interface TableParams {
  pagination?: TablePaginationConfig;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
} & TableProps<T>;

const DataTableProfissionalRegente = forwardRef(
  ({ filters, url, columns, ...rest }: DataTableProps<PropostaRegenteDTO>, ref) => {
    const [data, setData] = useState<PropostaRegenteDTO[]>();
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
        .get<PaginacaoResultadoDTO<PropostaRegenteDTO[]>>(url, {
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
            for (let index = 0; index < response.data.items.length; index++) {
              const nomeSeparados = response.data.items[index].nomesTurmas.split(',');
              const totalNome = nomeSeparados.length - 12;
              const nomeComSlice = nomeSeparados.slice(0, 12);

              if (totalNome > 0) nomeComSlice.push(` + ${totalNome} Turmas`);
              const nomesJoin = nomeComSlice.join(',');
              response.data.items[index].nomesTurmas = nomesJoin;
              response.data.items[index].cpf = response.data.items[index].cpf
                ? formatterCPFMask(response.data.items[index].cpf)
                : '';
            }
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

DataTableProfissionalRegente.displayName = 'DataTableProfissionalRegente';

export default DataTableProfissionalRegente;
