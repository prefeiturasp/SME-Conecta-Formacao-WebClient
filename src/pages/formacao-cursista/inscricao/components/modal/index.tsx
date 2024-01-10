import { CheckCircleTwoTone, WarningOutlined } from '@ant-design/icons';
import { Button, Flex, ModalProps, Typography } from 'antd';
import React from 'react';
import Modal from '~/components/lib/modal';
import { Colors } from '~/core/styles/colors';

type ModalInscricaoProps = {
  mensagem: string;
  modalProps?: ModalProps;
  onConfirmButton: () => void;
  onCancelButton?: () => void;
  labelConfirmButton: string;
  labelCancelButton?: string;
  typeIcon?: 'check' | 'warning';
};

export const ModalInscricao: React.FC<ModalInscricaoProps> = ({
  mensagem,
  modalProps,
  onConfirmButton,
  onCancelButton,
  labelConfirmButton,
  labelCancelButton,
  typeIcon = 'check',
}) => {
  const corPadraoConecta = Colors.SystemSME.ConectaFormacao.PRIMARY;
  const styleIcon = {
    fontSize: 40,
    margin: '24px 0',
  };

  const styleButtons = {
    margin: '24px 0',
  };

  const obterIcone = (type: string) => {
    switch (type) {
      case 'warning':
        return <WarningOutlined style={styleIcon} />;

      default:
        return <CheckCircleTwoTone style={styleIcon} twoToneColor={corPadraoConecta} />;
    }
  };

  return (
    <Modal open centered cancelText footer={null} destroyOnClose {...modalProps}>
      <Flex justify='center' align='center' vertical>
        {obterIcone(typeIcon)}

        <Typography.Text style={{ fontSize: 20, fontWeight: 'bold', width: 380 }}>
          {mensagem}
        </Typography.Text>

        {labelConfirmButton && onConfirmButton && (
          <Button style={styleButtons} onClick={onConfirmButton}>
            {labelConfirmButton}
          </Button>
        )}

        {labelCancelButton && onCancelButton && (
          <Button style={styleButtons} onClick={onCancelButton}>
            {labelCancelButton}
          </Button>
        )}
      </Flex>
    </Modal>
  );
};
