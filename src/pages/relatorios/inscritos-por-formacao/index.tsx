import { AutoComplete, Button, Col, DatePicker, Form, Row, Select, StepProps } from 'antd';
import locale from 'antd/es/date-picker/locale/pt_BR';
import { useForm } from 'antd/es/form/Form';
import { DefaultOptionType } from 'antd/es/select';
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardContent from '~/components/lib/card-content';
import HeaderPage from '~/components/lib/header-page';
import ButtonVoltar from '~/components/main/button/voltar';
import SelectAreaPromotora from '~/components/main/input/area-promotora';
import { SelectDRE } from '~/components/main/input/dre';
import InputEmail from '~/components/main/input/email';
import SelectModalidade from '~/components/main/input/modalidades';
import SelectPublicoAlvo from '~/components/main/input/publico-alvo';
import SelectAnoEtapa from '~/components/main/input/ano-etapa';
import SelectComponenteCurricular from '~/components/main/input/componente-curricular';

import InputNumero from '~/components/main/numero';
import Steps from '~/components/main/steps';
import InputTexto from '~/components/main/text/input-text';
import { notification } from '~/components/lib/notification';
import { ROUTES } from '~/core/enum/routes-enum';
import { Formato, FormatoDisplay } from '~/core/enum/formato';
// import { SituacaoProposta, SituacaoPropostaTagDisplay } from '~/core/enum/situacao-proposta';
import { SituacaoInscricao, SituacaoInscricaoTagDisplay } from '~/core/enum/situacao-inscricao';
import { obterFuncaoEspecifica } from '~/core/services/cargo-funcao-service';
import { obterTurmasInscricao } from '~/core/services/inscricao-service';
import { autocompletarFormacao, PropostaAutocompletarDTO } from '~/core/services/proposta-service';
import { gerarRelatorioInscritosPorFormacao } from '~/core/services/relatorio-service';
import { RetornoListagemDTO } from '~/core/dto/retorno-listagem-dto';
import { carregarUesPorDre, UeDTO } from '~/core/services/ue-service';
import { onClickVoltar } from '~/core/utils/form';

const TOTAL_STEPS = 3;

const stepsRelatorio: StepProps[] = [
  { title: 'Formação' },
  { title: 'Público e estrutura' },
  { title: 'Dados do cursista' },
];

const simNaoOptions: DefaultOptionType[] = [
  { label: 'Sim', value: 'sim' },
  { label: 'Não', value: 'nao' },
];

const simNaoParaBoolean = (value: string | undefined): boolean | undefined => {
  if (value === 'sim') return true;
  if (value === 'nao') return false;
  return undefined;
};

