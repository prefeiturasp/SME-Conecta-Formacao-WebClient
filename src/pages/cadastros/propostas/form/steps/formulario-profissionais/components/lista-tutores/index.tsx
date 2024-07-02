import { Button, Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataTableContextProvider from '~/components/lib/card-table/provider';
import { CF_BUTTON_ADD_TUTOR } from '~/core/constants/ids/button/intex';
import { PropostaTutorDTO } from '~/core/dto/proposta-tutor-dto';
import DrawerTutor from '~/pages/cadastros/propostas/form/steps/formulario-profissionais/components/lista-tutores/drawer';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { TituloListaPaginada, TituloSecao } from '../../../../styles';
import DataTableProfissionalTutor from '~/components/lib/card-table-profissional-tutor';

const columns: ColumnsType<PropostaTutorDTO> = [
  { title: 'RF', dataIndex: 'registroFuncional' },
  { title: 'CPF', dataIndex: 'cpf' },
  { title: 'Mediador', dataIndex: 'nomeTutor' },
  { title: 'Turmas', dataIndex: 'nomesTurmas' },
];

type ListaTutoresProps = {
  recarregarTurmas: boolean;
};

const ListaTutores: React.FC<ListaTutoresProps> = ({ recarregarTurmas }) => {
  const paramsRoute = useParams();
  const refTable = useRef<any>(null);
  const { desabilitarCampos } = useContext(PermissaoContext);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dadosTutorSelecionado, setDadosTutorSelecionado] = useState<PropostaTutorDTO>();

  const id = paramsRoute?.id || 0;
  if (recarregarTurmas) {
    refTable.current?.reloadTable();
  }

  const abrirModal = () => {
    setDadosTutorSelecionado(undefined);
    setOpenModal(true);
  };

  const onCloseModal = (recarregarLista: boolean) => {
    setOpenModal(false);
    setDadosTutorSelecionado(undefined);
    if (recarregarLista && refTable?.current) {
      refTable.current?.reloadTable();
    }
  };

  const onClickEditar = (tutor: PropostaTutorDTO) => {
    setOpenModal(true);
    setDadosTutorSelecionado(tutor);
  };

  return (
    <DataTableContextProvider>
      {openModal && (
        <DrawerTutor
          openModal={openModal}
          onCloseModal={onCloseModal}
          id={dadosTutorSelecionado?.id}
        />
      )}
      <Col>
        <Row gutter={[16, 8]} style={{ paddingTop: '20px' }}>
          <Col xs={24}>
            <Row wrap={false} justify='space-between'>
              <Col>
                <TituloSecao>Mediadores</TituloSecao>
              </Col>
              <Col>
                <Button
                  type='primary'
                  id={CF_BUTTON_ADD_TUTOR}
                  onClick={abrirModal}
                  disabled={desabilitarCampos}
                >
                  Adicionar mediadores
                </Button>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={14} md={24}>
            <TituloListaPaginada>Lista de mediadores</TituloListaPaginada>
          </Col>

          <Col span={24}>
            <DataTableProfissionalTutor
              ref={refTable}
              url={`v1/proposta/${id}/tutor`}
              columns={columns}
              onRow={(row: PropostaTutorDTO) => ({
                onClick: () => {
                  onClickEditar(row);
                },
              })}
            />
          </Col>
        </Row>
      </Col>
    </DataTableContextProvider>
  );
};

export default ListaTutores;
