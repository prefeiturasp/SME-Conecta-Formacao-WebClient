import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { CF_INPUT_UNIDADE } from '~/core/constants/ids/input';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';
import InputCodigoEolUE from '~/components/main/input/codigo-eol-ue';
import InputUnidade from '~/components/main/input/unidade';

type ModalEditUnidadeProps = {
  initialValues: { nomeUnidade: string };
  updateFields: (values: { nomeUnidade: string }) => void;
  closeModal: () => void;
};

const ModalEditUnidade: React.FC<ModalEditUnidadeProps> = ({
  updateFields,
  initialValues,
  closeModal,
}) => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);
  const [desativarBotaoAlterar, setDesativarBotaoAlterar] = useState<boolean>(true);

  const usuarioLogin = auth?.usuarioLogin;

  const validateMessages = {
    required: 'Campo obrigatório',
  };

  const alterarUnidade = (values: { codigoUnidade: string; nomeUnidade: string }) => {
    return usuarioService.alterarUnidade(usuarioLogin, values.codigoUnidade!);
  };

  return (
    <ModalEditDefault
      form={form}
      title='Alterar Unidade'
      service={alterarUnidade}
      updateFields={updateFields}
      desativarBotaoAlterar={desativarBotaoAlterar}
      mensagemConfirmarCancelar='Você não salvou a alteração, confirma que deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form form={form} layout='vertical' autoComplete='off' validateMessages={validateMessages}>
        <InputCodigoEolUE
          inputProps={{ id: CF_INPUT_UNIDADE }}
          desativarBotaoAlterar={setDesativarBotaoAlterar}
        />
      </Form>
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <InputUnidade
          inputProps={{ id: CF_INPUT_UNIDADE, disabled: true }}
          formItemProps={{
            style: { width: '100%', marginRight: '8px' },
            required: false,
          }}
        />
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditUnidade;
