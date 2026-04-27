import React from "react";
import { Button, Typography } from "antd";
import Modal from "~/components/lib/modal";

interface ModalDeleteCoordenadoriaProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

const ModalDeleteCoordenadoria: React.FC<ModalDeleteCoordenadoriaProps> = ({
    visible,
    onCancel,
    onConfirm,
    loading = false,
}) => {
    return (
        <>
            <style>{`
                .modal-excluir-coordenadoria .ant-modal-header {
                    border-bottom: none !important;
                }
                .modal-excluir-coordenadoria .ant-modal-footer {
                    border-top: none !important;
                    padding-top: 32px !important;
                }
            `}</style>
            <Modal
                className="modal-excluir-coordenadoria"
                title={
                    <span
                        style={{ 
                            fontWeight: 700,
                            fontSize: "20px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#42474A", 
                            fontFamily: "Roboto",
                        }}
                    >
                        Excluir coordenadoria
                    </span>
                }
                open={visible}
                onCancel={onCancel}
                centered
                width={520}
                styles={{
                    header: { borderBottom: 'none', paddingBottom: '0' }, 
                    footer: { borderTop: 'none' }
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={onCancel}
                        style={{
                            height: "40px",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            border: "1px solid #FF9A52",
                            background: "#FFF",
                            color: "#FF9A52",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 700,
                        }}
                    >
                        Cancelar
                    </Button>,
                    <Button
                        key="submit"
                        onClick={onConfirm}
                        loading={loading}
                        style={{
                            height: "40px",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            background: "#FF9A52",
                            border: "none",
                            color: "#FFF",
                            fontFamily: "Roboto",
                            fontSize: "14px",
                            fontWeight: 700,
                        }}
                    >
                        Excluir
                    </Button>,
                ]}
            >
                <Typography.Paragraph style={{ marginBottom: "0", marginTop: "16px", color: "#666" }}>
                    Essa ação não poderá ser desfeita. Deseja continuar?
                </Typography.Paragraph>
            </Modal>
        </>
    );
};

export default ModalDeleteCoordenadoria;