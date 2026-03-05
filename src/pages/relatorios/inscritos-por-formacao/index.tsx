import { Button, Col, DatePicker, Form, Row, Select, StepProps } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import InputNumero from '~/components/main/numero';
import Steps from '~/components/main/steps';
import InputTexto from '~/components/main/text/input-text';
import { ROUTES } from '~/core/enum/routes-enum';
import { Modalidade, ModalidadeDisplay } from '~/core/enum/modalidade';
import { SituacaoProposta, SituacaoPropostaTagDisplay } from '~/core/enum/situacao-proposta';
import { SituacaoInscricao, SituacaoInscricaoTagDisplay } from '~/core/enum/situacao-inscricao';
import { onClickVoltar } from '~/core/utils/form';

const TOTAL_STEPS = 3;

const stepsRelatorio: StepProps[] = [
  { title: 'Formação' },
  { title: 'Estrutura organizacional' },
  { title: 'Dados do cursista' },
];

const RelatorioInscritosPorFormacao: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const proximoPasso = () => {
    if (!isLastStep) setCurrentStep((s) => s + 1);
  };

  const passoAnterior = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const modalidadeOptions = Object.values(Modalidade)
    .filter((v): v is Modalidade => typeof v === 'number')
    .map((v) => ({ label: ModalidadeDisplay[v], value: v }));

  const situacaoFormacaoOptions = Object.values(SituacaoProposta)
    .filter((v): v is SituacaoProposta => typeof v === 'number')
    .map((v) => ({ label: SituacaoPropostaTagDisplay[v], value: v }));

  const situacaoInscricaoOptions = Object.values(SituacaoInscricao)
    .filter((v): v is SituacaoInscricao => typeof v === 'number')
    .map((v) => ({ label: SituacaoInscricaoTagDisplay[v], value: v }));

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Formação</h3>
          <p style={{ marginBottom: 24 }}>
            Informe os dados principais da formação para definir o escopo do relatório.
          </p>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8}>
              <InputNumero
                formItemProps={{
                  label: 'Código da formação',
                  name: 'codigoFormacao',
                }}
                inputProps={{
                  placeholder: 'Código da formação',
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputNumero
                formItemProps={{
                  label: 'Código da homologação',
                  name: 'codigoHomologacao',
                }}
                inputProps={{
                  placeholder: 'Código da homologação',
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputTexto
                formItemProps={{
                  label: 'Nome da formação',
                  name: 'nomeFormacao',
                }}
                inputProps={{
                  placeholder: 'Nome da formação',
                  maxLength: 200,
                  allowClear: true,
                }}
              />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8}>
              <InputTexto
                formItemProps={{
                  label: 'Turma',
                  name: 'turma',
                }}
                inputProps={{
                  placeholder: 'Turma',
                  maxLength: 100,
                  allowClear: true,
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label='Modalidade formativa' name='modalidade'>
                <Select
                  placeholder='Selecione a modalidade'
                  options={modalidadeOptions}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <SelectAreaPromotora formItemProps={{ name: 'areaPromotoraId' }} />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label='Período de realização'
                name='periodoRealizacao'
                rules={[{ required: true, message: 'Informe o período de realização' }]}
              >
                <DatePicker.RangePicker
                  format='DD/MM/YYYY'
                  locale={locale}
                  style={{ width: '100%' }}
                  placeholder={['Data início', 'Data fim']}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label='Situação da formação' name='situacaoFormacao'>
                <Select
                  placeholder='Selecione a situação'
                  options={situacaoFormacaoOptions}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label='Situação das inscrições' name='situacaoInscricao'>
                <Select
                  placeholder='Selecione a situação'
                  options={situacaoInscricaoOptions}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    }

    if (currentStep === 1) {
      return <div>Estrutura organizacional</div>;
    }

    return <div>Dados do cursista</div>;
  };

  return (
    <Col>
      <HeaderPage title='Inscritos por Formação'>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col>
              <ButtonVoltar onClick={() => onClickVoltar({ navigate, route: ROUTES.PRINCIPAL })} />
            </Col>
            <Col>
              <Button style={{ fontWeight: 700 }} disabled={isFirstStep} onClick={passoAnterior}>
                Anterior
              </Button>
            </Col>
            <Col>
              <Button style={{ fontWeight: 700 }} disabled={isLastStep} onClick={proximoPasso}>
                Próximo
              </Button>
            </Col>
            <Col>
              <Button type='primary' style={{ fontWeight: 700 }} disabled={!isLastStep}>
                Gerar Relatório
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <Form form={form} layout='vertical' autoComplete='off'>
        <CardContent>
          <Steps current={currentStep} items={stepsRelatorio} style={{ marginBottom: 40 }} />
          {renderStep()}
        </CardContent>
      </Form>
    </Col>
  );
};

export default RelatorioInscritosPorFormacao;
