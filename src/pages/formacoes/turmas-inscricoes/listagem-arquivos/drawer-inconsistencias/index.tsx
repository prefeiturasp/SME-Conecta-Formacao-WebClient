import { Drawer, DrawerProps, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { ButtonPrimary } from '~/components/lib/button/primary';
import { ButtonSecundary } from '~/components/lib/button/secundary';
import DataTable from '~/components/lib/card-table';
import { CF_BUTTON_MODAL_CANCELAR } from '~/core/constants/ids/button/intex';
import { RegistroDaInscricaoInsconsistenteDTO } from '~/core/dto/registros-inconsistencias-dto';
import { SituacaoImportacaoArquivoEnum } from '~/core/enum/situacao-importacao-arquivo-enum';

const columnsInconsistencias: ColumnsType<RegistroDaInscricaoInsconsistenteDTO> = [
  {
    key: 'linha',
    title: 'Linha',
    dataIndex: 'linha',
  },
  {
    key: 'turma',
    title: 'Turma',
    dataIndex: 'turma',
  },
  {
    key: 'colaboradorRede',
    title: 'Profissional da rede municipal',
    dataIndex: 'colaboradorRede',
  },
  {
    key: 'registroFuncional',
    title: 'RF',
    dataIndex: 'registroFuncional',
  },
  {
    key: 'cpf',
    title: 'CPF',
    dataIndex: 'cpf',
  },
  {
    key: 'nome',
    title: 'Nome',
    dataIndex: 'nome',
  },
  {
    key: 'vinculo',
    title: 'Vínculo',
    dataIndex: 'vinculo',
  },
  {
    key: 'erro',
    title: 'Erro',
    dataIndex: 'erro',
  },
];

interface DrawerInconsistenciasProps {
  linhaId?: number;
  situacao?: number;
  drawerProps: DrawerProps;
  onClickCancelar: () => void;
  onClickContinuar: () => void;
  dataSourceInconsistencias?: RegistroDaInscricaoInsconsistenteDTO[];
}

export const DrawerInconsistencias: React.FC<DrawerInconsistenciasProps> = ({
  linhaId,
  situacao,
  drawerProps,
  onClickCancelar,
  onClickContinuar,
  dataSourceInconsistencias,
}) => {
  const desabilitar = situacao !== SituacaoImportacaoArquivoEnum.Validado;
  const [desativarBotaoContinuar, setDesativarBotaoContinuar] = useState<boolean>();

  return (
    <Drawer
      title='Registros com inconsistências'
      open
      size='large'
      {...drawerProps}
      extra={
        <>
          <Space>
            <ButtonSecundary
              block
              type='default'
              style={{ fontWeight: 700 }}
              id={CF_BUTTON_MODAL_CANCELAR}
              onClick={onClickCancelar}
              disabled={desabilitar}
            >
              Cancelar
            </ButtonSecundary>

            <ButtonPrimary
              type='primary'
              onClick={onClickContinuar}
              disabled={desabilitar || (desativarBotaoContinuar ? false : true)}
            >
              Continuar
            </ButtonPrimary>
          </Space>
        </>
      }
    >
      <DataTable
        columns={columnsInconsistencias}
        dataSource={dataSourceInconsistencias}
        desativarBotaoContinuar={setDesativarBotaoContinuar}
        url={`v1/ImportacaoArquivo/${linhaId}/registros-inconsistencia`}
      />
    </Drawer>
  );
};
