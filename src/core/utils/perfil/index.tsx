import { store } from '~/core/redux';
import { setDadosLogin } from '~/core/redux/modules/auth/actions';

import jwt_decode from 'jwt-decode';
import { JWTDecodeDTO } from '~/core/dto/jwt-decode-dto';
import { RetornoPerfilUsuarioDTO } from '~/core/dto/retorno-perfil-usuario-dto';
import { setPerfilSelecionado, setPerfilUsuario } from '~/core/redux/modules/perfil/actions';

import { menus } from '~/components/main/sider/menus';
import { PermissaoMenusAcoesDTO } from '~/core/dto/permissao-menu-acoes-dto';
import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';
import { RolesDTO } from '~/core/dto/roles-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { setPermissaoPorMenu, setRoles } from '~/core/redux/modules/roles/actions';

export const verificaSomenteConsulta = (permissao: PermissaoMenusAcoesDTO) => {
  const somenteConsulta =
    permissao.podeConsultar &&
    !permissao.podeAlterar &&
    !permissao.podeIncluir &&
    !permissao.podeExcluir;

  console.log(somenteConsulta);

  // TODO - Criar no redux o modulo navegacao para setar este valor!
  // store.dispatch(setSomenteConsulta(somenteConsulta));
};

const menuTemPermissao = (permissao: PermissaoMenusAcoesDTO) =>
  !!(
    permissao.podeAlterar ||
    permissao.podeConsultar ||
    permissao.podeExcluir ||
    permissao.podeIncluir
  );

const carregarMenusEPermissao = (roles: RolesDTO['roles']) => {
  if (menus?.length) {
    const permissaoMenus: PermissaoPorMenuDTO[] = [];

    // TODO - Rever se é possível otimizar!
    menus.forEach((menu) => {
      if (menu.children?.length) {
        menu.children.forEach((subMenu) => {
          let permissao: PermissaoMenusAcoesDTO = {
            podeConsultar: true,
            podeIncluir: true,
            podeExcluir: true,
            podeAlterar: true,
          };

          let exibir = true;

          let permissaoMenu: PermissaoPorMenuDTO = {
            key: subMenu.key,
            permissao,
            exibir,
          };

          switch (subMenu.key) {
            case MenuEnum.MeusDados:
              permissaoMenus.push(permissaoMenu);
              break;
            default:
              if (subMenu.roles) {
                permissao = {
                  podeConsultar: roles.includes(subMenu.roles.podeConsultar),
                  podeIncluir: roles.includes(subMenu.roles.podeIncluir),
                  podeExcluir: roles.includes(subMenu.roles.podeExcluir),
                  podeAlterar: roles.includes(subMenu.roles.podeAlterar),
                };

                exibir = menuTemPermissao(permissao);

                permissaoMenu = {
                  key: subMenu.key,
                  permissao,
                  exibir,
                };
                permissaoMenus.push(permissaoMenu);
              }
              break;
          }
        });
      }
    });

    store.dispatch(setPermissaoPorMenu(permissaoMenus));
  }
};

export const validarAutenticacao = (data: RetornoPerfilUsuarioDTO) => {
  const decodeObject: JWTDecodeDTO = jwt_decode(data.token);

  const perfilSelecionado = data.perfilUsuario.find(
    (perfil) => perfil?.perfil === decodeObject?.perfil,
  );

  store.dispatch(setDadosLogin(data));
  store.dispatch(setPerfilUsuario(data.perfilUsuario));

  if (perfilSelecionado) {
    store.dispatch(setPerfilSelecionado(perfilSelecionado));
  }

  let roles: RolesDTO['roles'] = [];

  if (decodeObject.roles?.length) {
    roles = decodeObject.roles;
  }

  store.dispatch(setRoles(roles));
  carregarMenusEPermissao(roles);
};
