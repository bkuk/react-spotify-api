import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import QRCode from "qrcode.react";

export default function QRModal({open, handleClose, name, url}) {
  const downloadQrCode = () => {
    const canvas = document.getElementById("qrId");
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${name}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Playlist: {name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="mx-auto">
            <QRCode
              id="qrId"
              value={url}
              size={200}
              imageSettings={{
                height: 300,
                width: 300
              }} 
            />
        </Modal.Body>
        <Modal.Footer>
        <Button variant="success" onClick={downloadQrCode}>
          DOWNLOAD QR CODE
        </Button>
        </Modal.Footer>
    </Modal>
  );
}
