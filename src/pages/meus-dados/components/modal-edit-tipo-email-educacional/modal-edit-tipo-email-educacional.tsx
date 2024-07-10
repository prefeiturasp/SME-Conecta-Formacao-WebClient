import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';
import SelectTipoEmail from '~/components/main/input/tipo-email';

type ModalEditTipoEmailEducacionalProps = {
  initialValues: { tipoEmail: number };
  updateFields: (values: { tipoEmail: number }) => void;
  closeModal: () => void;
};

const ModalEditTipoEmailEducacional: React.FC<ModalEditTipoEmailEducacionalProps> = ({
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
  
  const alterarTipoEmail = (values: { tipoEmail: number }) => usuarioService.alterarEmailTipoUsuarioExterno(usuarioLogin, values?.tipoEmail);
      
  return (
    <ModalEditDefault
      form={form}
      title='Alterar tipo'
      service={alterarTipoEmail}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o novo tipo, confirma que deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <SelectTipoEmail 
          formItemProps={{
            style: { width: '100%', marginRight: '8px' },
            required: true,
          }}/>
      </Form>
    </ModalEditDefault>
  );
};

export default ModalEditTipoEmailEducacional;