const RelatorioInscritosPorFormacao: React.FC = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [funcaoOptions, setFuncaoOptions] = useState<DefaultOptionType[]>([]);
  const [opcoesUe, setOpcoesUe] = useState<UeDTO[]>([]);
  const [loadingUe, setLoadingUe] = useState(false);
  const [turmasOptions, setTurmasOptions] = useState<RetornoListagemDTO[]>([]);
  const [opcoesHomologacao, setOpcoesHomologacao] = useState<PropostaAutocompletarDTO[]>([]);
  const pcd = Form.useWatch('pcd', form);
  const propostaId = Form.useWatch('propostaId', form);
  const numeroHomologacao = Form.useWatch('numeroHomologacao', form);
  const dreId = Form.useWatch('dreId', form);
  const modalidade = Form.useWatch('modalidade', form);
  const anosTurmas = Form.useWatch('anosTurmas', form);
  const periodoRealizacao = Form.useWatch('periodoRealizacao', form);
  const turmaDisabled = !numeroHomologacao;
  const periodoEnabled = !(propostaId && numeroHomologacao);
  const [loadingAutocompleteHomologacao, setLoadingAutocompleteHomologacao] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  useEffect(() => {
    obterFuncaoEspecifica().then((res) => {
      if (res.sucesso) {
        setFuncaoOptions(res.dados.map((item) => ({ label: item.nome, value: item.id })));
      }
    });
  }, []);

  useEffect(() => {
    if (!numeroHomologacao) {
      form.setFieldValue('propostaTurmaId', undefined);
      setTurmasOptions([]);
    }
  }, [numeroHomologacao, form]);

  const onSearchHomologacao = async (searchText: string) => {
    if (!searchText) {
      setOpcoesHomologacao([]);
      return;
    }
    setLoadingAutocompleteHomologacao(true);
    try {
      const response = await autocompletarFormacao(searchText);
      if (response.sucesso && response.dados?.items) {
        setOpcoesHomologacao(response.dados.items);
      } else {
        setOpcoesHomologacao([]);
      }
    } catch {
      setOpcoesHomologacao([]);
    } finally {
      setLoadingAutocompleteHomologacao(false);
    }
  };

  const onSelectHomologacao = async (_value: string, option: any) => {
    const proposta = opcoesHomologacao.find(
      (p) => p.numeroHomologacao === option.numeroHomologacao,
    );
    form.setFieldValue('propostaTurmaId', undefined);
    setTurmasOptions([]);
    if (proposta) {
      try {
        const response = await obterTurmasInscricao(proposta.propostaId);
        if (response.sucesso && response.dados?.length) {
          setTurmasOptions(response.dados);
        }
      } catch {
        setTurmasOptions([]);
      }
    }
  };

  const onDreChange = () => {
    form.setFieldValue('ueId', undefined);
  };

  useEffect(() => {
    if (!periodoEnabled) form.setFieldValue('periodoRealizacao', undefined);
  }, [periodoEnabled, form]);

  useEffect(() => {
    const dreIdValue = dreId?.value ?? dreId;
    if (dreIdValue) {
      setLoadingUe(true);
      carregarUesPorDre(dreIdValue)
        .then((res) => setOpcoesUe(res.sucesso && res.dados?.items ? res.dados.items : []))
        .finally(() => setLoadingUe(false));
    } else {
      setOpcoesUe([]);
    }
  }, [dreId]);

  const proximoPasso = () => {
    if (isFirstStep && periodoEnabled && !periodoRealizacao) {
      notification.warning({
        message: 'Campo obrigatório',
        description: 'Informe o Período de realização antes de avançar.',
      });
      return;
    }
    if (!isLastStep) setCurrentStep((s) => s + 1);
  };

  const passoAnterior = () => {
    if (!isFirstStep) setCurrentStep((s) => s - 1);
  };

  const gerarRelatorio = async () => {
    const values = form.getFieldsValue(true);
    const periodo: [Dayjs, Dayjs] | undefined = values.periodoRealizacao;

    const filtros = {
      propostaId: values.propostaId ?? undefined,
      numeroHomologacao: values.numeroHomologacao ? Number(values.numeroHomologacao) : undefined,
      nomeFormacao: values.nomeFormacao ?? undefined,
      propostaTurmaId: values.propostaTurmaId ?? undefined,
      formato: values.formato ?? undefined,
      areaPromotoraId: values.areaPromotoraId ?? undefined,
      periodoDeRealizacaoInicial: periodo?.[0]?.toISOString() ?? undefined,
      periodoDeRealizacaoFinal: periodo?.[1]?.toISOString() ?? undefined,
      situacaoProposta: values.situacaoProposta ?? undefined,
      situacaoInscricao: values.situacaoInscricao ?? undefined,
      cargoPublicoAlvoId: Array.isArray(values.cargoPublicoAlvoId)
        ? values.cargoPublicoAlvoId[0]
        : values.cargoPublicoAlvoId ?? undefined,
      funcaoId: values.funcaoId ?? undefined,
      modalidade: values.modalidade ?? undefined,
      anoTurmaId: Array.isArray(values.anosTurmas) ? values.anosTurmas[0] : undefined,
      componenteCurricularId: Array.isArray(values.componentesCurriculares)
        ? values.componentesCurriculares[0]
        : undefined,
      dreId: values.dreId?.value ?? values.dreId ?? undefined,
      ueId: values.ueId ?? undefined,
      documentoCursista: values.documentoCursista ?? undefined,
      email: values.email ?? undefined,
      pcd: simNaoParaBoolean(values.pcd),
      necessitaAdaptacao: simNaoParaBoolean(values.necessitaAdaptacao),
    };

    const response = await gerarRelatorioInscritosPorFormacao(filtros);

    if (response.sucesso) {
      notification.success({
        message: 'Sucesso',
        description:
          'Solicitação enviada. Você receberá uma notificação assim que o relatório estiver disponível.',
      });
    } else {
      notification.error({
        message: 'Erro',
        description: 'Não foi possível gerar o relatório. Tente novamente.',
      });
    }
  };

  const formatoOptions = Object.values(Formato)
    .filter((v): v is Formato => typeof v === 'number')
    .map((v) => ({ label: FormatoDisplay[v], value: v }));

  // const situacaoFormacaoOptions = Object.values(SituacaoProposta)
  //   .filter((v): v is SituacaoProposta => typeof v === 'number')
  //   .map((v) => ({ label: SituacaoPropostaTagDisplay[v], value: v }));

  const situacaoInscricaoOptions = Object.values(SituacaoInscricao)
    .filter((v): v is SituacaoInscricao => typeof v === 'number')
    .map((v) => ({ label: SituacaoInscricaoTagDisplay[v], value: v }));

  const renderStep = () => {
    if (currentStep === 0) {
      return (
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 20 }}>Formação</h3>
          <p style={{ marginBottom: 24 }}>
            Informe os dados principais da formação para definir o escopo do relatório.
          </p>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8}>
              <InputNumero
                formItemProps={{ label: 'Código da formação', name: 'propostaId' }}
                inputProps={{ placeholder: 'Código da formação', allowClear: true }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label='Código da homologação' name='numeroHomologacao'>
                <AutoComplete
                  placeholder='Digite para buscar formação'
                  allowClear
                  onSearch={onSearchHomologacao}
                  onSelect={onSelectHomologacao}
                  options={opcoesHomologacao.map((opcao) => ({
                    value: opcao.numeroHomologacao.toString(),
                    label: opcao.numeroHomologacao.toString(),
                    numeroHomologacao: opcao.numeroHomologacao,
                  }))}
                  filterOption={false}
                  notFoundContent={
                    loadingAutocompleteHomologacao ? 'Buscando...' : 'Nenhuma formação encontrada'
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <InputTexto
                formItemProps={{ label: 'Nome da formação', name: 'nomeFormacao' }}
                inputProps={{ placeholder: 'Nome da formação', maxLength: 200, allowClear: true }}
              />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label='Turma' name='propostaTurmaId'>
                <Select
                  placeholder='Selecione a turma'
                  options={turmasOptions.map((t) => ({ label: t.descricao, value: t.id }))}
                  disabled={turmaDisabled}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label='Modalidade formativa' name='formato'>
                <Select placeholder='Selecione a modalidade' options={formatoOptions} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <SelectAreaPromotora formItemProps={{ name: 'areaPromotoraId' }} />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12}>
              <Form.Item label='Período de realização' name='periodoRealizacao'>
                <DatePicker.RangePicker
                  format='DD/MM/YYYY'
                  locale={locale}
                  style={{ width: '100%' }}
                  placeholder={['Data início', 'Data fim']}
                  disabled={!periodoEnabled}
                />
              </Form.Item>
            </Col>
            {/* <Col xs={24} sm={12} md={8}>
              <Form.Item label='Situação da formação' name='situacaoProposta'>
                <Select
                  placeholder='Selecione a situação'
                  options={situacaoFormacaoOptions}
                  allowClear
                />
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={12}>
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
      return (
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 20 }}>Público e estrutura</h3>
          <p style={{ marginBottom: 24 }}>
            Detalhe o público e a estrutura envolvidos para refinar o resultado do relatório.
          </p>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12} md={8}>
              <SelectPublicoAlvo
                required={false}
                exibirTooltip={false}
                formItemProps={{ name: 'cargoPublicoAlvoId', rules: [{ required: false }] }}
                selectProps={{ mode: undefined }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label='Função específica' name='funcaoId'>
                <Select allowClear placeholder='Função específica' options={funcaoOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <SelectModalidade formItemProps={{ rules: [{ required: false }] }} />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12}>
              <SelectAnoEtapa exibirOpcaoTodos={true} desativarCampo={!modalidade} />
            </Col>
            <Col xs={24} sm={12}>
              <SelectComponenteCurricular
                exibirOpcaoTodos={true}
                desativarCampo={!anosTurmas?.length}
              />
            </Col>
          </Row>

          <Row gutter={[16, 8]}>
            <Col xs={24} sm={12}>
              <SelectDRE
                formItemProps={{
                  label: 'Diretoria Regional de Educação (DRE)',
                  name: 'dreId',
                  rules: [{ required: false }],
                }}
                selectProps={{
                  mode: undefined,
                  allowClear: true,
                  onChange: onDreChange,
                }}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label='Unidade Educacional' name='ueId'>
                <Select
                  placeholder='Selecione a Unidade Educacional'
                  allowClear
                  showSearch
                  disabled={!dreId}
                  loading={loadingUe}
                  options={opcoesUe.map((ue) => ({ value: ue.id, label: ue.nome }))}
                  filterOption={(input, option) =>
                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                  notFoundContent={loadingUe ? 'Carregando...' : 'Nenhuma UE encontrada'}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: 20 }}>Dados do cursista</h3>
        <p style={{ marginBottom: 24 }}>
          Preencha esta etapa apenas se desejar gerar o relatório para um cursista específico.
        </p>

        <Row gutter={[16, 8]}>
          <Col xs={24} sm={12}>
            <InputTexto
              formItemProps={{ label: 'RF/CPF', name: 'documentoCursista' }}
              inputProps={{ placeholder: 'RF ou CPF', maxLength: 14, allowClear: true }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <InputEmail formItemProps={{ required: false }} />
          </Col>
        </Row>

        <Row gutter={[16, 8]}>
          {/* <Col xs={24} sm={12}>
            <Form.Item label='Situação de conclusão do cursista' name='situacaoInscricao'>
              <Select
                allowClear
                placeholder='Selecione a situação'
                options={situacaoInscricaoOptions}
              />
            </Form.Item>
          </Col> */}
          <Col xs={24} sm={12}>
            <Form.Item label='Pessoa com deficiência?' name='pcd'>
              <Select
                allowClear
                placeholder='Selecione'
                options={simNaoOptions}
                onChange={(value) => {
                  if (value !== 'sim') form.setFieldValue('necessitaAdaptacao', undefined);
                }}
              />
            </Form.Item>
          </Col>
          {pcd === 'sim' && (
            <Col xs={24} sm={12}>
              <Form.Item label='Precisa de adaptação?' name='necessitaAdaptacao'>
                <Select allowClear placeholder='Selecione' options={simNaoOptions} />
              </Form.Item>
            </Col>
          )}
        </Row>
      </div>
    );
  };

  return (
    <Col>
      <HeaderPage title='Relatório de inscritos por formação'>
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
              <Button
                type='primary'
                style={{ fontWeight: 700 }}
                disabled={!isLastStep}
                onClick={gerarRelatorio}
              >
                Gerar Relatório
              </Button>
            </Col>
          </Row>
        </Col>
      </HeaderPage>

      <br></br>

      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        labelCol={{ style: { fontWeight: 600 } }}
      >
        <CardContent><br></br><br></br>
          <Steps current={currentStep} items={stepsRelatorio} style={{ marginBottom: 40 }} />
          <br></br>{renderStep()}
        </CardContent>
      </Form>
    </Col>
  );
};

export default RelatorioInscritosPorFormacao;
