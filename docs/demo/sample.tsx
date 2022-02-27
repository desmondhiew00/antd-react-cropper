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
          onCropped={(file) => {
            setFileList([file]);
          }}
        />
      )}
    </>
  );
};

export default ImageUploadInput;
