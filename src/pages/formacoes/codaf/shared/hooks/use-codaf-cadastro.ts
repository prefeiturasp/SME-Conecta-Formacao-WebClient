import { useState, useRef, useCallback } from 'react';
import { useForm } from 'antd/es/form/Form';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { PropostaAutocompletarDTO } from '~/core/services/proposta-service';

export function useCodafCadastro<TCursista extends { id: number }>() {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [cursistas, setCursistas] = useState<TCursista[]>([]);
  const [opcoesFormacao, setOpcoesFormacao] = useState<PropostaAutocompletarDTO[]>([]);
  const [loadingAutocomplete, setLoadingAutocomplete] = useState(false);
  const [propostaSelecionada, setPropostaSelecionada] = useState<PropostaAutocompletarDTO | null>(null);

  const [cursistasSelecionadosIds, setCursistasSelecionadosIds] = useState<number[]>([]);
  const [drawerLoteAberto, setDrawerLoteAberto] = useState(false);
  const [drawerLoteModo, setDrawerLoteModo] = useState<'registrar' | 'editar'>('registrar');

  const [turmasFiltradas, setTurmasFiltradas] = useState<RetornoListagemDTO[]>([]);
  const [turmaDisabled, setTurmaDisabled] = useState(true);
  const [formValido, setFormValido] = useState(false);

  const [registroId, setRegistroId] = useState<number | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const [paginaAtualInscritos, setPaginaAtualInscritos] = useState(1);
  const [totalRegistrosInscritos, setTotalRegistrosInscritos] = useState(0);
  const [registrosPorPaginaInscritos, setRegistrosPorPaginaInscritos] = useState(10);

  const [tooltipAberto, setTooltipAberto] = useState(false);
  const [todasTurmasPossuemLista, setTodasTurmasPossuemLista] = useState(false);

  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);

  const formOriginal = useRef<any>(null);

  const cursistasSelecionados = cursistas.filter((c) => cursistasSelecionadosIds.includes(c.id));
  const quantidadeMinimaSelecionada = cursistasSelecionadosIds.length >= 2;

  const onClickRegistrarDados = useCallback(() => {
    setDrawerLoteModo('registrar');
    setDrawerLoteAberto(true);
  }, []);

  const onClickEditarDados = useCallback(() => {
    setDrawerLoteModo('editar');
    setDrawerLoteAberto(true);
  }, []);

  return {
    form,
    loading, setLoading,
    cursistas, setCursistas,
    opcoesFormacao, setOpcoesFormacao,
    loadingAutocomplete, setLoadingAutocomplete,
    propostaSelecionada, setPropostaSelecionada,
    cursistasSelecionadosIds, setCursistasSelecionadosIds,
    drawerLoteAberto, setDrawerLoteAberto,
    drawerLoteModo, setDrawerLoteModo,
    turmasFiltradas, setTurmasFiltradas,
    turmaDisabled, setTurmaDisabled,
    formValido, setFormValido,
    registroId, setRegistroId,
    status, setStatus,
    paginaAtualInscritos, setPaginaAtualInscritos,
    totalRegistrosInscritos, setTotalRegistrosInscritos,
    registrosPorPaginaInscritos, setRegistrosPorPaginaInscritos,
    tooltipAberto, setTooltipAberto,
    todasTurmasPossuemLista, setTodasTurmasPossuemLista,
    modalExcluirVisible, setModalExcluirVisible,
    formOriginal,
    cursistasSelecionados,
    quantidadeMinimaSelecionada,
    onClickRegistrarDados,
    onClickEditarDados
  };
}
