/* eslint-disable @typescript-eslint/no-empty-function */
import { useForm } from 'antd/es/form/Form';
import { HttpStatusCode } from 'axios';
import React, { PropsWithChildren, createContext, useCallback, useEffect, useState } from 'react';
import { DadosUsuarioDTO } from '~/core/dto/dados-usuario-dto';
import { useAppDispatch, useAppSelector } from '~/core/hooks/use-redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import usuarioService from '~/core/services/usuario-service';

type MeusDadosContextProps = {
  meusDados: DadosUsuarioDTO;
  obterDados: () => void;
};

const DEFAULT_VALUES: MeusDadosContextProps = {
  meusDados: {},
  obterDados: () => {},
};

export const MeusDadosContext = createContext<MeusDadosContextProps>(DEFAULT_VALUES);

const MeusDadosContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((store) => store.auth);
  const [meusDados, setMeusDados] = useState<DadosUsuarioDTO>(DEFAULT_VALUES.meusDados);

  const usuarioLogin = auth?.usuarioLogin;

  const obterDados = useCallback(() => {
    dispatch(setSpinning(true));
    usuarioService
      .obterMeusDados(usuarioLogin)
      .then((resposta) => {
        if (resposta?.status === HttpStatusCode.Ok) {
          setMeusDados({ ...resposta.data });
          form.setFieldsValue(resposta.data);
        }
      })
      .catch(() => alert('erro ao obter meus dados'))
      .finally(() => dispatch(setSpinning(false)));
  }, [usuarioLogin, form, dispatch]);

  useEffect(() => {
    obterDados();
  }, [obterDados]);

  return (
    <MeusDadosContext.Provider
      value={{
        meusDados,
        obterDados,
      }}
    >
      {children}
    </MeusDadosContext.Provider>
  );
};

export default MeusDadosContextProvider;
