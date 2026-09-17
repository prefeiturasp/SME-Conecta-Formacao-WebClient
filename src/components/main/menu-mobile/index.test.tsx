/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { ROUTES } from '~/core/enum/routes-enum';
import MenuMobile, { obterTipoLogin } from './index';

const mockNavigate = jest.fn();
const mockLocation = { pathname: ROUTES.PRINCIPAL };

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

const mockDispatch = jest.fn();
jest.mock('~/core/redux', () => ({
  store: {
    dispatch: (action: any) => mockDispatch(action),
  },
}));

jest.mock('~/core/redux/modules/auth/actions', () => ({
  setDeslogar: jest.fn(() => ({ type: 'AUTH/SET_DESLOGAR' })),
}));

let mockAuthState: any = {
  usuarioNome: 'Diego Moreno',
  nomeSocial: '',
  usuarioLogin: '1234567',
};

let mockPerfilState: any = {
  perfilSelecionado: {
    perfil: '1',
    perfilNome: 'Cursista',
  },
};

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: (selector: (state: any) => any) =>
    selector({
      auth: mockAuthState,
      perfil: mockPerfilState,
    }),
}));

describe('MenuMobile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.pathname = ROUTES.PRINCIPAL;
    mockAuthState = {
      usuarioNome: 'Diego Moreno',
      nomeSocial: '',
      usuarioLogin: '1234567',
    };
    mockPerfilState = {
      perfilSelecionado: {
        perfil: '1',
        perfilNome: 'Cursista',
      },
    };
  });

  describe('Função auxiliar obterTipoLogin', () => {
    it('deve retornar RF para 7 digitos', () => {
      expect(obterTipoLogin('1234567')).toBe('RF');
      expect(obterTipoLogin('123.456-7')).toBe('RF');
    });

    it('deve retornar CPF para 11 digitos', () => {
      expect(obterTipoLogin('12345678901')).toBe('CPF');
      expect(obterTipoLogin('123.456.789-01')).toBe('CPF');
    });

    it('deve retornar Login para outros comprimentos ou ausente', () => {
      expect(obterTipoLogin('12345')).toBe('Login');
      expect(obterTipoLogin('')).toBe('Login');
      expect(obterTipoLogin(undefined)).toBe('Login');
    });
  });

  describe('Renderização e Abertura', () => {
    it('deve renderizar o Drawer fechado quando open for false', () => {
      render(<MenuMobile open={false} onClose={jest.fn()} />);
      expect(screen.queryByTestId('drawer-menu-mobile')).not.toBeInTheDocument();
    });

    it('deve renderizar o Drawer com seus elementos quando open for true', () => {
      render(<MenuMobile open={true} onClose={jest.fn()} />);

      expect(screen.getByTestId('bloco-topo-menu-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('logo-menu-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('btn-fechar-menu-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('nome-usuario-mobile')).toHaveTextContent('Diego Moreno');
      expect(screen.getByTestId('identificacao-usuario-mobile')).toHaveTextContent(
        'RF:1234567 - Cursista',
      );
      expect(screen.queryByTestId('card-usuario-mobile')).not.toBeInTheDocument();
      expect(screen.queryByTestId('avatar-usuario-mobile')).not.toBeInTheDocument();
      expect(screen.getByTestId('conteudo-navegacao-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('btn-menu-meus-dados')).toBeInTheDocument();
      expect(screen.getByTestId('btn-menu-meus-certificados')).toBeInTheDocument();
      expect(screen.getByTestId('divisor-menu-mobile')).toBeInTheDocument();
      expect(screen.getByTestId('btn-menu-logout')).toBeInTheDocument();
    });

    it('deve preferir nomeSocial quando disponivel', () => {
      mockAuthState.nomeSocial = 'Diego Social';
      render(<MenuMobile open={true} onClose={jest.fn()} />);

      expect(screen.getByTestId('nome-usuario-mobile')).toHaveTextContent('Diego Social');
    });

    it('deve formatar CPF no identificador quando login tiver 11 digitos', () => {
      mockAuthState.usuarioLogin = '11122233344';
      render(<MenuMobile open={true} onClose={jest.fn()} />);

      expect(screen.getByTestId('identificacao-usuario-mobile')).toHaveTextContent(
        'CPF:11122233344 - Cursista',
      );
    });

    it('deve formatar apenas identificador se perfil nao estiver disponivel', () => {
      mockPerfilState.perfilSelecionado = undefined;
      render(<MenuMobile open={true} onClose={jest.fn()} />);

      expect(screen.getByTestId('identificacao-usuario-mobile')).toHaveTextContent('RF:1234567');
    });

    it('deve formatar apenas perfil se login nao estiver disponivel', () => {
      mockAuthState.usuarioLogin = '';
      render(<MenuMobile open={true} onClose={jest.fn()} />);

      expect(screen.getByTestId('identificacao-usuario-mobile')).toHaveTextContent('Cursista');
    });

    it('deve ocultar identificacao quando login e perfil nao existirem', () => {
      mockAuthState.usuarioLogin = '';
      mockPerfilState.perfilSelecionado = undefined;
      render(<MenuMobile open={true} onClose={jest.fn()} />);

      expect(screen.queryByTestId('identificacao-usuario-mobile')).not.toBeInTheDocument();
    });

    it('deve ocultar nome quando nao houver nome social nem usuarioNome', () => {
      mockAuthState.usuarioNome = '';
      mockAuthState.nomeSocial = '';
      render(<MenuMobile open={true} onClose={jest.fn()} />);

      expect(screen.queryByTestId('nome-usuario-mobile')).not.toBeInTheDocument();
    });
  });

  describe('Interações e Navegação', () => {
    it('deve chamar onClose ao clicar no botao fechar', () => {
      const onCloseMock = jest.fn();
      render(<MenuMobile open={true} onClose={onCloseMock} />);

      fireEvent.click(screen.getByTestId('btn-fechar-menu-mobile'));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('deve navegar para Meus Dados e fechar o menu ao clicar na opcao', () => {
      const onCloseMock = jest.fn();
      render(<MenuMobile open={true} onClose={onCloseMock} />);

      fireEvent.click(screen.getByTestId('btn-menu-meus-dados'));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.MEUS_DADOS);
    });

    it('deve navegar para Meus Certificados e fechar o menu ao clicar na opcao', () => {
      const onCloseMock = jest.fn();
      render(<MenuMobile open={true} onClose={onCloseMock} />);

      fireEvent.click(screen.getByTestId('btn-menu-meus-certificados'));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CERTIFICADOS);
    });

    it('deve acionar o logout oficial e fechar o menu ao clicar em Sair', () => {
      const onCloseMock = jest.fn();
      render(<MenuMobile open={true} onClose={onCloseMock} />);

      fireEvent.click(screen.getByTestId('btn-menu-logout'));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'AUTH/SET_DESLOGAR' });
    });

    it('deve destacar item ativo de acordo com a rota atual', () => {
      mockLocation.pathname = ROUTES.MEUS_DADOS;
      const { rerender } = render(<MenuMobile open={true} onClose={jest.fn()} />);

      const btnMeusDados = screen.getByTestId('btn-menu-meus-dados');
      expect(btnMeusDados).toBeInTheDocument();

      mockLocation.pathname = ROUTES.CERTIFICADOS;
      rerender(<MenuMobile open={true} onClose={jest.fn()} />);
      const btnCertificados = screen.getByTestId('btn-menu-meus-certificados');
      expect(btnCertificados).toBeInTheDocument();
    });
  });

  describe('Responsividade e Redimensionamento', () => {
    it('deve fechar o menu quando a janela for redimensionada para desktop (> 768px)', () => {
      const onCloseMock = jest.fn();
      render(<MenuMobile open={true} onClose={onCloseMock} />);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      fireEvent(window, new Event('resize'));

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('nao deve fechar o menu se redimensionar mantendo tamanho mobile (<= 768px)', () => {
      const onCloseMock = jest.fn();
      render(<MenuMobile open={true} onClose={onCloseMock} />);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      fireEvent(window, new Event('resize'));

      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('nao deve chamar onClose no resize se o menu ja estiver fechado', () => {
      const onCloseMock = jest.fn();
      render(<MenuMobile open={false} onClose={onCloseMock} />);

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });
      fireEvent(window, new Event('resize'));

      expect(onCloseMock).not.toHaveBeenCalled();
    });

    it('deve limpar o event listener de resize ao desmontar', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = render(<MenuMobile open={true} onClose={jest.fn()} />);

      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });
});
