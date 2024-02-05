import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';

import { dayjs } from '~/core/date/dayjs';

import { setDeslogar } from '~/core/redux/modules/auth/actions';

import queryString from 'query-string';
import { openNotificationErrors } from '~/components/lib/notification';
import { RetornoBaseDTO } from '~/core/dto/retorno-base-dto';
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

  return refreshTokenPromise.then((dadosRefresh: any) => {
    if (dadosRefresh?.token) {
      // TODO Refresh Token ainda não foi criado
      // store.dispatch(setDadosRevalidarLogin(dadosRefresh));
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

  const diff = now.diff(dayjs(dataHoraExpiracao), 'seconds');

  if (requestConfig.headers) {
    if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  if (
    requestConfig?.url !== URL_AUTENTICACAO_REVALIDAR &&
    token &&
    dataHoraExpiracao &&
    diff >= SEGUNDOS_ANTES_EXPIRAR
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
      return { sucesso: true, dados: response?.data, mensagens: [] };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = error?.response?.data?.mensagens?.length
        ? error?.response?.data?.mensagens
        : [];

      // TODO modal error
      openNotificationErrors(mensagens);

      return { sucesso: false, mensagens, dados: null };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export const alterarRegistro = async <T>(
  url: string,
  params?: any,
  mostrarNotificacao = true,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .put(url, params)
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [] };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = error?.response?.data?.mensagens?.length
        ? error?.response?.data?.mensagens
        : [];

      // TODO modal error
      if (mostrarNotificacao) {
        openNotificationErrors(mensagens);
      }

      return { sucesso: false, mensagens, dados: null };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export const alterarRegistroParcial = async <T>(
  url: string,
  params: any,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .patch(url, params)
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [] };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = error?.response?.data?.mensagens?.length
        ? error?.response?.data?.mensagens
        : [];

      // TODO modal error
      openNotificationErrors(mensagens);

      return { sucesso: false, mensagens, dados: null };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export const inserirRegistro = async <T>(
  url: string,
  params: any,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .post(url, params, config)
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [] };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = error?.response?.data?.mensagens?.length
        ? error?.response?.data?.mensagens
        : [];

      // TODO modal error
      openNotificationErrors(mensagens);

      return { sucesso: false, mensagens, dados: null };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export const deletarRegistro = async <T>(url: string): Promise<ApiResult<T>> => {
  store.dispatch(setSpinning(true));
  return api
    .delete(url)
    .then((response: AxiosResponse<T>): ApiResult<T> => {
      return { sucesso: true, dados: response?.data, mensagens: [] };
    })
    .catch((error: AxiosError<RetornoBaseDTO>): ApiResult<any> => {
      const mensagens = error?.response?.data?.mensagens?.length
        ? error?.response?.data?.mensagens
        : [];

      openNotificationErrors(mensagens);

      return { sucesso: false, mensagens, dados: null };
    })
    .finally(() => store.dispatch(setSpinning(false)));
};

export default api;
