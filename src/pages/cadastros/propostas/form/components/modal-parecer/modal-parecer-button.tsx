import { PlusOutlined } from '@ant-design/icons';
import { Badge, ButtonProps, Col, ColProps, Form, Row } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import { CamposParecerEnum } from '~/core/enum/campos-proposta-enum';
import { mostrarQtdParecer } from '~/core/utils/functions';
import { ModalParecer } from './modal-parecer';

type ButtonParecerProps = {
  childrenProps?: ColProps;
  campo: CamposParecerEnum;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
};

export const ButtonParecer: React.FC<ButtonParecerProps> = ({
  campo,
  children,
  buttonProps,
  childrenProps,
}) => {
  const paramsRoute = useParams();
  const form = Form.useFormInstance();
  const [open, setOpen] = useState<boolean>(false);
  const propostaId = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const totalDePareceres = form.getFieldsValue(true).totalDePareceres;
  const exibirParecer = form.getFieldsValue(true).exibirParecer;

  const showModal = () => setOpen(true);

  const btnParecer = (
    <Col>
      <Badge count={mostrarQtdParecer(campo, totalDePareceres)}>
        <ButtonSecundary
          size='middle'
          disabled={false}
          block={undefined}
          onClick={showModal}
          icon={<PlusOutlined />}
          {...buttonProps}
        />
      </Badge>
    </Col>
  );

  const montarBotaoParecer = exibirParecer ? btnParecer : <></>;

  return (
    <>
      {children ? (
        <Row align='middle' gutter={[16, 16]}>
          <Col flex={1} {...childrenProps}>
            {children}
          </Col>
          {montarBotaoParecer}
        </Row>
      ) : (
        <>{montarBotaoParecer}</>
      )}
      {open && (
        <ModalParecer
          campo={campo}
          propostaId={propostaId}
          onFecharButton={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};
