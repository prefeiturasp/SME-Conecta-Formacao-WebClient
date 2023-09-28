import { Table } from 'antd';
import { TablePaginationConfig, TableProps } from 'antd/es/table';
import { useState, useEffect } from 'react';
import api from '~/core/services/api';
import { PaginacaoResultadoDTO } from '~/core/dto/paginacao-resultado-dto';
import queryString from 'query-string';
import { PropostaEncontroDTO } from '~/core/dto/proposta-encontro-dto';
import { CronogramaEncontrosPaginadoDto } from '~/core/dto/cronograma-encontros-paginado-dto';
import { TipoEncontro } from '~/core/enum/tipo-encontro';

interface TableParams {
  pagination?: TablePaginationConfig;
}

type DataTableProps<T> = {
  filters?: any;
  url: string;
} & TableProps<T>;

const DataTableEncontros = ({
  filters,
  url,
  columns,
  ...rest
}: DataTableProps<CronogramaEncontrosPaginadoDto>) => {
  const [data, setData] = useState<CronogramaEncontrosPaginadoDto[]>();
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
      .get<PaginacaoResultadoDTO<PropostaEncontroDTO[]>>(url, {
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
  const montarDtoRetorno = (lista: PropostaEncontroDTO[]) => {
    const encontros = Array<CronogramaEncontrosPaginadoDto>();
    for (let index = 0; index < lista.length; index++) {
      const listaDatasFormatadas = Array<string>();

      const listaFilrada = lista.filter((x) => x.id == lista[index].id);
      listaFilrada.forEach((valores) => {
        valores.datas.forEach((d) => {
          const inicio = new Date(d.dataInicio).toLocaleDateString();
          const final = d.dataFim ? new Date(d.dataFim).toLocaleDateString() : '';
          const dataFormatada = final ? `${inicio} até ${final}` : inicio;
          listaDatasFormatadas.push(dataFormatada);
        });
      });
      const turmasLista = lista[index].turmas.map((t) => t.turma);
      const listaTurmasFormatadas = Array<string>();
      turmasLista.forEach((turma) => {
        listaTurmasFormatadas.push(`Turma ${turma}`);
      });
      const horaInicio = lista[index].horaInicio!.substring(0, 2);
      const minutoInicio = lista[index].horaInicio!.substring(3, 5);
      const horaDataInicial = new Date();
      horaDataInicial.setHours(parseInt(horaInicio));
      horaDataInicial.setMinutes(parseInt(minutoInicio));

      const horaFim = lista[index].horaFim!.substring(0, 2);
      const minutoFim = lista[index].horaFim!.substring(3, 5);
      const horaDataFinal = new Date();
      horaDataFinal.setHours(parseInt(horaFim));
      horaDataFinal.setMinutes(parseInt(minutoFim));

      const cronograma: CronogramaEncontrosPaginadoDto = {
        id: lista[index].id!,
        turmasId: turmasLista,
        horarios: [horaDataInicial, horaDataFinal],
        turmas: listaTurmasFormatadas.join(', '),
        datas: listaDatasFormatadas.join(', '),
        datasPeriodos: lista[index].datas,
        horaInicio: lista[index].horaInicio!,
        horaFim: lista[index].horaFim!,
        hora: `${lista[index].horaInicio!} até ${lista[index].horaFim!}`,
        tipoEncontro: lista[index].tipo,
        tipoEncontroDescricao: obteTipoEncontroTexto(lista[index].tipo!),
        local: lista[index].local!,
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

export default DataTableEncontros;
