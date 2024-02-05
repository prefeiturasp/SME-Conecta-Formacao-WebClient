import { Modal, ModalFuncProps } from 'antd';
import { Colors } from '../styles/colors';

const confirmacao = (props: ModalFuncProps) => {
  const { title, content, okText, cancelText } = props;

  Modal.confirm({
    ...props,
    icon: null,
    width: 500,
    content: content,
    okText: okText || 'Sim',
    title: title || 'Atenção',
    cancelText: cancelText || 'Não',
    cancelButtonProps: {
      type: 'text',
      style: { color: Colors.Neutral.DARK, fontWeight: 500, fontSize: 16, padding: '0px 15px' },
    },
    okButtonProps: {
      type: 'default',
      style: {
        color: Colors.SystemSME.ConectaFormacao.PRIMARY,
        border: `1px solid ${Colors.SystemSME.ConectaFormacao.PRIMARY}`,
        fontSize: 16,
        padding: '0px 15px',
        borderRadius: 4,
      },
    },
  });
};

const sucesso = (props: ModalFuncProps) => {
  const { content, okText } = props;

  Modal.success({
    ...props,
    content: content,
    okText: okText || 'Sim',
    okButtonProps: {
      type: 'default',
      style: {
        color: Colors.SystemSME.ConectaFormacao.PRIMARY,
        border: `1px solid ${Colors.SystemSME.ConectaFormacao.PRIMARY}`,
        fontSize: 16,
        padding: '0px 15px',
        borderRadius: 4,
      },
    },
  });
};

export { confirmacao, sucesso };
