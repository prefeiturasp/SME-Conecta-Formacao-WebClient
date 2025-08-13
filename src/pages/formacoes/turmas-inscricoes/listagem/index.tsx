import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import React, { Key, useContext } from 'react';
import { MdOutlineFileDownload } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import DataTable from '~/components/lib/card-table';
import { IconButtonDataTable } from '~/components/main/button/icon-button-data-table';
import { DadosAnexosInscricaoDTO } from '~/core/dto/dados-anexos-inscricao-dto';
import { DadosListagemInscricaoDTO } from '~/core/dto/dados-listagem-inscricao-dto';
import arquivoService from '~/core/services/arquivo-service';
import { URL_INSCRICAO } from '~/core/services/inscricao-service';
import { downloadBlob } from '~/core/utils/functions';
import { FiltroTurmaInscricoesProps } from '..';
import { BtbAcoesListaIncricaoPorTurma } from './components/data-table-actions/botoes-acoes-linha';
import { BtbAcoesListaIncricaoPorTurmaLinhasSelecionadas } from './components/data-table-actions/botoes-acoes-linhas-selecionadas';
import { TurmasInscricoesListaPaginadaContext } from './provider';
interface TurmasInscricoesListaPaginadaProps {
  filters?: FiltroTurmaInscricoesProps;
  realizouFiltro?: boolean;
  alterarRealizouFiltro: (valor: boolean) => void;
}

export const TurmasInscricoesListaPaginada: React.FC<TurmasInscricoesListaPaginadaProps> = ({
  filters,
  realizouFiltro,
  alterarRealizouFiltro,
}) => {
  const params = useParams();
  const id = params.id;

  const { selectedRows, setSelectedRows } = useContext(TurmasInscricoesListaPaginadaContext);

  const selectedRowKeys: Key[] = selectedRows?.length
    ? selectedRows.map((item: DadosListagemInscricaoDTO) => item.inscricaoId)
    : [];

  const onClickDownload = async (anexos: DadosAnexosInscricaoDTO[]) => {
    for (const item of anexos) {
      if (item.codigo) {
        const resposta = await arquivoService.obterArquivoParaDownload(item.codigo);
        downloadBlob(resposta.data, item.nome);
      }
    }
  };

  const columns: ColumnsType<DadosListagemInscricaoDTO> = [
    { title: 'Turma', dataIndex: 'nomeTurma' },
    { title: 'Data/hora da inscrição', dataIndex: 'dataInscricao' },
    { title: 'RF', dataIndex: 'registroFuncional' },
    { title: 'CPF', dataIndex: 'cpf' },
    { title: 'Nome do cursista', dataIndex: 'nomeCursista' },
    { title: 'Cargo/Função Atividade', dataIndex: 'cargoFuncao' },
    { title: 'Origem', dataIndex: 'origem' },
    { title: 'Situação', dataIndex: 'situacao' },
    {
      title: 'Ações',
      align: 'center',
      width: '200px',
      render: (_, record) => <BtbAcoesListaIncricaoPorTurma record={record} />,
    },
    {
      title: 'Anexo',
      width: 80,
      render: (_, record) => {
        const temAnexo = record.anexos.length;

        return temAnexo ? (
          <IconButtonDataTable
            Icon={MdOutlineFileDownload}
            tooltipTitle='Baixar anexo'
            onClick={() => onClickDownload(record.anexos)}
          />
        ) : (
          'Sem anexo'
        );
      },
    },
  ];

  const onSelectChange = (_: any, rows: DadosListagemInscricaoDTO[]) => {
    setSelectedRows(rows);
  };

  const rowSelection: TableRowSelection<DadosListagemInscricaoDTO> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: DadosListagemInscricaoDTO) => ({
      disabled: !record.permissao.podeCancelar,
    }),
  };

  return (
    <>
      <BtbAcoesListaIncricaoPorTurmaLinhasSelecionadas selectedRows={selectedRows} />
      <DataTable
        rowKey='inscricaoId'
        rowSelection={rowSelection}
        url={`${URL_INSCRICAO}/${id}`}
        columns={columns}
        filters={filters}
        realizouFiltro={realizouFiltro}
        alterarRealizouFiltro={alterarRealizouFiltro}
      />
    </>
  );
};
