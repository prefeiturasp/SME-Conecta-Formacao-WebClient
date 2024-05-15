import { FormInstance } from 'antd';
import { NavigateFunction, Params } from 'react-router-dom';
import { notification } from '~/components/lib/notification';
import {
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_EXCLUIR_REGISTRO,
  DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
  REGISTRO_EXCLUIDO_SUCESSO,
} from '~/core/constants/mensagens';
import { confirmacao } from '~/core/services/alerta-service';

type FunctionProps = {
  id?: number | string;
  route?: string;
  mensagem?: string;
  form?: FormInstance;
  navigate?: NavigateFunction;
  paramsRoute?: Params;
  endpointExcluir?: (id: number | string) => Promise<any>;
  inverterOnOkCancel?: boolean;
};

const onClickCancelar = ({ form, mensagem }: FunctionProps): void => {
  if (form?.isFieldsTouched()) {
    confirmacao({
      content: mensagem ?? DESEJA_CANCELAR_ALTERACOES,
      onOk() {
        form.resetFields();
      },
    });
  }
};

const onClickVoltar = ({
  form,
  route,
  navigate,
  mensagem,
  paramsRoute,
  inverterOnOkCancel,
}: FunctionProps): void => {
  if (navigate && route) {
    if (form?.isFieldsTouched()) {
      confirmacao({
        content: mensagem ?? DESEJA_SALVAR_ALTERACOES_AO_SAIR_DA_PAGINA,
        onOk() {
          inverterOnOkCancel ? navigate(route, paramsRoute) : form.submit();
        },
        onCancel() {
          inverterOnOkCancel ? form.submit() : navigate(route, paramsRoute);
        },
      });
    } else {
      navigate(route, paramsRoute);
    }
  }
};

const onClickExcluir = ({ id, endpointExcluir, route, navigate, paramsRoute }: FunctionProps) => {
  if (id && endpointExcluir) {
    confirmacao({
      content: DESEJA_EXCLUIR_REGISTRO,
      async onOk() {
        endpointExcluir(id).then((response) => {
          if (response?.sucesso) {
            notification.success({
              message: 'Sucesso',
              description: REGISTRO_EXCLUIDO_SUCESSO,
            });
            if (navigate && route) {
              navigate(route, paramsRoute);
            }
          }
        });
      },
    });
  }
};

export { onClickCancelar, onClickExcluir, onClickVoltar };
