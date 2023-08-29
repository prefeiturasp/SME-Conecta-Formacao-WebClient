import ListaCadastroAreaPromotora, {
  ListConfigCadastros,
} from '~/components/main/cadastros/area-promotora/list/list';
import { ROUTES } from '~/core/enum/routes-enum';

const AreaPromotora: React.FC = () => {
  const paramsConfigPage: ListConfigCadastros = {
    breadcrumb: {
      urlMainPage: ROUTES.AREA_PROMOTORA,
    },
    page: {
      title: 'Area Promotora',
      urlApiBase: 'v1/AreaPromotora',
    },
  };

  return <ListaCadastroAreaPromotora {...paramsConfigPage} />;
};

export default AreaPromotora;
