import { InfoCircleFilled } from '@ant-design/icons';
import { Col, Form, Input, Row, Tooltip } from 'antd';

import jwt_decode from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import SelectAnoEtapa from '~/components/main/input/ano-etapa';
import SelectComponenteCurricular from '~/components/main/input/componente-curricular';
import SelectCriteriosValidacaoInscricoes from '~/components/main/input/criterios-validacao-inscricoes';
import { SelectDRE } from '~/components/main/input/dre';
import RadioFormacaoHomologada from '~/components/main/input/formacao-homologada';
import SelectFormato from '~/components/main/input/formato';
import SelectFuncaoEspecifica from '~/components/main/input/funcao-especifica';
import SelectModalidade from '~/components/main/input/modalidades';
import RadioSimNao from '~/components/main/input/profissional-rede-municipal';
import SelectTipoInscricao from '~/components/main/input/tipo-Inscricao';
import RadioTipoFormacao from '~/components/main/input/tipo-formacao';
import SelectVagasRemanescentes from '~/components/main/input/vagas-remanescentes';
import InputNumero from '~/components/main/numero';
import { getTooltipFormInfoCircleFilled } from '~/components/main/tooltip';
import UploadArquivosConectaFormacao from '~/components/main/upload';
import {
  CF_INPUT_LINK_INSCRICOES_EXTERNA,
  CF_INPUT_NOME_FORMACAO,
  CF_INPUT_QUANTIDADE_TURMAS,
  CF_INPUT_QUANTIDADE_VAGAS_TURMA,
  CF_INPUT_TOTAL_VAGAS,
} from '~/core/constants/ids/input';
import { CF_RADIO_INTEGRA_NO_SGA } from '~/core/constants/ids/radio';
import { CF_SELECT_DRE_CADASTRO_PROPOSTAS } from '~/core/constants/ids/select';
import {
  LINK_INSCRICOES_EXTERNA,
  NOME_FORMACAO_NAO_INFORMADO,
  QUANTIDADE_DE_TURMAS_NAO_INFORMADA,
  QUANTIDADE_DE_VAGAS_POR_TURMAS_NAO_INFORMADA,
} from '~/core/constants/mensagens';
import { JWTDecodeDTO } from '~/core/dto/jwt-decode-dto';
import { PropostaFormDTO } from '~/core/dto/proposta-dto';
import { AreaPromotoraTipoEnum } from '~/core/enum/area-promotora-tipo';
import { CamposParecerEnum } from '~/core/enum/campos-proposta-enum';
import { SituacaoProposta } from '~/core/enum/situacao-proposta';
import { useAppSelector } from '~/core/hooks/use-redux';
import { Colors } from '~/core/styles/colors';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ButtonParecer } from '../../components/modal-parecer/modal-parecer-button';
import SelectPublicoAlvoCadastroProposta from './components/select/select-publico-alvo';
import TabelaEditavel from './components/table/turmas';

type FormInformacoesGeraisProps = {
  listaDres: any[];
  formInitialValues?: PropostaFormDTO;
  tipoInstituicao?: AreaPromotoraTipoEnum;
};

