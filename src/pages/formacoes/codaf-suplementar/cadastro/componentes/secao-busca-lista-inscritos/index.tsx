import { DeleteOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Select, Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { debounce } from "lodash";
import { useMemo, useRef, useState } from "react";
import { CursistaDTO } from "../..";
import { DadosInscricaoCursistaDTO, pesquisarCursistasDaTurma } from "~/core/services/proposta-service";
import { notification } from "~/components/lib/notification";

export interface ResultadoBuscaDTO {
  id: number;
  rfOuCpf: string;
  nomeCursista: string;
}

interface SecaoBuscaEListaInscritosProps {
    cursistas: CursistaDTO[];
    onAdicionarCursista: (novoCursista: DadosInscricaoCursistaDTO[]) => void;
    onRemoverCursista: (id: number) => void;
    onChangeCursista: (
      id: number,
      field: keyof CursistaDTO,
      value: CursistaDTO[keyof CursistaDTO],
    ) => void;
    propostaTurmaId: number;
}

const TAMANHO_PAGINA = 20;

const removeNonDigits = (value: string) => value.replace(/\D/g, '');

const getAprovadoValue = (aprovado: boolean | null) => {
  if (aprovado === null) {
    return null;
  }

  return aprovado ? 'S' : 'N';
};

const escapeForRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

const buildHighlightNodes = (text: string, highlighted: string) => {
  if (!highlighted.trim()) {
    return text;
  }

  const escaped = escapeForRegex(highlighted);
  const splitRegex = new RegExp(`(${escaped})`, 'gi');
  const exactMatchRegex = new RegExp(`^${escaped}$`, 'i');
  const parts = text.split(splitRegex);
  const keyCounter = new Map<string, number>();

  return (
    <span>
      {parts.map((part) => {
        const currentCount = keyCounter.get(part) ?? 0;
        keyCounter.set(part, currentCount + 1);
        const key = `${part}-${currentCount}`;

        if (exactMatchRegex.test(part)) {
          return <strong key={key}>{part}</strong>;
        }

        return <span key={key}>{part}</span>;
      })}
    </span>
  );
};

export const SecaoBuscaEListaInscritos: React.FC<SecaoBuscaEListaInscritosProps> = ({
    cursistas,
    onAdicionarCursista,
    onRemoverCursista,
    onChangeCursista,
    propostaTurmaId,
}) => {
  const [buscando, setBuscando] = useState<boolean>(false);
  const [carregandoMais, setCarregandoMais] = useState<boolean>(false);

  const [opcoesAtuais, setOpcoesAtuais] = useState<DadosInscricaoCursistaDTO[]>([]);
  const [opcoesEmCache, setOpcoesEmCache] = useState<DadosInscricaoCursistaDTO[]>([]);
  const [itensSelecionados, setItensSelecionados] = useState<number[]>([]);
  const [valorPesquisado, setValorPesquisado] = useState<string>('');

  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [temMaisResultados, setTemMaisResultados] = useState<boolean>(false);

  const buscaRef = useRef(0);

  const buscarInscritos = async (textoBusca: string, pagina: number, acrescentar: boolean = false) => {
    try {
      const resultado = await pesquisarCursistasDaTurma(textoBusca, propostaTurmaId, pagina, TAMANHO_PAGINA);

      if (resultado.sucesso && resultado.dados){
        const { items, totalPaginas } = resultado.dados;

        setOpcoesAtuais(prev => acrescentar ? [...prev, ...items] : items);

        setOpcoesEmCache(prev => {
          const novosItems = items.filter(item => !prev.some(p => p.inscricaoId === item.inscricaoId));
          return [...prev, ...novosItems];
        });

        setTemMaisResultados(pagina < totalPaginas);
        setPaginaAtual(pagina);
      } else {
        setOpcoesAtuais(acrescentar ? opcoesAtuais : []);
        setTemMaisResultados(false);
        setPaginaAtual(1);
      }
    } catch (error) {
      console.error('Erro ao buscar cursistas:', error);
      notification.error({
        message: 'Erro ao buscar cursistas',
        description: 'Não foi possível carregar os cursistas. Tente novamente.',
      });
      return [];
    }
  };

  const debounceBusca = useMemo(() => {
    const carregarOpcoes = async (valor: string) => {
      buscaRef.current += 1;
      const idBuscaAtual = buscaRef.current;
      setOpcoesAtuais([]);
      setTemMaisResultados(false);
      setPaginaAtual(1);

      if (!valor) {
        setBuscando(false);
        return;
      }

      setBuscando(true);
      await buscarInscritos(valor, 1);

      if (idBuscaAtual === buscaRef.current) {
        setBuscando(false);
      }
    };
    return debounce(carregarOpcoes, 600);
  }, [propostaTurmaId]);

  const handleSearchChange = (valor: string) => {
    setValorPesquisado(valor);
    debounceBusca(valor);
  };

  const handlePopupScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;

    const shouldLoadMore =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 5 &&
      temMaisResultados &&
      !buscando &&
      !carregandoMais;

    if (shouldLoadMore) {
      setCarregandoMais(true);
      await buscarInscritos(valorPesquisado, paginaAtual + 1, true);
      setCarregandoMais(false);
    }
  };

  const handlerAdicionarInscritos = () => {
    const inscritosParaAdicionar = opcoesEmCache.filter((opt) => itensSelecionados.includes(opt.inscricaoId));
    onAdicionarCursista(inscritosParaAdicionar);
    setItensSelecionados([]);
    setOpcoesAtuais([]);
  };

  const handleFrequenciaChange = (inscricaoId: number, valor: string) => {
    const valorNumerico = removeNonDigits(valor);
    const valorFinal = valorNumerico ? Math.min(parseInt(valorNumerico, 10), 100) : null;
    onChangeCursista(inscricaoId, 'frequencia', valorFinal);
  };

  const colunas: ColumnsType<CursistaDTO> = [
    {
      key: 'sequencia',
      title: 'Sequência',
      width: 80,
      align: 'center',
      render: (_texto: unknown, _registro: CursistaDTO, indice: number) => {
        return (indice + 1).toString().padStart(2, '0');
      },
    },
    {
      key: 'rfOuCpf',
      title: 'Registro Funcional (RF) ou CPF',
      dataIndex: 'rfOuCpf',
      width: 200,
    },
    {
      key: 'nomeCursista',
      title: 'Nome do Cursista',
      dataIndex: 'nomeCursista',
      ellipsis: true,
    },
    {
      key: 'frequencia',
      title: 'Frequência (%)',
      dataIndex: 'frequencia',
      width: 130,
      render: (freq: number | null, registro: CursistaDTO) => (
        <Input
          value={freq !== null ? `${freq}%` : ''}
          placeholder='%'
          onChange={(e) => handleFrequenciaChange(registro.inscricaoId, e.target.value)}
          style={{ width: '100%' }}
          maxLength={4}
        />
      ),
    },
    {
      key: 'atividade',
      title: 'Atividade obrigatória',
      dataIndex: 'atividade',
      width: 160,
      render: (atividade: string | null, registro: CursistaDTO) => (
        <Select
          value={atividade}
          placeholder='Selecione'
          onChange={(valor) => onChangeCursista(registro.inscricaoId, 'atividade', valor)}
          style={{ width: '100%' }}
          options={[
            { label: 'Sim', value: 'S' },
            { label: 'Não', value: 'N' },
          ]}
          allowClear
        />
      ),
    },
    {
      key: 'conceitoFinal',
      title: 'Conceito final',
      dataIndex: 'conceitoFinal',
      width: 220,
      render: (conceitoFinal: string | null, registro: CursistaDTO) => (
        <Select
          value={conceitoFinal}
          placeholder='Selecione'
          onChange={(valor) => onChangeCursista(registro.inscricaoId, 'conceitoFinal', valor || null)}
          style={{ width: '100%' }}
          options={[
            { label: 'Plenamente satisfatório (P)', value: 'P' },
            { label: 'Satisfatório (S)', value: 'S' },
            { label: 'Não Satisfatório (NS)', value: 'NS' },
          ]}
          allowClear
        />
      ),
    },
    {
      key: 'aprovado',
      title: 'Aprovado',
      dataIndex: 'aprovado',
      width: 120,
      render: (aprovado: boolean | null, registro: CursistaDTO) => (
        <Select
          value={getAprovadoValue(aprovado)}
          placeholder='Selecione'
          onChange={(valor) => onChangeCursista(registro.inscricaoId, 'aprovado', valor ? valor === 'S' : null)}
          style={{ width: '100%' }}
          options={[
            { label: 'Sim', value: 'S' },
            { label: 'Não', value: 'N' },
          ]}
          allowClear
        />
      ),
    },
    {
      key: 'acao',
      title: 'Ação',
      width: 60,
      align: 'center',
      render: (_texto: unknown, registro: CursistaDTO) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemoverCursista(registro.inscricaoId)}
        />
      ),
    },
  ];

  const opcoesParaRenderizar = useMemo(() => {
    const selecionadosMasNaoAtuais = opcoesEmCache.filter(
      opt => itensSelecionados.includes(opt.inscricaoId) && !opcoesAtuais.some(a => a.inscricaoId === opt.inscricaoId)
    );
    return [...selecionadosMasNaoAtuais, ...opcoesAtuais];
  }, [opcoesAtuais, opcoesEmCache, itensSelecionados]);

  return (
    <div style={{ marginTop: '32px' }}>
      <Row gutter={[16, 8]}>
        <Col span={24}>
          <div style={{ fontWeight: 700, fontSize: '20px', color: '#42474A', marginBottom: 8 }}>
            Busca e seleção de inscritos
          </div>
          <p style={{ marginBottom: 16 }}>
            Aqui você pode buscar a pessoa para registrar a presença usando o RF ou o CPF. Apenas
            pessoas com inscrição confirmada serão exibidas nos resultados.
          </p>
        </Col>
      </Row>

      <Row gutter={[16, 0]} align="bottom" style={{ marginBottom: 32 }}>
        <Col xs={24} sm={18} md={20}>
          <div style={{ marginBottom: '8px', fontWeight: 700, color: '#42474A' }}>
            Nome, RF ou CPF
          </div>
          <Select
            mode="multiple"
            labelInValue={false}
            value={itensSelecionados}
            placeholder="Digite o nome, RF ou CPF da pessoa inscrita na formação"
            notFoundContent={buscando ? <Spin size="small" /> : 'Nenhum cursista encontrado'}
            filterOption={false}
            onSearch={handleSearchChange}
            onChange={(valores) => setItensSelecionados(valores)}
            onPopupScroll={handlePopupScroll}
            style={{ width: '100%' }}
            size="large"
            disabled={!propostaTurmaId}
            allowClear
            optionLabelProp="label"
            dropdownRender={(menu) => (
              <>
                {menu}
                {carregandoMais && (
                  <>
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <Spin size="small" /> Carregando mais...
                    </div>
                  </>
                )}
              </>
            )}
          >
            {opcoesParaRenderizar.map((opt) => {
              const fullText = `${opt.nome} (${opt.documento})`;
              return (
                <Select.Option key={opt.inscricaoId} value={opt.inscricaoId} label={fullText}>
                  {buildHighlightNodes(fullText, valorPesquisado)}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
        <Col xs={24} sm={6} md={4}>
          <Button
            type="primary"
            size="large"
            block
            disabled={itensSelecionados.length === 0}
            onClick={handlerAdicionarInscritos}
            style={{ fontWeight: 700 }}
          >
            Adicionar inscrito
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 8]}>
        <Col span={24}>
          <div style={{ fontWeight: 700, fontSize: '20px', color: '#42474A', marginBottom: 8 }}>
            Lista de inscritos na formação
          </div>
          <p style={{ marginBottom: 16 }}>
            Após selecionar a pessoa na busca, ela aparecerá na lista de inscritos da formação. Em
            seguida, você poderá registrar as informações de conclusão.
          </p>
        </Col>
      </Row>

      <Row gutter={[16, 8]}>
        <Col span={24}>
          <Table
            columns={colunas}
            dataSource={cursistas}
            rowKey="inscricaoId"
            pagination={false}
            scroll={{ x: 'max-content' }}
            locale={{
              emptyText: 'Nenhum cursista adicionado.',
            }}
          />
        </Col>
      </Row>
    </div>
  );
};