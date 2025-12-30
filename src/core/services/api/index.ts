import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

import { dayjs } from '~/core/date/dayjs';

import { setDadosLogin, setDeslogar } from '~/core/redux/modules/auth/actions';

import queryString from 'query-string';
import { openNotificationErrors } from '~/components/lib/notification';
import { SERVICO_INDISPONIVEL } from '~/core/constants/mensagens';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
import { RetornoPerfilUsuarioDTO } from '~/core/dto/retorno-perfil-usuario-dto';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { store } from '../../redux';
import autenticacaoService, { URL_AUTENTICACAO_REVALIDAR } from '../autenticacao-service';

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_SME_CF_API,
};

const api = axios.create({
  ...config,
});

const SEGUNDOS_ANTES_EXPIRAR = 0;
let refreshTokenPromise: any = null;

const deslogarDoSistema = () => {
  store.dispatch(setDeslogar());
};

const getRefreshToken = (token: string) =>
  autenticacaoService.autenticarRevalidar(token).then((resp) => resp);

const revalidarAutenticacao = async (tokenAntigo: string) => {
  if (!refreshTokenPromise) {
    refreshTokenPromise = getRefreshToken(tokenAntigo)
      .then((resposta) => {
        refreshTokenPromise = null;
        return resposta?.data;
      })
      .catch((e) => {
        console.log('Erro ao revalidar token', e);
        alert('Erro ao revalidar token');
      });
  }

  return refreshTokenPromise.then((dadosRefresh: RetornoPerfilUsuarioDTO) => {
    if (dadosRefresh?.token) {
      store.dispatch(setDadosLogin(dadosRefresh));
    } else {
      deslogarDoSistema();
    }

    return dadosRefresh;
  });
};

const configPadraoAutenticacao = async (
  requestConfig: InternalAxiosRequestConfig,
  token: string,
  dataHoraExpiracao: string,
) => {
  const now = dayjs();

  const qtdSegundosExpirados = now.diff(dayjs(dataHoraExpiracao), 'seconds');

  if (requestConfig.headers) {
    if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  if (
    requestConfig?.url !== URL_AUTENTICACAO_REVALIDAR &&
    token &&
    dataHoraExpiracao &&
    qtdSegundosExpirados >= SEGUNDOS_ANTES_EXPIRAR
  ) {
    const dadosRevalidacao = await revalidarAutenticacao(token);

    if (requestConfig.headers && dadosRevalidacao?.token) {
      requestConfig.headers.Authorization = `Bearer ${dadosRevalidacao.token}`;
    } else {
      return Promise.reject();
    }
  }

  return requestConfig;
};

const configRevalidarAutenticacao = async (
  requestConfig: InternalAxiosRequestConfig,
  token: string,
) => {
  if (requestConfig?.headers && token) {
    requestConfig.headers.set('Authorization', `Bearer ${token}`);
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }
  return requestConfig;
};

api.interceptors.request.use(
  async (requestConfig: InternalAxiosRequestConfig) => {
    const { token, dataHoraExpiracao } = store.getState().auth;

    if (requestConfig?.url !== URL_AUTENTICACAO_REVALIDAR) {
      return configPadraoAutenticacao(requestConfig, token, dataHoraExpiracao);
    }

    return configRevalidarAutenticacao(requestConfig, token);
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error?.response?.status === HttpStatusCode.Unauthorized) {
      deslogarDoSistema();
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export type ApiResult<T> = {
  dados: T;
  sucesso: boolean;
  mensagens: string[];
  status: number | undefined;
};

export const obterRegistro = async <T>(
  url: string,
  axiosRequestConfig?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .get(url, {
      paramsSerializer: {
        serialize: (params) => {
          return queryString.stringify(params, {
            skipNull: true,
            skipEmptyString: true,
          });
        },
      },
      ...axiosRequestConfig,
    })
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [], status: response?.status };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = tratarMensagem(error);

      // TODO modal error
      openNotificationErrors(mensagens);

      return { sucesso: false, mensagens, dados: null, status: error?.status };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export const alterarRegistro = async <T>(
  url: string,
  data?: any,
  axiosRequestConfig?: AxiosRequestConfig,
  mostrarNotificacao = true,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .put(url, data, {
      paramsSerializer: {
        serialize: (params) => {
          return queryString.stringify(params, {
            skipNull: true,
            skipEmptyString: true,
          });
        },
      },
      ...axiosRequestConfig,
    })
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [], status: response?.status };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = tratarMensagem(error);
      // TODO modal error
      if (mostrarNotificacao) {
        openNotificationErrors(mensagens);
      }

      return { sucesso: false, mensagens, dados: null, status: error?.status };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

const tratarMensagem = (error: AxiosError<RetornoBaseDTO>) => {
  const data = error?.response?.data as any;
  let mensagens: string[] = [];

  if (data?.mensagens?.length) {
    mensagens = data.mensagens;
  } else if (data?.erros?.length) {
    mensagens = data.erros;
  }

  if (error?.response?.status == 503) mensagens = [SERVICO_INDISPONIVEL];

  return mensagens;
};

export const alterarRegistroParcial = async <T>(
  url: string,
  params: any,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .patch(url, params)
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [], status: response?.status };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = tratarMensagem(error);
      // TODO modal error
      openNotificationErrors(mensagens);

      return { sucesso: false, mensagens, dados: null, status: error?.status };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export const inserirRegistro = async <T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig,
  mostrarNotificacao = true,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .post(url, params, config)
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [], status: response?.status };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = tratarMensagem(error);
      // TODO modal error
      if (mostrarNotificacao) {
        openNotificationErrors(mensagens);
      }

      return { sucesso: false, mensagens, dados: null, status: error?.status };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export const deletarRegistro = async <T>(url: string): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .delete(url)
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [], status: response?.status };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = tratarMensagem(error);
      openNotificationErrors(mensagens);

      return { sucesso: false, mensagens, dados: null, status: error?.status };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export default api;
