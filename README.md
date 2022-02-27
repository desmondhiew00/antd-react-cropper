# antd-react-cropper

Image cropper using Ant Design and React Cropper

[![npm](https://img.shields.io/npm/v/antd-react-cropper.svg?style=flat-square)](https://www.npmjs.com/package/antd-react-cropper)
[![npm](https://img.shields.io/npm/dt/antd-react-cropper?style=flat-square)](https://www.npmtrends.com/antd-react-cropper)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/antd-react-cropper?style=flat-square)](https://bundlephobia.com/result?p=antd-react-cropper)

## Install

```sh
yarn add antd-react-cropper
```

## Usage

```tsx
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
```

## Props

| Props             | Type                         | Default               | Description      |
| ----------------- | ---------------------------- | --------------------- | ---------------- |
| file              | `antd/lib/upload/UploadFile` | -                     | -                |
| aspect            | `number`                     | -                     | `16 / 9`         |
| cropperStyle      | `React.CSSProperties`        | -                     | -                |
| cropperClassName  | `string`                     | -                     | -                |
| cropText          | `string`                     | `Crop`                | -                |
| cancelText        | `string`                     | `Cancel`              | -                |
| onCropped         | `(file: UploadFile) => void` | -                     | -                |
| onCancel          | `() => void`                 | -                     | -                |
| previewMaxHeight  | `number`                     | 150                   | -                |
| previewBackground | `string`                     | `rgba(212, 212, 216)` | -                |
| previewClassName  | `string`                     | -                     | -                |
| previewStyle      | `React.CSSProperties`        | -                     | -                |
| title             | `React.ReactNode`            | -                     | Antd Modal props |
| zIndex            | `number`                     | -                     | Antd Modal props |
| centered          | `boolean`                    | -                     | Antd Modal props |
| closable          | `boolean`                    | -                     | Antd Modal props |
| maskClosable      | `boolean`                    | -                     | Antd Modal props |
| width             | `number`                     | 500                     | Antd Modal props |
| bodyStyle         | `React.CSSProperties`        | -                     | Antd Modal props |
