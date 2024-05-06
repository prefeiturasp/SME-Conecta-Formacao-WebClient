import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import InputEmail from '~/components/main/input/email';
import { CF_INPUT_EMAIL } from '~/core/constants/ids/input';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';

type ModalEditEmailProps = {
  initialValues: { email: string };
  updateFields: (values: { email: string }) => void;
  closeModal: () => void;
};

const ModalEditEmail: React.FC<ModalEditEmailProps> = ({
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

  const alterarEmail = (values: { email: string }) =>
    usuarioService.alterarEmail(usuarioLogin, values?.email);

  return (
    <ModalEditDefault
      form={form}
      title='Alterar e-mail'
      service={alterarEmail}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o novo e-mail, confirma que deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <InputEmail
          inputProps={{ id: CF_INPUT_EMAIL }}
          formItemProps={{
            name: 'email',
            label: 'E-mail',
            style: { width: '100%', marginRight: '8px' },
            required: true,
          }}
        />
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditEmail;
