import React, { useEffect } from 'react';
import { FaGraduationCap, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { HiBadgeCheck } from 'react-icons/hi';
import { ArrowLeftOutlined, ArrowRightOutlined, HomeFilled } from '@ant-design/icons';
import imagemFormacao from '~/assets/conecta-formacao-logo.svg';
import { RetornoDetalheFormacaoDto } from '~/core/dto/dados-formacao-area-publica-dto';
import CardTurmasPublico from '~/pages/area-publica/components/card-turmas';
import {
  BOTAO_INSCRICAO_EXTERNA,
  ENVIAR_INSCRICAO,
  PUBLICO_ALVO,
  PUBLICO_ALVO_VAGAS_REMANESCENTES,
  SOBRE_ESTE_CURSO,
} from '~/core/constants/mensagens';
import { useInscricaoFormacao } from '~/core/hooks/use-inscricao-formacao';

import {
  Container,
  Breadcrumb,
  Trilha,
  Separador,
  PageTitle,
  Card,
  Capa,
  Logo,
  Conteudo,
  Titulo,
  Badges,
  Badge,
  Info,
  Divisor,
  Secao,
  TituloSecao,
  Texto,
  Tags,
  TagEscura,
  ListaTurmas,
  BarraAcoes,
  BotaoSeta,
  BotaoInscricao,
  LinkInscricao,
  Espaco,
} from './styles';

type Props = {
  dadosFormacao?: RetornoDetalheFormacaoDto;
  propostaId: number;
  onClickVoltar: () => void;
  onClickFormacaoAnterior: () => void;
  onClickProximaFormacao: () => void;
};

const VisualizarFormacaoMobile: React.FC<Props> = ({
  dadosFormacao,
  propostaId,
  onClickVoltar,
  onClickFormacaoAnterior,
  onClickProximaFormacao,
}) => {
  const { enviarInscricao, inscricaoDesabilitada, linkInscricaoExterna } = useInscricaoFormacao(
    dadosFormacao,
    propostaId,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [propostaId]);

  return (
    <Container data-testid='visualizar-formacao-mobile'>
      <Trilha>
        <Breadcrumb type='button' onClick={onClickVoltar}>
          <HomeFilled /> Início
        </Breadcrumb>
        <Separador />
        <span>Minhas inscrições</span>
        <Separador />
        <Breadcrumb type='button' onClick={onClickVoltar} style={{ color: '#42474a' }}>
          Explorar formações
        </Breadcrumb>
        <Separador />
        <span>Detalhes da formação</span>
      </Trilha>

      <PageTitle>Detalhes da formação</PageTitle>

      <Card>
        {dadosFormacao?.imagemUrl ? (
          <Capa src={dadosFormacao.imagemUrl} alt='Imagem da formação' />
        ) : (
          <Logo src={imagemFormacao} alt='Imagem da formação' />
        )}

        <Conteudo>
          <Titulo>{dadosFormacao?.titulo}</Titulo>

          <Espaco $altura={2} />
          
          <Badges>
            {dadosFormacao?.tipoFormacaoDescricao && (
              <Badge>
                <FaGraduationCap /> {dadosFormacao.tipoFormacaoDescricao}
              </Badge>
            )}
            {dadosFormacao?.formatoDescricao && (
              <Badge>
                <FaMapMarkerAlt /> {dadosFormacao.formatoDescricao}
              </Badge>
            )}
            {dadosFormacao?.cursoComCertificado && (
              <Badge>
                <HiBadgeCheck /> Evolução funcional
              </Badge>
              )}
              {!!dadosFormacao?.codigoEventoSigpec && (
                <Badge>
                  <FaStar/> Evolução por merecimento
                </Badge>
            )}
          </Badges>

          <Espaco $altura={2} />

          <Info>
            <strong>Período de realização:</strong>{' '}
            {dadosFormacao?.periodo?.replace(' - ', ' até ')}
          </Info>
          <Info>
            <strong>Período de inscrição:</strong>{' '}
            {dadosFormacao?.periodoInscricao?.replaceAll(/\s\d{2}:\d{2}/g, '')}
          </Info>
          <Info>
            <strong>Área promotora:</strong> {dadosFormacao?.areaPromotora}
          </Info>
          <Info>
            <strong>Código da formação:</strong> {propostaId}
          </Info>
          {!!dadosFormacao?.numeroHomologacao && (
            <Info>
              <strong>Código da homologação:</strong> {dadosFormacao.numeroHomologacao}
            </Info>
          )}

          <Espaco $altura={2} />
          <Divisor />

          {dadosFormacao?.sobreEsteCurso && (
            <Secao>
              <Espaco $altura={2} />
              <TituloSecao>{SOBRE_ESTE_CURSO}</TituloSecao>
              <Texto>{dadosFormacao.sobreEsteCurso}</Texto>
              <Divisor />
            </Secao>
          )}

          {!!dadosFormacao?.publicosAlvo?.length && (
            <Secao>
              <Espaco $altura={2} />
              <TituloSecao>{PUBLICO_ALVO}</TituloSecao>
              <Tags>
                {dadosFormacao.publicosAlvo.map((publico) => (
                  <TagEscura key={publico}>{publico}</TagEscura>
                ))}
              </Tags>
            </Secao>
          )}

          {!!dadosFormacao?.palavrasChaves?.length && (
            <Secao>
              <Espaco $altura={2} />
              <TituloSecao>{PUBLICO_ALVO_VAGAS_REMANESCENTES}</TituloSecao>
              <Tags>
                {dadosFormacao.palavrasChaves.map((publico) => (
                  <TagEscura key={publico}>{publico}</TagEscura>
                ))}
              </Tags>
            </Secao>
          )}

          {!!dadosFormacao?.turmas?.length && (
            <>
              <Divisor />
              <Secao>
                <Espaco $altura={2} />
                <TituloSecao>Turmas</TituloSecao>
                <Espaco $altura={2} />
                <ListaTurmas>
                  {dadosFormacao.turmas.map((turma, i) => (
                    <CardTurmasPublico key={`${turma.nome}-${i}`} turma={turma} />
                  ))}
                </ListaTurmas>
              </Secao>
            </>
          )}
        </Conteudo>
      </Card>

      <BarraAcoes data-testid='barra-acoes-mobile'>
        <BotaoSeta
          type='button'
          aria-label='Formação anterior'
          disabled={!dadosFormacao?.formacaoAnteriorId}
          onClick={onClickFormacaoAnterior}
        >
          <ArrowLeftOutlined />
        </BotaoSeta>

        {linkInscricaoExterna ? (
          <LinkInscricao href={linkInscricaoExterna} target='_blank' rel='noopener noreferrer'>
            {BOTAO_INSCRICAO_EXTERNA}
          </LinkInscricao>
        ) : (
          <BotaoInscricao type='button' onClick={enviarInscricao} disabled={inscricaoDesabilitada}>
            {ENVIAR_INSCRICAO}
          </BotaoInscricao>
        )}

        <BotaoSeta
          type='button'
          aria-label='Próxima formação'
          disabled={!dadosFormacao?.formacaoPosteriorId}
          onClick={onClickProximaFormacao}
        >
          <ArrowRightOutlined />
        </BotaoSeta>
      </BarraAcoes>
    </Container>
  );
};

export default VisualizarFormacaoMobile;
