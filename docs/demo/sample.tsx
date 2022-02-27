import React, { useState } from 'react';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ImageCropper from 'antd-react-cropper';
import { UploadFile } from 'antd/lib/upload/interface';
import 'antd/dist/antd.css';

const ImageUploadInput = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [file, setFile] = useState<UploadFile>();

  return (
    <>
      <Upload
        multiple={false}
        listType="picture-card"
        accept="image/*"
        showUploadList={{ showPreviewIcon: false }}
        fileList={fileList}
        beforeUpload={() => false}
        onChange={(info) => {
          if (info.fileList.length <= 0) {
            setFileList(info.fileList);
            return;
          }
          const file = info.fileList[info.fileList.length - 1];
          setFile(file);
        }}
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      </Upload>
      {file && (
        <ImageCropper
          file={file}
          aspect={16 / 9}
          zoomInButton={(func) => {
            return <div onClick={func}>Plus</div>;
          }}
          zoomOutButton={(func) => {
            return <div onClick={func}>Minus</div>;
          }}
          rotateLeftButton={(func) => {
            return <div onClick={func}>Left</div>;
          }}
          rotateRightButton={(func) => {
            return <div onClick={func}>Right</div>;
          }}
          onCropped={(file) => {
            setFileList([file]);
          }}
          customFooter={({ onCrop, onCancel }) => {
            return (
              <div>
                <div onClick={onCancel}>Close</div>
                <div onClick={onCrop}>Done</div>
              </div>
            );
          }}
        />
      )}
    </>
  );
};

export default ImageUploadInput;
