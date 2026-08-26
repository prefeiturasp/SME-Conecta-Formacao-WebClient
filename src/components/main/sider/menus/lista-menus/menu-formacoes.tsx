import { BsFillMortarboardFill } from 'react-icons/bs';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { MenuItemConectaProps } from '..';

const isCodafSuplementarEnabled: boolean = true;

export const MENU_FORMACOES: MenuItemConectaProps = {
  key: MenuEnum.Formacoes,
  title: 'Formações',
  icon: <BsFillMortarboardFill size={24} />,
  children: [
    {
      key: MenuEnum.Inscricoes,
      title: 'Inscrições',
      url: ROUTES.FORMACAOES_INSCRICOES,
      roles: {
        podeConsultar: PermissaoEnum.Inscricao_C,
        podeIncluir: PermissaoEnum.Inscricao_I,
        podeExcluir: PermissaoEnum.Inscricao_E,
        podeAlterar: PermissaoEnum.Inscricao_A,
      },
    },
    {
      key: MenuEnum.ListaPresencaCodaf,
      title: (
        <>
          Lista de Presença <br /> CODAF
        </>
      ),
      children: [
        {
          key: MenuEnum.CodafFormacoesHomologadas,
          title: (
            <>
              Formações <br /> homologadas
            </>
          ),
          url: ROUTES.LISTA_PRESENCA_CODAF_HOMOLOGADO,
          roles: {
            podeConsultar: PermissaoEnum.Inscricao_C,
            podeIncluir: PermissaoEnum.Inscricao_I,
            podeExcluir: PermissaoEnum.Inscricao_E,
            podeAlterar: PermissaoEnum.Inscricao_A,
          },
        },
        {
          key: MenuEnum.CodafFormacoesNaoHomologadas,
          title: (
            <>
              Formações não <br /> homologadas
            </>
          ),
          url: ROUTES.LISTA_PRESENCA_CODAF_NAO_HOMOLOGADO,
          roles: {
            podeConsultar: PermissaoEnum.Inscricao_C,
            podeIncluir: PermissaoEnum.Inscricao_I,
            podeExcluir: PermissaoEnum.Inscricao_E,
            podeAlterar: PermissaoEnum.Inscricao_A,
          },
        },
      ],
    },
    ...(isCodafSuplementarEnabled
      ? [
          {
            key: MenuEnum.CodafSuplementar,
            title: 'CODAF Suplementar',
            url: ROUTES.CODAF_SUPLEMENTAR,
            roles: {
              podeConsultar: PermissaoEnum.AreaPromotora_C,
              podeIncluir: PermissaoEnum.AreaPromotora_I,
              podeExcluir: PermissaoEnum.AreaPromotora_E,
              podeAlterar: PermissaoEnum.AreaPromotora_A,
            },
          },
        ]
      : []),
    {
      key: MenuEnum.CertificadosPesquisa,
      title: 'Pesquisar certificados',
      url: ROUTES.CERTIFICADOS_PESQUISA,
      roles: {
        podeConsultar: PermissaoEnum.Inscricao_C,
        podeIncluir: PermissaoEnum.Inscricao_I,
        podeExcluir: PermissaoEnum.Inscricao_E,
        podeAlterar: PermissaoEnum.Inscricao_A,
      },
    },
    {
      key: MenuEnum.DeclaracoesPesquisa,
      title: 'Pesquisar declarações',
      url: ROUTES.DECLARACOES_PESQUISA,
      roles: {
        podeConsultar: PermissaoEnum.Proposta_C,
        podeIncluir: PermissaoEnum.Proposta_I,
        podeExcluir: PermissaoEnum.Proposta_E,
        podeAlterar: PermissaoEnum.Proposta_A,
      },
    },
  ],
};