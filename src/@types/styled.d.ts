import 'styled-components';
import { ThemeConfigSME } from '~/core/config/theme';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends ThemeConfigSME {}
}
