import { Button, Col, Row } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CF_BUTTON_ADD_REGENTE } from '~/core/constants/ids/button/intex';
import { PropostaRegenteDTO } from '~/core/dto/proposta-regente-dto';
import DrawerRegente from '~/pages/cadastros/propostas/form/steps/formulario-profissionais/components/lista-regentes/drawer';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { TituloListaPaginada, TituloSecao } from '../../../../styles';
import DataTableProfissionalRegente from '~/components/lib/card-table-profissional-regente';

const columns: ColumnsType<PropostaRegenteDTO> = [
  { title: 'RF', dataIndex: 'registroFuncional' },
  { title: 'Regente', dataIndex: 'nomeRegente' },
  { title: 'Turmas', dataIndex: 'nomesTurmas' },
];

type ListaRegentesProps = {
  recarregarTurmas: boolean;
};

const ListaRegentes: React.FC<ListaRegentesProps> = ({ recarregarTurmas }) => {
  const paramsRoute = useParams();
  const refTable = useRef<any>(null);
  const { desabilitarCampos } = useContext(PermissaoContext);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dadosRegentSelecionado, setDadosRegentSelecionado] = useState<PropostaRegenteDTO>();

  const id = paramsRoute?.id || 0;
  if (recarregarTurmas) {
    refTable.current?.reloadTable();
  }
  const abrirModal = () => {
    setDadosRegentSelecionado(undefined);
    setOpenModal(true);
  };

  const onCloseModal = (recarregarLista: boolean) => {
    setOpenModal(false);
    setDadosRegentSelecionado(undefined);
    if (recarregarLista && refTable?.current) {
      refTable.current?.reloadTable();
    }
  };

  const onClickEditar = (regente: PropostaRegenteDTO) => {
    setOpenModal(true);
    setDadosRegentSelecionado(regente);
  };

  return (
    <>
      {openModal && (
        <DrawerRegente
          openModal={openModal}
          onCloseModal={onCloseModal}
          id={dadosRegentSelecionado?.id}
        />
      )}
      <Col>
        <Row gutter={[16, 8]}>
          <Col xs={24}>
            <Row wrap={false} justify='space-between'>
              <Col>
                <TituloSecao>Regentes</TituloSecao>
              </Col>
              <Col>
                <Button
                  type='primary'
                  id={CF_BUTTON_ADD_REGENTE}
                  onClick={abrirModal}
                  disabled={desabilitarCampos}
                >
                  Adicionar regentes
                </Button>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={14} md={24}>
            <TituloListaPaginada>Lista de regentes</TituloListaPaginada>
          </Col>

          <Col span={24}>
            <DataTableProfissionalRegente
              ref={refTable}
              url={`v1/proposta/${id}/regente`}
              columns={columns}
              onRow={(row: PropostaRegenteDTO) => ({
                onClick: () => {
                  onClickEditar(row);
                },
              })}
            />
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default ListaRegentes;
