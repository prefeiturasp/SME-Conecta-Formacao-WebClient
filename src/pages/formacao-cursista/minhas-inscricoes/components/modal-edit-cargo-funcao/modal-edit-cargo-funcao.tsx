import { Form, Modal as ModalAntd, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import React, { useCallback, useEffect, useState } from 'react';
import Select from '~/components/lib/inputs/select';
import Modal from '~/components/lib/modal';
import { notification } from '~/components/lib/notification';
import { CF_SELECT_CARGO } from '~/core/constants/ids/select';
import { validateMessages } from '~/core/constants/validate-messages';
import { DadosVinculoInscricaoDTO } from '~/core/dto/dados-usuario-inscricao-dto';
import { alterarVinculo, obterDadosInscricao } from '~/core/services/inscricao-service';
import { Colors } from '~/core/styles/colors';
import { InscricaoProps } from '../../listagem';

const { confirm } = ModalAntd;

type ModalEditCargoFuncaoProps = {
  initialValues: InscricaoProps;
  closeModal: (updateTable: boolean) => void;
};

export const ModalEditCargoFuncao: React.FC<ModalEditCargoFuncaoProps> = ({
  initialValues,
  closeModal,
}) => {
  const [form] = useForm();

  const [loading, setLoading] = useState(false);
  const [listaUsuarioCargos, setListaUsuarioCargos] = useState<DefaultOptionType[]>([]);

  const carregarDadosInscricao = useCallback(async () => {
    const resposta = await obterDadosInscricao();

    if (resposta.sucesso) {
      const dados = resposta.dados;

      let usuarioCargos: DefaultOptionType[] = [];

      if (dados?.usuarioCargos?.length) {
        usuarioCargos = dados.usuarioCargos.map((item) => {
          return {
            ...item,
            value: `${item.codigo}-${item.tipoVinculo}`,
            label: item.descricao,
            tipoVinculo: item.tipoVinculo,
            codigo: item.codigo
          };
        });

        setListaUsuarioCargos(usuarioCargos);
      }
    }
  }, []);

  useEffect(() => {
    carregarDadosInscricao();
  }, []);

  const openNotificationSuccess = () => {
    notification.success({
      message: 'Sucesso',
      description: 'Registro alterado com sucesso!',
    });
  };

  const handleOk = () => {
    setLoading(true);

    const values = form.getFieldsValue(true);
    const cargoFuncao = listaUsuarioCargos.find(item => values.cargoFuncao === item.value);

    const params: DadosVinculoInscricaoDTO = {
      id: initialValues.id,
      cargoCodigo: cargoFuncao?.codigo,
      tipoVinculo: cargoFuncao?.tipoVinculo,
    };

    alterarVinculo(params)
      .then((resposta) => {
        if (resposta.sucesso) {
          openNotificationSuccess();
          closeModal(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const validateFields = () => {
    form.validateFields().then(() => {
      handleOk();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal(false);
  };

  const showConfirmCancel = () => {
    if (form.isFieldsTouched()) {
      confirm({
        width: 500,
        title: 'Atenção',
        icon: <></>,
        content:
          'Você não salvou o novo cargo/função/vínculo, confirma que deseja descartar a alteração?',
        onOk() {
          handleCancel();
        },
        okButtonProps: { type: 'default' },
        cancelButtonProps: {
          type: 'text',
          style: { color: Colors.Neutral.DARK },
        },
        okText: 'Confirmar',
        cancelText: 'Cancelar',
      });
    } else {
      handleCancel();
    }
  };

  return (
    <Modal
      open
      title='Alterar Cargo/Função/Vínculo'
      onOk={validateFields}
      onCancel={showConfirmCancel}
      centered
      destroyOnClose
      closable={!loading}
      maskClosable={!loading}
      keyboard={!loading}
      okText='Alterar'
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout='vertical'
          autoComplete='off'
          validateMessages={validateMessages}
          initialValues={{
            cargoFuncao: `${initialValues?.cargoFuncaoCodigo}-${initialValues?.tipoVinculo}`,
          }}
        >
          <Form.Item label='Cargo' name='cargoFuncao' rules={[{ required: true }]}>
            <Select
              options={listaUsuarioCargos}
              placeholder='Selecione um cargo'
              id={CF_SELECT_CARGO}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
