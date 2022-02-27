import React, { useState, useEffect } from 'react';
import { Row, Col, Divider, Slider } from 'antd';
import { Modal, Button, Grid } from 'antd';
import Cropper from 'react-cropper';
import { UploadFile } from 'antd/lib/upload/interface';
import { RcFile } from 'antd/lib/upload';
import './index.less';

type ClassName = React.HTMLAttributes<any>['className'];
interface ImageCropperProps {
  // Cropper
  file: UploadFile;
  aspect?: number;
  cropperStyle?: React.CSSProperties;
  cropperClassName?: ClassName;
  cropText?: string;
  cancelText?: string;
  onCropped?: (file: UploadFile) => void;
  onCancel?: () => void;

  // Preview
  previewMaxHeight?: number;
  previewBackground?: string;
  previewClassName?: ClassName;
  previewStyle?: React.CSSProperties;

  // Modal Props
  title?: React.ReactNode;
  zIndex?: number;
  centered?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  width?: number;
  bodyStyle?: React.CSSProperties;
}

const maxZoom = 10;
export const ImageCropper: React.FC<ImageCropperProps> = (props) => {
  const { aspect, file, onCropped, previewMaxHeight, title } = props;

  const screens = Grid.useBreakpoint();
  const [src, setSrc] = useState<FileUrl>();
  const [cropper, setCropper] = useState<Cropper>();
  const [zoom, setZoom] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [canvasData, setCanvasData] = useState<any>();

  useEffect(() => {
    if (file && file.originFileObj) getFileUrl(file.originFileObj, setSrc);
  }, [file]);

  useEffect(() => {
    if (!src) {
      setZoom(0);
      setRotate(0);
      setCanvasData(undefined);
      setCropper(undefined);
    }
  }, [src]);

  useEffect(() => {
    if (cropper) cropper.rotateTo(rotate);
  }, [rotate]);

  const onZoomIn = () => {
    let to = zoom + 1;
    if (to > maxZoom) to = maxZoom;
    setZoom(to);
    onZoom(to);
  };

  const onZoomOut = () => {
    let to = zoom - 1;
    if (to <= 0) to = 0;
    setZoom(to);
    onZoom(to);
  };

  const onZoomSlide = (value: number) => {
    setZoom(value);
    onZoom(value);
  };

  const onRotateLeft = () => {
    let to = rotate - 15;
    if (to <= -180) to = -180;
    setRotate(to);
  };

  const onRotateRight = () => {
    let to = rotate + 15;
    if (to >= 180) to = 180;
    setRotate(to);
  };

  const onCrop = () => {
    if (typeof cropper !== 'undefined') {
      const cropped = cropper.getCroppedCanvas();
      const thumbUrl = cropped.toDataURL();
      cropped.toBlob((blob) => {
        if (!blob) return;
        const newFile = new File([blob], file.name);
        const data: UploadFile = { ...file, thumbUrl, originFileObj: newFile as RcFile };
        onCropped?.(data);
      });
    }
    setSrc(undefined);
  };

  const onCancel = () => {
    setSrc(undefined);
    if (props.onCancel) props.onCancel();
  };

  const onZoom = (value: number) => {
    if (!cropper) return;
    if (!canvasData) setCanvasData(cropper.getCanvasData());

    if (value > maxZoom) return;
    if (value <= 0) {
      cropper.setCanvasData(canvasData);
    } else if (value > zoom) {
      const diff = value - zoom;
      cropper.zoom(diff * 0.2);
    } else {
      const diff = zoom - value;
      cropper.zoom(diff * -0.2);
    }
  };

  return (
    <Modal
      title={title}
      zIndex={props.zIndex}
      centered={props.centered}
      width={props.width}
      closable={props.closable || false}
      bodyStyle={props.bodyStyle || { paddingBottom: 0 }}
      maskClosable={props.maskClosable}
      destroyOnClose
      visible={!!src}
      onCancel={onCancel}
      footer={
        <div className="modal-footer">
          <Button onClick={onCancel}>{props.cancelText}</Button>
          <Button block type="primary" onClick={onCrop}>
            {props.cropText}
          </Button>
        </div>
      }
    >
      <Row gutter={12}>
        <Col xs={24} sm={16}>
          <div>
            {src && (
              <Cropper
                className={`img-cropper ${props.cropperClassName || ''}`}
                style={props.cropperStyle}
                dragMode="move"
                aspectRatio={aspect}
                preview=".img-preview"
                src={src as string}
                viewMode={0}
                background
                center
                autoCropArea={1}
                scalable={false}
                movable
                onInitialized={setCropper}
                checkOrientation={false}
              />
            )}

            <div className="slider-container">
              <Button className="action-btn" type="link" onClick={onZoomOut}>
                <span style={{ fontSize: 20 }}>-</span>
              </Button>
              <Slider
                className="slider"
                value={zoom}
                min={0}
                max={maxZoom}
                onChange={onZoomSlide}
              />
              <Button className="action-btn" type="link" onClick={onZoomIn}>
                <span style={{ fontSize: 20 }}>+</span>
              </Button>
            </div>

            <div className="slider-container">
              <Button className="action-btn" type="link" onClick={onRotateLeft}>
                <span style={{ fontSize: 15 }}>↺</span>
              </Button>
              <div style={{ flex: 1 }} onDoubleClick={() => setRotate(0)}>
                <Slider
                  className="slider"
                  value={rotate}
                  min={-180}
                  max={180}
                  onChange={setRotate}
                />
              </div>
              <Button className="action-btn" type="link" onClick={onRotateRight}>
                <span style={{ fontSize: 15 }}>↻</span>
              </Button>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={8}>
          {screens.xs && <Divider className="divider" />}
          <div
            className={`preview-container ${props.previewClassName || ''}`}
            style={{
              ...props.previewStyle,
              maxHeight: previewMaxHeight,
              backgroundColor: props.previewBackground,
            }}
          >
            <div
              className="img-preview"
              style={{
                width: '100%',
                height: previewMaxHeight,
                float: 'left',
                overflow: 'hidden',
                background: '#000',
              }}
            />
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

type FileUrl = string | ArrayBuffer | null;
const getFileUrl = (file: RcFile, callback?: (value: FileUrl) => void) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
      callback?.(reader.result);
    };
    reader.readAsDataURL(file as Blob);
  });
};

ImageCropper.defaultProps = {
  centered: true,
  width: 500,
  previewMaxHeight: 150,
  previewBackground: 'rgba(212, 212, 216)',
  cropText: 'Crop',
  cancelText: 'Cancel',
};

export default ImageCropper;
