import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import api from '~/core/services/api';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import queryString from 'query-string';
import { PropostaEncontroPaginadoDTO } from '~/core/dto/proposta-encontro-dto';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { TipoEncontro } from '~/core/enum/tipo-encontro';

interface TableParams {
  pagination?: TablePaginationConfig;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
} & TableProps<T>;

const DataTableEncontros = forwardRef(
  ({ filters, url, columns, ...rest }: DataTableProps<CronogramaEncontrosPaginadoDto>, ref) => {
    const [data, setData] = useState<CronogramaEncontrosPaginadoDto[]>();
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
        .get<PaginacaoResultadoDTO<PropostaEncontroPaginadoDTO[]>>(url, {
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
            montarDtoRetorno(response.data.items);
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
    const montarDtoRetorno = (lista: PropostaEncontroPaginadoDTO[]) => {
      const encontros = Array<CronogramaEncontrosPaginadoDto>();
      for (const item of lista) {
        const listaDatasFormatadas = Array<string>();

        const listaFilrada = lista.filter((x) => x.id == item.id);
        listaFilrada.forEach((valores) => {
          valores.cronogramaDatas.forEach((d) => {
            listaDatasFormatadas.push(new Date(d.data).toLocaleDateString());
          });
        });

        const turmaIds = item.turmas.map((t) => t.turmaId);
        const turmasLista = item.turmas.map((t) => t.nome);
        const totalTurmasSemExibir = turmasLista.length - 12;
        const listaTurmasFormatadas = Array<string>();
        turmasLista.slice(0, 12).forEach((turma) => {
          listaTurmasFormatadas.push(`${turma}`);
        });
        if (totalTurmasSemExibir > 0)
          listaTurmasFormatadas.push(` + ${totalTurmasSemExibir} turmas`);

        const primeiraData = item.cronogramaDatas[0];
        const horaInicioStr = primeiraData?.horaInicio ?? '';
        const horaFimStr = primeiraData?.horaFim ?? '';

        const horaDataInicial = new Date();
        horaDataInicial.setHours(parseInt(horaInicioStr.substring(0, 2)));
        horaDataInicial.setMinutes(parseInt(horaInicioStr.substring(3, 5)));

        const horaDataFinal = new Date();
        horaDataFinal.setHours(parseInt(horaFimStr.substring(0, 2)));
        horaDataFinal.setMinutes(parseInt(horaFimStr.substring(3, 5)));

        const cronograma: CronogramaEncontrosPaginadoDto = {
          id: item.id!,
          turmasId: turmaIds,
          horarios: [horaDataInicial, horaDataFinal],
          turmas: listaTurmasFormatadas.join(', '),
          datas: listaDatasFormatadas.join(', '),
          datasPeriodos: item.cronogramaDatas,
          horaInicio: horaInicioStr,
          horaFim: horaFimStr,
          hora: `${horaInicioStr} até ${horaFimStr}`,
          tipoEncontro: item.tipo,
          tipoEncontroDescricao: obteTipoEncontroTexto(item.tipo!),
          local: item.local!,
        };
        encontros.push(cronograma);
      }
      setData(encontros);
    };
    const obteTipoEncontroTexto = (tipoEncontro: TipoEncontro) => {
      switch (tipoEncontro) {
        case TipoEncontro.Assincrono:
          return 'Assíncrono';
        case TipoEncontro.Sincrono:
          return 'Síncrono';
        case TipoEncontro.Presencial:
          return 'Presencial';
        default:
          return '';
      }
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

DataTableEncontros.displayName = 'DataTableEncontros';

export default DataTableEncontros;
