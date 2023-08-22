import { Colors } from '../styles/colors';
import { Modal, ModalFuncProps } from 'antd';

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
      style: { color: Colors.TEXT, fontWeight: 500, fontSize: 16, padding: '0px 15px' },
    },
    okButtonProps: {
      type: 'default',
      style: {
        color: Colors.ORANGE_CONECTA_FORMACAO,
        border: `1px solid ${Colors.ORANGE_CONECTA_FORMACAO}`,
        fontSize: 16,
        padding: '0px 15px',
        borderRadius: 4,
      },
    },
  });
};

export { confirmacao };
