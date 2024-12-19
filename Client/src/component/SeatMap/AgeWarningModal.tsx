import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import './AgeWarningModal.css'; // Import CSS tùy chỉnh

const AgeWarningModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <Modal
      open={isModalOpen}
      onOk={handleOk}
      footer={[
        <Button key="ok" type="primary" className="modal-button" onClick={handleOk}>
          Tôi đã hiểu và đồng ý  
        </Button>,
       
      ]}
      className="custom-modal"
      closable={false}
    >
      <p className="modal-text">
        Theo quy định của cục điện ảnh, phim không dành cho khán giả{' '}
        <strong>dưới 16 tuổi</strong>. Hãy cân nhắc trước khi tiếp tục.
      </p>
    </Modal>
  );
};

export default AgeWarningModal;
