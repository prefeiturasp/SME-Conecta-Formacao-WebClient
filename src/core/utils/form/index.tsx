import { FormInstance } from 'antd';
import { NavigateFunction, Params } from 'react-router-dom';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
} from '~/core/constants/mensagens';
import { confirmacao } from '~/core/services/alerta-service';

type FunctionProps = {
  route?: string;
  mensagem?: string;
  form?: FormInstance;
  navigate?: NavigateFunction;
  paramsRoute?: Params;
};

export const onClickCancelar = ({ form, mensagem }: FunctionProps): void => {
  if (form?.isFieldsTouched()) {
    confirmacao({
      content: mensagem ?? DESEJA_CANCELAR_ALTERACOES,
      onOk() {
        form.resetFields();
      },
    });
  }
};

export const onClickVoltar = ({
  form,
  route,
  navigate,
  mensagem,
  paramsRoute,
}: FunctionProps): void => {
  if (navigate && route) {
    if (form?.isFieldsTouched()) {
      confirmacao({
        content: mensagem ?? DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          form.submit();
        },
        onCancel() {
          navigate(route);
        },
      });
    } else {
      navigate(route, paramsRoute);
    }
  }
};
