import { ROUTES } from '~/core/enum/routes-enum';
import { MenuEnum } from '~/core/enum/menu-enum';
import { MENU_MEUS_CERTIFICADOS } from './meus-certificados';

describe('MENU_MEUS_CERTIFICADOS', () => {
  it('should have correct properties', () => {
    // Assert
    expect(MENU_MEUS_CERTIFICADOS).toBeDefined();
    expect(MENU_MEUS_CERTIFICADOS.key).toBe(MenuEnum.Certificados);
    expect(MENU_MEUS_CERTIFICADOS.title).toBe('Meus Certificados');
    expect(MENU_MEUS_CERTIFICADOS.icon).toBeDefined();
    expect(MENU_MEUS_CERTIFICADOS.children).toHaveLength(1);
    
    if (MENU_MEUS_CERTIFICADOS.children) {
      const child = MENU_MEUS_CERTIFICADOS.children[0];
      expect(child.key).toBe(MenuEnum.Certificados);
      expect(child.title).toBe('Certificados e declarações');
      expect(child.url).toBe(ROUTES.CERTIFICADOS);
    }
  });
});
