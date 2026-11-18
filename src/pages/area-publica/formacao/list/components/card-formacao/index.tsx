import { Button, Card } from 'antd';
import React from 'react';
import { FaGraduationCap, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { HiBadgeCheck } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { SAIBA_MAIS } from '~/core/constants/mensagens';
import { FormacaoDTO } from '~/core/dto/formacao-dto';
import { ROUTES } from '~/core/enum/routes-enum';
import { ImgFormacao } from '../img-formacao';
import {
  AreaPromotoraTagsContainer,
  AreaPromotoraTitulo,
  CardDivider,
  DesktopCardContainer,
  Info,
  Label,
  MobileBadgeConecta,
  MobileCardContainer,
  MobileInfoRow,
  MobileLabel,
  MobileTitulo,
  MobileValue,
  TagTipoFormacaoFormato,
  Titulo,
  Value,
  ValueDuplo,
} from './styles';

type CardFormacaoProps = {
  formacao: FormacaoDTO;
};

type InformacoesAreaPromotoraProps = {
  cursoComCertificado?: boolean;
  codigoEventoSigpec?: number | null;
};

export const InformacoesAreaPromotora: React.FC<InformacoesAreaPromotoraProps> = ({
  cursoComCertificado,
  codigoEventoSigpec,
}) => {
  if (!cursoComCertificado && !codigoEventoSigpec) {
    return null;
  }

  return (
    <>
      <CardDivider />
      <AreaPromotoraTitulo>Informações da Área promotora</AreaPromotoraTitulo>
      <AreaPromotoraTagsContainer>
        {cursoComCertificado && (
          <TagTipoFormacaoFormato icon={<HiBadgeCheck size={16} />}>
            Evolução funcional
          </TagTipoFormacaoFormato>
        )}
        {!!codigoEventoSigpec && (
          <TagTipoFormacaoFormato icon={<FaStar size={16} />}>
            Evolução por merecimento
          </TagTipoFormacaoFormato>
        )}
      </AreaPromotoraTagsContainer>
    </>
  );
};

export const CardFormacao: React.FC<CardFormacaoProps> = ({ formacao }) => {
  const navigate = useNavigate();

  const abrirFormacao = () =>
    navigate(`${ROUTES.AREA_PUBLICA}/visualizar/${formacao.id}`, {
      replace: true,
      state: { location: formacao },
    });

  return (
    <>
      {/* Versão Desktop */}
      <DesktopCardContainer>
        <Card
          cover={<ImgFormacao url={formacao.imagemUrl} inscricaoEncerrada={formacao.inscricaoEncerrada} />}
        >
          <Titulo>{formacao.titulo}</Titulo>

          <Info>
            <Label>Período de realização:</Label>
            <Value>{formacao.periodo}</Value>
          </Info>

          <Info>
            <Label>Período de inscrição:</Label>
            <Value>{formacao.periodoInscricao}</Value>
          </Info>

          <Info>
            <Label>Área promotora:</Label>
            <ValueDuplo>{formacao.areaPromotora}</ValueDuplo>
          </Info>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {formacao.tipoFormacaoDescricao && (
              <TagTipoFormacaoFormato icon={<FaGraduationCap size={16} />}>
                {formacao.tipoFormacaoDescricao}
              </TagTipoFormacaoFormato>
            )}

            {formacao.formatoDescricao && (
              <TagTipoFormacaoFormato icon={<FaMapMarkerAlt size={16} />}>
                {formacao.formatoDescricao}
              </TagTipoFormacaoFormato>
            )}
          </div>

          <InformacoesAreaPromotora
            cursoComCertificado={formacao.cursoComCertificado}
            codigoEventoSigpec={formacao.codigoEventoSigpec}
          />

          <Button
            type='primary'
            size='large'
            block
            onClick={abrirFormacao}
            style={{
              marginTop: 'auto',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontStyle: 'normal',
              fontSize: '14px',
              lineHeight: '100%',
              letterSpacing: '0%',
            }}
          >
            {SAIBA_MAIS}
          </Button>
        </Card>
      </DesktopCardContainer>

      {/* Versão Mobile (conforme protótipo do Figma) */}
      <MobileCardContainer>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <MobileBadgeConecta src={ConectaLogo} alt='CONECTA' />
        </div>

        <MobileTitulo>{formacao.titulo}</MobileTitulo>

        <MobileInfoRow>
          <MobileLabel>Período de realização:</MobileLabel>
          <MobileValue>{formacao.periodo}</MobileValue>
        </MobileInfoRow>

        <MobileInfoRow>
          <MobileLabel>Período de inscrição:</MobileLabel>
          <MobileValue>{formacao.periodoInscricao}</MobileValue>
        </MobileInfoRow>

        <MobileInfoRow style={{ marginBottom: 12 }}>
          <MobileLabel>Área promotora:</MobileLabel>
          <MobileValue>{formacao.areaPromotora}</MobileValue>
        </MobileInfoRow>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {formacao.tipoFormacaoDescricao && (
            <TagTipoFormacaoFormato icon={<FaGraduationCap size={16} />}>
              {formacao.tipoFormacaoDescricao}
            </TagTipoFormacaoFormato>
          )}
          {formacao.formatoDescricao && (
            <TagTipoFormacaoFormato icon={<FaMapMarkerAlt size={16} />}>
              {formacao.formatoDescricao}
            </TagTipoFormacaoFormato>
          )}
        </div>

        <InformacoesAreaPromotora
          cursoComCertificado={formacao.cursoComCertificado}
          codigoEventoSigpec={formacao.codigoEventoSigpec}
        />

        <Button
          type='primary'
          size='large'
          block
          onClick={abrirFormacao}
          style={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            backgroundColor: '#FF9A52',
            borderColor: '#FF9A52',
            borderRadius: '8px',
            height: '44px',
            marginTop: '8px',
          }}
        >
          {SAIBA_MAIS}
        </Button>
      </MobileCardContainer>
    </>
  );
};

