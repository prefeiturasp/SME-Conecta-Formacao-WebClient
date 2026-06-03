import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import InputTelefone from '~/components/main/input/telefone';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import { maskTelefone } from '~/core/utils/functions';
import ModalEditDefault from '../modal-edit-default';

type ModalEditTelefoneProps = {
  initialValues: { telefone: string };
  updateFields: (values: { telefone: string }) => void;
  closeModal: () => void;
};

export const ModalEditTelefone: React.FC<ModalEditTelefoneProps> = ({
  updateFields,
  initialValues,
  closeModal,
}) => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);
  const usuarioLogin = auth?.usuarioLogin;

  const validateMessages = {
    required: 'Campo obrigatório',
  };

  const alterarTelefone = (values: { telefone: string }) =>
    usuarioService.alterarTelefone(usuarioLogin, values?.telefone);

  const initialValuesFormatted = {
    telefone: initialValues?.telefone ? maskTelefone(initialValues.telefone) : '',
  };

  return (
    <ModalEditDefault
      form={form}
      title='Alterar telefone'
      service={alterarTelefone}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o novo telefone, confirma que deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValuesFormatted}
        validateMessages={validateMessages}
      >
        <InputTelefone />
      </Form>
    </ModalEditDefault>
  );
};
