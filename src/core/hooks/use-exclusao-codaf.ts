import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from '~/components/lib/notification';

export const useExclusaoCodaf = (
  funcaoDeletarApi: (id: number) => Promise<any>,
  rotaRedirecionamentoSucesso: string
) => {
  const navigate = useNavigate();
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);
  const [loadingExclusao, setLoadingExclusao] = useState(false);

  const onClickExcluir = () => setModalExcluirVisible(true);
  const cancelarExclusao = () => setModalExcluirVisible(false);

  const confirmarExclusao = async (registroId: number | null) => {
    if (!registroId) {
      notification.warning({ message: 'Atenção', description: 'Registro não encontrado' });
      setModalExcluirVisible(false);
      return;
    }

    try {
      setLoadingExclusao(true);
      setModalExcluirVisible(false);

      const response = await funcaoDeletarApi(registroId);

      if (response.status === 204) {
        notification.success({ message: 'Sucesso', description: 'Registro excluído com sucesso!' });
        navigate(rotaRedirecionamentoSucesso);
      } else {
        const mensagemErro = response.mensagens?.length > 0
          ? response.mensagens.join(', ')
          : 'Erro ao excluir o registro';
        notification.error({ message: 'Erro', description: mensagemErro });
      }
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      const mensagemErro =
        error?.response?.data?.erros?.[0] ||
        error?.response?.data?.mensagens?.[0] ||
        error?.message ||
        'Erro ao excluir o registro';

      notification.error({ message: 'Erro', description: mensagemErro });
    } finally {
      setLoadingExclusao(false);
    }
  };

  return {
    modalExcluirVisible,
    loadingExclusao,
    onClickExcluir,
    cancelarExclusao,
    confirmarExclusao,
  };
};