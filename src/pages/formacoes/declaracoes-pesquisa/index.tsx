import {
  Col,
  Form,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import { notification } from '~/components/lib/notification';
import { CF_SELECT_DRE } from '~/core/constants/ids/select';
import { TipoDeclaracao, TipoDeclaracaoDescricao } from '~/core/enum/tipo-declaracao';
import {
  CodafDeclaracaoDTO,
  obterDeclaracoesCodaf,
  downloadDeclaracoesLote,
} from '~/core/services/codaf-declaracao-service';
import { downloadDeclaracao } from '~/core/services/codaf-lista-presenca-service';
import { obterDetalhesPropostaComTurmasPorId } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { TipoEmissorEnum } from '~/core/enum/tipo-emissor';
import TabelaPesquisaDocumentos from '../components/tabela-pesquisa-documentos';
import CabecalhoPesquisaDocumentos from '../components/cabecalho-pesquisa-documentos';
import FiltrosPesquisaDocumentos from '../components/filtros-pesquisa-documentos';
import { usePesquisaDocumentos } from '../components/use-pesquisa-documentos';

const DeclaracoesPesquisa: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [turmasProposta, setTurmasProposta] = useState<RetornoListagemDTO[]>([]);

  const tipoDeclaracaoSelecionado = Form.useWatch('tipoDeclaracao', form);
  const rfCursistaDisabled = tipoDeclaracaoSelecionado === TipoDeclaracao.Regente;
  const rfRegenteDisabled = tipoDeclaracaoSelecionado === TipoDeclaracao.Cursista;

  React.useEffect(() => {
    if (rfCursistaDisabled) {
      form.setFieldValue('rfOuCpfCursista', undefined);
    }
    if (rfRegenteDisabled) {
      form.setFieldValue('rfRegente', undefined);
    }
  }, [rfCursistaDisabled, rfRegenteDisabled, form]);

  const columns: ColumnsType<CodafDeclaracaoDTO> = [
    {
      key: 'codigoDeclaracao',
      title: 'Código da declaração',
      dataIndex: 'codigoDeclaracao',
      width: 155,
    },
    {
      key: 'nomeFormacao',
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
      width: 500,
      ellipsis: true,
    },
    {
      key: 'nomeCursista',
      title: 'Nome do participante',
      dataIndex: 'nomeCursista',
      render: (_: any, record: CodafDeclaracaoDTO) => record.nomeCursista ?? record.nomeRegente,
      width: 500,
      ellipsis: true,
    },
    {
      key: 'tipoDeclaracao',
      title: 'Tipo de declaração',
      dataIndex: 'tipoDeclaracao',
      width: 230,
      render: (value: TipoDeclaracao) => TipoDeclaracaoDescricao[value] ?? '-',
    },
    {
      key: 'documentoCursista',
      title: 'RF ou CPF',
      dataIndex: 'documentoCursista',
      render: (_: any, record: CodafDeclaracaoDTO) => record.documentoCursista ?? record.documentoRegente,
      width: 190,
    },
    {
      key: 'dataEmissao',
      title: 'Data de emissão',
      dataIndex: 'dataEmissao',
      width: 170,
      render: (value: string) => (value ? dayjs(value).format('DD/MM/YYYY') : '-'),
    },
  ];

  const apiCall = async (pagina: number, registrosPorPaginaArg: number) => {
    const dataEmissao = form.getFieldValue('dataEmissao');
    const dataEmissaoFormatada = dataEmissao
      ? dayjs(dataEmissao).format('YYYY-MM-DD')
      : undefined;

    const filtros = {
      NomeFormacao: form.getFieldValue('nomeFormacao') || undefined,
      TipoDeclaracao: form.getFieldValue('tipoDeclaracao') ?? undefined,
      CodigoFormacao: form.getFieldValue('codigoFormacao')
        ? Number(form.getFieldValue('codigoFormacao'))
        : undefined,
      NumeroHomologacao: form.getFieldValue('numeroHomologacao')
        ? Number(form.getFieldValue('numeroHomologacao'))
        : undefined,
      CodigoDeclaracao: form.getFieldValue('codigoDeclaracao')
        ? Number(form.getFieldValue('codigoDeclaracao'))
        : undefined,
      DocumentoCursista: form.getFieldValue('rfOuCpfCursista') || undefined,
      DocumentoRegente: form.getFieldValue('rfRegente') || undefined,
      NomeCursista: form.getFieldValue('nomeCursista') || undefined,
      DataEmissao: dataEmissaoFormatada,
      TipoEmissor: TipoEmissorEnum.DRE,
      EmissorId: form.getFieldValue('emissorId')?.id || undefined,
      TurmaId: form.getFieldValue('turmaId') || undefined,
      Pagina: pagina,
      TamanhoPagina: registrosPorPaginaArg,
    };

    return obterDeclaracoesCodaf(filtros);
  };

  const {
    dados,
    loading,
    paginaAtual,
    totalRegistros,
    registrosPorPagina,
    setFiltroAplicado,
    selectedRowKeys,
    onClickFiltrar,
    handleTableChange,
    rowSelection,
    setPaginaAtual,
    setTotalRegistros,
  } = usePesquisaDocumentos<CodafDeclaracaoDTO>(apiCall, 'Erro ao buscar declarações');

  const onClickLimpar = () => {
    const emissorId = form.getFieldValue('emissorId');
    const isDreDisabled = document.getElementById(CF_SELECT_DRE)?.closest('.ant-select-disabled') !== null;

    setPaginaAtual(1);    
    setTotalRegistros(0);
    setFiltroAplicado(false);
    setTurmaDisabled(false);
    setTurmasProposta([]);
    form.resetFields();

    if (isDreDisabled) {
      form.setFieldValue('emissorId', emissorId);
    }
  };

  const onClickBaixarDeclaracao = async () => {
    if (selectedRowKeys.length === 1) {
      const id = selectedRowKeys[0] as number;
      const resultado = await downloadDeclaracao(id);

      if (resultado.sucesso && resultado.dados?.urlDownload) {
        const { nomeFormacao, nomeCompleto, urlDownload } = resultado.dados;
        const sanitize = (s: string) => s.replaceAll(/[/\\:*?"<>|]/g, '_').trim();
        const nomePdf = `DECLARACAO_${sanitize(nomeFormacao)}_${sanitize(nomeCompleto)}.PDF`;
        const blob = await fetch(urlDownload).then((r) => r.blob());
        const url = globalThis.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomePdf;
        link.click();
        globalThis.URL.revokeObjectURL(url);
        notification.success({
          message: 'Sucesso',
          description: 'A declaração foi baixada com sucesso.',
        });
      } else {
        notification.error({
          message: 'Erro',
          description: 'Não conseguimos baixar a declaração selecionada. Tente novamente.',
        });
      }
      return;
    }

    const ids = selectedRowKeys as number[];
    const resultado = await downloadDeclaracoesLote(ids);

    if (resultado.sucesso && resultado.blob) {
      const url = globalThis.URL.createObjectURL(resultado.blob);
      const link = document.createElement('a');
      link.href = url;
      const now = dayjs();
      link.download = `DECLARACOES_${now.format('DDMMYYYY')}_${now.format('HHmmss')}.zip`;
      link.click();
      globalThis.URL.revokeObjectURL(url);
      notification.success({
        message: 'Sucesso',
        description: 'As declarações selecionadas foram baixadas com sucesso.',
      });
    } else {
      notification.error({
        message: 'Erro',
        description: 'Não conseguimos baixar as declarações selecionadas. Tente novamente.',
      });
    }
  };



   const aoMudarCodigoProposta = () => {    
    setTurmaDisabled(true);
    setTurmasProposta([]);
  }

  const aoSairDoCampoCodigoProposta = async (_valor: string) => {
      const value = Number(_valor.trim().replaceAll(/\D/g, ''));
  
      if (value === 0) {
        setTurmaDisabled(true);
        setTurmasProposta([]);
        return;
      }
  
      try {
        const resposta = await obterDetalhesPropostaComTurmasPorId(value, false);
  
        if (resposta.sucesso && resposta.dados) {
          if (resposta.dados.turmas && resposta.dados.turmas.length > 0) {
            setTurmasProposta(resposta.dados.turmas);
            setTurmaDisabled(false);
            form.setFieldsValue({
              numeroHomologacao: resposta.dados.numeroFormacao || undefined,
            });
          } else {
            setTurmasProposta([]);
            setTurmaDisabled(true);
          }
          form.setFieldsValue({
            turmaId: undefined
          });
        } else {
          form.setFieldsValue({
            turmaId: undefined,
          });
          setTurmasProposta([]);
          setTurmaDisabled(true);
        }
      } catch (error) {
        console.error('Erro ao obter detalhes da proposta:', error);
        setTurmasProposta([]);
        setTurmaDisabled(true);
        notification.error({
          message: 'Erro',
          description: 'Erro ao obter detalhes da proposta',
        });
      }
    };


  return (
    <Col>
      <CabecalhoPesquisaDocumentos
        title='Pesquisar declarações'
        actionLabel='Baixar declaração'
        emptySelectionMessage='Selecione um ou mais registros para baixar as declarações.'
        navigate={navigate}
        onDownload={onClickBaixarDeclaracao}
        selectedCount={selectedRowKeys.length}
      />

      <style>{`
        .declaracaos-pesquisa-form .ant-form-item-label > label {
          font-weight: bold;
        }
      `}</style>
      <Form form={form} layout='vertical' autoComplete='off' className='declaracaos-pesquisa-form'>
        <CardContent>
          <FiltrosPesquisaDocumentos
            tipo="declaracoes"
            rfCursistaDisabled={rfCursistaDisabled}
            rfRegenteDisabled={rfRegenteDisabled}
            turmaDisabled={turmaDisabled}
            turmas={turmasProposta}
            loading={loading}
            onClickFiltrar={onClickFiltrar}
            onClickLimpar={onClickLimpar}
            aoMudarCodigoProposta={aoMudarCodigoProposta}
            aoSairDoCampoCodigoProposta={aoSairDoCampoCodigoProposta}
          />

          <TabelaPesquisaDocumentos
            columns={columns}
            dados={dados}
            loading={loading}
            paginaAtual={paginaAtual}
            registrosPorPagina={registrosPorPagina}
            rowSelection={rowSelection}
            totalRegistros={totalRegistros}
            onChange={handleTableChange}
          />
        </CardContent>
      </Form>
    </Col>
  );
};

export default DeclaracoesPesquisa;
