import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
} from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

dayjs.locale('pt-br');
import CardContent from '~/components/lib/card-content';
import { notification } from '~/components/lib/notification';
import { SelectDRE } from '~/components/main/input/dre';
import InputNumero from '~/components/main/numero';
import InputTexto from '~/components/main/text/input-text';
import {
  CF_INPUT_CODIGO_FORMACAO,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_NUMERO_HOMOLOGACAO,
  CF_INPUT_RF,
} from '~/core/constants/ids/input';
import { TipoCertificado, TipoCertificadoDescricao } from '~/core/enum/tipo-certificado';
import {
  CodafCertificadoDTO,
  obterCertificadosCodaf,
  downloadCertificadosLote,
} from '~/core/services/codaf-certificado-service';
import { downloadCertificado } from '~/core/services/codaf-lista-presenca-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import TabelaPesquisaDocumentos from '../components/tabela-pesquisa-documentos';
import CabecalhoPesquisaDocumentos from '../components/cabecalho-pesquisa-documentos';
import FiltrosPesquisaDocumentos from '../components/filtros-pesquisa-documentos';
import { usePesquisaDocumentos } from '../components/use-pesquisa-documentos';

const CertificadosPesquisa: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [turmasAPI, setTurmasAPI] = useState<RetornoListagemDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);

  const tipoCertificadoSelecionado = Form.useWatch('tipoCertificado', form);
  const rfCursistaDisabled = tipoCertificadoSelecionado === TipoCertificado.Regente;
  const rfRegenteDisabled = tipoCertificadoSelecionado === TipoCertificado.Cursista;

  React.useEffect(() => {
    if (rfCursistaDisabled) {
      form.setFieldValue('rfOuCpfCursista', undefined);
    }
    if (rfRegenteDisabled) {
      form.setFieldValue('rfRegente', undefined);
    }
  }, [rfCursistaDisabled, rfRegenteDisabled, form]);

  const columns: ColumnsType<CodafCertificadoDTO> = [
    {
      key: 'codigoCertificado',
      title: 'Código do certificado',
      dataIndex: 'codigoCertificado',
      width: 1,
    },
    {
      key: 'nomeFormacao',
      title: 'Nome da formação',
      dataIndex: 'nomeFormacao',
      ellipsis: true,
    },
    {
      key: 'nomeParticipante',
      title: 'Nome do participante',
      dataIndex: 'nomeParticipante',
      ellipsis: true,
    },
    {
      key: 'tipoCertificado',
      title: 'Tipo de certificado',
      dataIndex: 'tipoCertificado',
      width: 1,
      render: (value: TipoCertificado) => TipoCertificadoDescricao[value] ?? '-',
    },
    {
      key: 'documento',
      title: 'RF ou CPF',
      dataIndex: 'documento',
      width: 160,
    },
    {
      key: 'dataEmissao',
      title: 'Data de emissão',
      dataIndex: 'dataEmissao',
      width: 1,
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
      TipoCertificado: form.getFieldValue('tipoCertificado') ?? undefined,
      CodigoFormacao: form.getFieldValue('codigoFormacao')
        ? Number(form.getFieldValue('codigoFormacao'))
        : undefined,
      NumeroHomologacao: form.getFieldValue('numeroHomologacao')
        ? Number(form.getFieldValue('numeroHomologacao'))
        : undefined,
      CodigoCertificado: form.getFieldValue('codigoCertificado')
        ? Number(form.getFieldValue('codigoCertificado'))
        : undefined,
      DocumentoCursista: form.getFieldValue('rfOuCpfCursista') || undefined,
      DocumentoRegente: form.getFieldValue('rfRegente') || undefined,
      NomeCursista: form.getFieldValue('nomeCursista') || undefined,
      DataEmissao: dataEmissaoFormatada,
      DreId: form.getFieldValue('dreId')?.id || undefined,
      PropostaTurmaId: form.getFieldValue('turmaId') || undefined,
      NumeroPagina: pagina,
      NumeroRegistros: registrosPorPaginaArg,
    };

    return obterCertificadosCodaf(filtros);
  };

  const {
    dados,
    loading,
    paginaAtual,
    totalRegistros,
    registrosPorPagina,
    selectedRowKeys,
    onClickFiltrar,
    handleTableChange,
    rowSelection,
  } = usePesquisaDocumentos<CodafCertificadoDTO>(apiCall, 'Erro ao buscar certificados');

  const onSearchFormacao = async (searchText: string) => {
    if (!searchText) {
      setOpcoesFormacao([]);
      return;
    }
    setLoadingAutocomplete(true);
    try {
      const response = await autocompletarFormacao(searchText);
      if (response.sucesso && response.dados && response.dados.items) {
        setOpcoesFormacao(response.dados.items);
      } else {
        setOpcoesFormacao([]);
      }
    } catch {
      setOpcoesFormacao([]);
    } finally {
      setLoadingAutocomplete(false);
    }
  };

  const onSelectFormacao = async (_value: string, option: any) => {
    const proposta = opcoesFormacao.find((p) => p.numeroHomologacao === option.numeroHomologacao);
    if (proposta) {
      form.setFieldsValue({ turmaId: undefined });
      try {
        const response = await obterTurmasInscricao(proposta.propostaId);
        if (response.sucesso && response.dados) {
          setTurmasAPI(response.dados);
          setTurmaDisabled(false);
        } else {
          setTurmasAPI([]);
          setTurmaDisabled(true);
        }
      } catch {
        setTurmasAPI([]);
        setTurmaDisabled(true);
      }
    }
  };

  const onClickBaixarCertificado = async () => {
    if (selectedRowKeys.length === 1) {
      const id = selectedRowKeys[0] as number;
      const resultado = await downloadCertificado(id);

      if (resultado.sucesso && resultado.dados?.urlDownload) {
        const { nomeFormacao, nomeCompleto, urlDownload } = resultado.dados;
        const sanitize = (s: string) => s.replace(/[/\\:*?"<>|]/g, '_').trim();
        const nomePdf = `CERTIFICADO_${sanitize(nomeFormacao)}_${sanitize(nomeCompleto)}.PDF`;
        const blob = await fetch(urlDownload).then((r) => r.blob());
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nomePdf;
        link.click();
        window.URL.revokeObjectURL(url);
        notification.success({
          message: 'Sucesso',
          description: 'O certificado foi baixado com sucesso.',
        });
      } else {
        notification.error({
          message: 'Erro',
          description: 'Não conseguimos baixar o certificado selecionado. Tente novamente.',
        });
      }
      return;
    }

    const ids = selectedRowKeys as number[];
    const resultado = await downloadCertificadosLote(ids);

    if (resultado.sucesso && resultado.blob) {
      const url = window.URL.createObjectURL(resultado.blob);
      const link = document.createElement('a');
      link.href = url;
      const now = dayjs();
      link.download = `CERTIFICADOS_${now.format('DDMMYYYY')}_${now.format('HHmmss')}.zip`;
      link.click();
      window.URL.revokeObjectURL(url);
      notification.success({
        message: 'Sucesso',
        description: 'Os certificados selecionados foram baixados com sucesso.',
      });
    } else {
      notification.error({
        message: 'Erro',
        description: 'Não conseguimos baixar os certificados selecionados. Tente novamente.',
      });
    }
  };




  return (
    <Col>
      <CabecalhoPesquisaDocumentos
        title='Pesquisar certificados'
        actionLabel='Baixar certificado'
        emptySelectionMessage='Selecione um ou mais registros para baixar os certificados.'
        navigate={navigate}
        onDownload={onClickBaixarCertificado}
        selectedCount={selectedRowKeys.length}
      />

      <style>{`
        .certificados-pesquisa-form .ant-form-item-label > label {
          font-weight: bold;
        }
      `}</style>
      <Form form={form} layout='vertical' autoComplete='off' className='certificados-pesquisa-form'>
        <CardContent>
          <FiltrosPesquisaDocumentos
            tipo="certificados"
            rfCursistaDisabled={rfCursistaDisabled}
            rfRegenteDisabled={rfRegenteDisabled}
            turmaDisabled={turmaDisabled}
            turmas={turmasAPI}
            loading={loading}
            onClickFiltrar={onClickFiltrar}
            onSearchFormacao={onSearchFormacao}
            onSelectFormacao={onSelectFormacao}
            opcoesFormacao={opcoesFormacao}
            loadingAutocomplete={loadingAutocomplete}
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

export default CertificadosPesquisa;
