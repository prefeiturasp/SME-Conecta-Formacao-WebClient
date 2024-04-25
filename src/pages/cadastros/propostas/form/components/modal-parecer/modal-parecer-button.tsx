import { PlusOutlined } from '@ant-design/icons';
import { Badge, ButtonProps, Col, ColProps, Form, Row } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import { CamposParecerEnum } from '~/core/enum/campos-proposta-enum';
import { SituacaoProposta } from '~/core/enum/situacao-proposta';
import { ModalParecer } from './modal-parecer';

type ButtonParecerProps = {
  childrenProps?: ColProps;
  campo: CamposParecerEnum;
  buttonProps?: ButtonProps;
  children?: React.ReactNode;
  qtdParecer: number | undefined;
};

export const ButtonParecer: React.FC<ButtonParecerProps> = ({
  campo,
  children,
  buttonProps,
  qtdParecer,
  childrenProps,
}) => {
  const paramsRoute = useParams();
  const form = Form.useFormInstance();

  const showModal = () => setOpen(true);
  const [open, setOpen] = useState<boolean>(false);
  const propostaId = paramsRoute?.id ? parseInt(paramsRoute?.id) : 0;

  const situacaoProposta = form.getFieldsValue(true).situacao;
  const situacaoAguardandoAnaliseParecerista =
    situacaoProposta === SituacaoProposta.AguardandoAnaliseParecerista;

  const btnParecer = (
    <Col>
      <Badge count={qtdParecer || 0}>
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

  return (
    <>
      {children ? (
        <Row align='middle' gutter={[16, 16]}>
          <Col flex={1} {...childrenProps}>
            {children}
          </Col>
          {situacaoAguardandoAnaliseParecerista ? btnParecer : <></>}
        </Row>
      ) : (
        btnParecer
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
