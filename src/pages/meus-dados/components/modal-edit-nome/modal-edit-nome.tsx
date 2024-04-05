import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { InputNome } from '~/components/main/input/nome';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';

type ModalEditNomeProps = {
  initialValues: { nome: string };
  updateFields: (values: { nome: string }) => void;
  closeModal: () => void;
};

export const ModalEditNome: React.FC<ModalEditNomeProps> = ({
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

  const alterarNome = (values: { nome: string }) =>
    usuarioService.alterarNome(usuarioLogin, values?.nome);

  return (
    <ModalEditDefault
      form={form}
      title='Alterar nome'
      service={alterarNome}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o novo nome, confirma que deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <InputNome
          inputProps={{
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value.replace(/[^\p{L}\s]/gu, '');
              form.setFieldValue('nome', newValue);
            },
          }}
        />
      </Form>
    </ModalEditDefault>
  );
};