const FormInformacoesGerais: React.FC<FormInformacoesGeraisProps> = ({
  listaDres,
  tipoInstituicao,
  formInitialValues,
}) => {
  const form = Form.useFormInstance();

  const { desabilitarCampos } = useContext(PermissaoContext);

  const token = useAppSelector((store) => store.auth.token);
  const decodeObject: JWTDecodeDTO = jwt_decode(token);
  const dresVinculadas = decodeObject?.dres;
  const [exibirLinkExterno, setExibirLinkExterno] = useState<boolean>(false);

  const temDreVinculada =
    typeof dresVinculadas === 'string' ||
    (Array.isArray(dresVinculadas) && dresVinculadas.length > 0);

  useEffect(() => {
    if (!exibirLinkExterno) {
      form.setFieldValue('linkParaInscricoesExterna', undefined);
    }
  }, [form, exibirLinkExterno]);
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} sm={24} md={16} lg={10}>
        <ButtonParecer
          childrenProps={{ flex: 'none' }}
          campo={CamposParecerEnum.formacaoHomologada}
        >
          <RadioFormacaoHomologada
            name='formacaoHomologada'
            label='Formação homologada por SME/COPED/DF'
            required
          />
        </ButtonParecer>
      </Col>

      <Col xs={24} sm={12} md={8} lg={4}>
        <ButtonParecer campo={CamposParecerEnum.tipoFormacao} childrenProps={{ flex: 'none' }}>
          <RadioTipoFormacao />
        </ButtonParecer>
      </Col>

      <Col xs={24} sm={12} md={14} lg={10}>
        <ButtonParecer campo={CamposParecerEnum.formato}>
          <SelectFormato />
        </ButtonParecer>
      </Col>

      {tipoInstituicao && tipoInstituicao === AreaPromotoraTipoEnum.RedeDireta ? (
        <Col xs={24} sm={12} md={6} lg={6}>
          <ButtonParecer childrenProps={{ flex: 'none' }} campo={CamposParecerEnum.integrarNoSGA}>
            <RadioSimNao
              formItemProps={{
                initialValue: true,
                name: 'integrarNoSGA',
                label: 'Integrar no SGA',
              }}
              radioGroupProps={{
                id: CF_RADIO_INTEGRA_NO_SGA,
              }}
            />
          </ButtonParecer>
          <ButtonParecer campo={CamposParecerEnum.tiposInscricao}>
            <SelectTipoInscricao
              exibirLink={setExibirLinkExterno}
              selectProps={{
                mode: 'multiple',
              }}
            />
          </ButtonParecer>
        </Col>
      ) : (
        <></>
      )}

      <Col span={24}>
        <ButtonParecer campo={CamposParecerEnum.tiposInscricao}>
          <Form.Item
            key='codigoEventoSigpec'
            name='codigoEventoSigpec'
            label='Código do Evento (SIGPEC)'
          >
            <Input
              type='text'
              maxLength={10}
              id={CF_INPUT_NOME_FORMACAO}
              placeholder='Informe o Código do Evento (SIGPEC)'
            />
          </Form.Item>
        </ButtonParecer>
      </Col>

      {exibirLinkExterno ? (
        <Col xs={24} sm={14} md={24}>
          <Form.Item
            name='linkParaInscricoesExterna'
            label='Link para Inscrições'
            rules={[
              { required: exibirLinkExterno, whitespace: true, message: LINK_INSCRICOES_EXTERNA },
            ]}
          >
            <Input
              type='text'
              maxLength={200}
              id={CF_INPUT_LINK_INSCRICOES_EXTERNA}
              placeholder='Informe o Link para Inscrições Externas'
            />
          </Form.Item>
        </Col>
      ) : (
        <></>
      )}
      <Col span={24}>
        <ButtonParecer campo={CamposParecerEnum.dres}>
          <SelectDRE
            exibirOpcaoTodos
            carregarDadosAutomaticamente={false}
            formItemProps={{
              name: 'dres',
            }}
            selectProps={{
              mode: 'multiple',
              labelInValue: true,
              options: listaDres,
              disabled: temDreVinculada || desabilitarCampos,
              id: CF_SELECT_DRE_CADASTRO_PROPOSTAS,
            }}
          />
        </ButtonParecer>
      </Col>

      <Col xs={24} sm={14} md={24}>
        <ButtonParecer campo={CamposParecerEnum.nomeFormacao}>
          <Form.Item
            key='nomeFormacao'
            name='nomeFormacao'
            label='Nome da formação'
            tooltip={{
              title:
                'O título da formação deve apresentar de forma sucinta a ideia central do tema que será tratado, indicando ao cursista a macro área do tema e a especificidade do curso proposto.',
              icon: (
                <Tooltip>
                  <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
                </Tooltip>
              ),
            }}
            rules={[{ required: true, whitespace: true, message: NOME_FORMACAO_NAO_INFORMADO }]}
          >
            <Input
              type='text'
              maxLength={150}
              id={CF_INPUT_NOME_FORMACAO}
              placeholder='Escreva o título da formação'
            />
          </Form.Item>
        </ButtonParecer>
      </Col>

      <Col span={24}>
        <ButtonParecer campo={CamposParecerEnum.publicosAlvo}>
          <SelectPublicoAlvoCadastroProposta />
        </ButtonParecer>
      </Col>

      <Col span={24}>
        <ButtonParecer campo={CamposParecerEnum.funcoesEspecificas}>
          <SelectFuncaoEspecifica
            formItemProps={{
              tooltip: getTooltipFormInfoCircleFilled(
                'O curso/evento é SOMENTE para o servidor que esteja exercendo alguma função específica? Em caso afirmativo, identifique a função (Ex: Prof. de Matemática; Diretor de CEI; Prof. Regente no Ciclo de Alfabetização; POED, outras).',
              ),
            }}
          />
        </ButtonParecer>
      </Col>

      <Col span={24}>
        <ButtonParecer campo={CamposParecerEnum.modalidade}>
          <SelectModalidade />
        </ButtonParecer>
      </Col>

      <Col span={24}>
        <ButtonParecer campo={CamposParecerEnum.anosTurmas}>
          <SelectAnoEtapa />
        </ButtonParecer>
      </Col>

      <Col span={24}>
        <ButtonParecer campo={CamposParecerEnum.componentesCurriculares}>
          <SelectComponenteCurricular />
        </ButtonParecer>
      </Col>

      <Col xs={24}>
        <ButtonParecer campo={CamposParecerEnum.criteriosValidacaoInscricao}>
          <SelectCriteriosValidacaoInscricoes />
        </ButtonParecer>
      </Col>

      <Col xs={24}>
        <ButtonParecer campo={CamposParecerEnum.vagasRemanecentes}>
          <SelectVagasRemanescentes />
        </ButtonParecer>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <ButtonParecer campo={CamposParecerEnum.quantidadeTurmas}>
          <InputNumero
            formItemProps={{
              label: 'Quantidade de turmas',
              name: 'quantidadeTurmas',
              rules: [
                { required: true, message: QUANTIDADE_DE_TURMAS_NAO_INFORMADA },
                {
                  message: `A quantidade de turmas não pode ser menor do que já tem cadastrado (${formInitialValues?.quantidadeTurmas})`,
                  validator: (_: any, value: string) => {
                    if (
                      formInitialValues?.situacao === SituacaoProposta.Publicada ||
                      formInitialValues?.situacao === SituacaoProposta.Alterando
                    ) {
                      const quantidadeTurmas = formInitialValues?.quantidadeTurmas;

                      if (quantidadeTurmas && Number(value) >= quantidadeTurmas) {
                        form.setFieldValue('quantidadeTurmas', value);
                        return Promise.resolve();
                      }

                      if (Number(value) !== quantidadeTurmas) {
                        return Promise.reject();
                      }
                    }

                    return Promise.resolve();
                  },
                },
              ],
            }}
            inputProps={{
              id: CF_INPUT_QUANTIDADE_TURMAS,
              placeholder: 'Quantidade de turmas',
              maxLength: 3,
            }}
          />
        </ButtonParecer>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <ButtonParecer campo={CamposParecerEnum.quantidadeVagasTurma}>
          <InputNumero
            formItemProps={{
              label: 'Vagas por turma',
              name: 'quantidadeVagasTurma',
              rules: [{ required: true, message: QUANTIDADE_DE_VAGAS_POR_TURMAS_NAO_INFORMADA }],
              tooltip: {
                title:
                  'Tanto nos cursos presenciais, quanto nos cursos a distância, a proporção máxima aceita será de 50 (cinquenta) cursistas por turma/tutor. Nos eventos presenciais, a quantidade de participantes poderá se adequar à capacidade do espaço. Nos eventos a distância/híbridos, a proporção máxima aceita será de 200 (duzentas) pessoas, sendo a proporção máxima de um tutor para 50 (cinquenta) participantes.',
                icon: (
                  <Tooltip>
                    <InfoCircleFilled style={{ color: Colors.Suporte.Primary.INFO }} />
                  </Tooltip>
                ),
              },
            }}
            inputProps={{
              id: CF_INPUT_QUANTIDADE_VAGAS_TURMA,
              placeholder: 'Vagas por turma',
              maxLength: 4,
            }}
          />
        </ButtonParecer>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Form.Item shouldUpdate style={{ marginBottom: 0, marginTop: 0 }}>
          {(form) => {
            const quantidadeTurmas = form.getFieldValue('quantidadeTurmas') || 0;
            const quantidadeVagasTurma = form.getFieldValue('quantidadeVagasTurma') || 0;

            const totalVagas = quantidadeTurmas * quantidadeVagasTurma;

            return (
              <InputNumero
                formItemProps={{
                  label: 'Total de vagas',
                }}
                inputProps={{
                  id: CF_INPUT_TOTAL_VAGAS,
                  value: totalVagas?.toString(),
                  disabled: true,
                }}
              />
            );
          }}
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item style={{ marginBottom: 0, marginTop: 0 }}>
          <TabelaEditavel listaDres={listaDres} />
        </Form.Item>
      </Col>

      <Col span={24}>
        <UploadArquivosConectaFormacao
          form={form}
          formItemProps={{
            name: 'arquivos',
            label: 'Imagem de divulgação',
          }}
          draggerProps={{ multiple: false, maxCount: 1 }}
        />
      </Col>
    </Row>
  );
};

export default FormInformacoesGerais;
