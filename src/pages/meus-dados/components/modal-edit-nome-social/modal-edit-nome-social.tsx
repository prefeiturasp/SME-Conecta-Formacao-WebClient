import { Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { InputNome } from '~/components/main/input/nome';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditDefault from '../modal-edit-default';
import { InputNomeSocial } from '~/components/main/input/nome-social';

type ModalEditNomeSocialProps = {
  initialValues: { nomeSocial: string };
  updateFields: (values: { nomeSocial: string }) => void;
  closeModal: () => void;
};

export const ModalEditNomeSocial: React.FC<ModalEditNomeSocialProps> = ({
  updateFields,
  initialValues,
  closeModal,
}) => {
  const [form] = useForm();
  const auth = useAppSelector((store) => store.auth);
  const usuarioLogin = auth?.usuarioLogin;
  const nomeSocial = form.getFieldValue('nomeSocial');
  const prefixo = nomeSocial ? 'Alterar' : 'Adicionar';

  const validateMessages = {
    required: 'Campo obrigatório',
  };

  const alterarNomeSocial = (values: { nomeSocial: string }) =>
    usuarioService.alterarNomeSocial(usuarioLogin, values?.nomeSocial);

  return (
    <ModalEditDefault
      form={form}
      title={`${prefixo} nome social`}
      service={alterarNomeSocial}
      adicionar={!nomeSocial}
      updateFields={updateFields}
      mensagemConfirmarCancelar='Você não salvou o novo nome social, confirma que deseja descartar a alteração?'
      closeModal={closeModal}
    >
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        initialValues={initialValues}
        validateMessages={validateMessages}
      >
        <InputNomeSocial
          inputProps={{
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value.replace(/[^\p{L}\s]/gu, '');
              form.setFieldValue('nomeSocial', newValue);
            },
          }}
        />
      </Form>
    </ModalEditDefault>
  );
};
