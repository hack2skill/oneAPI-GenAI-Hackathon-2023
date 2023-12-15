import React, { useState } from 'react';
import { Input, Select, message, Upload } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';

import { AuthHeader } from 'src/pages/common/header/AuthHeader';
import { PrimaryButton } from 'src/components/Button';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

export const Kyc = () => {
  const [document, setDocument] = useState();
  let navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col">
      <AuthHeader />
      <div className="w-full h-full flex flex-col items-center bg-[#C6C6C63D]">
        <div className="text-3xl text-center">
          Complete your KYC <br />
          <div className="text-base">(to access cases from banks directly)</div>
        </div>
        <div className="my-1 flex flex-col mt-6">
          <div className="text-sm text-[#898884]">
            Enter IBBI Registered Number <span className="text-[red]">*</span>
          </div>
          <Input
            className="w-[23rem] text-md rounded-lg h-[2.5rem] flex items-center"
            placeholder="IBBI/XX/XXXXXXX"
          />
        </div>
        <div className="flex w-[23rem] flex-col mt-4">
          <div className="text-sm text-[#898884]">
            Upload wealth tax certificate <span className="text-[red]">*</span>
          </div>
          <Dragger
            {...props}
            className="bg-white rounded-xl  my-2 kyc-uploader"
          >
            <p className="ant-upload-hint bg-white text-sm text-[#BCBBB8]">
              Drag & Drop files to start uploading
            </p>
            <p className="bg-white mx-auto mt-4 border rounded-xl w-max py-2 px-10">
              <UploadOutlined className="mr-2" />
              Upload wealth Tax Certificate
            </p>
          </Dragger>
        </div>
        <div className="flex flex-col w-[23rem] mt-4">
          <div className="text-sm text-[#898884]">Select document type?</div>
          <Select
            placeholder="Select PAN Card/ Aadhar Card/ GST / Udyog Aadhar"
            className="my-2 w-full text-md rounded-lg h-[2.5rem] flex items-center"
            onChange={(value) => setDocument(value)}
            defaultValue={{ key: 'pan' }}
            options={[
              { value: 'pan', label: 'PAN Card' },
              { value: 'aadhar-card', label: 'Aadhar Card' },
              { value: 'gst', label: 'GST' },
              { value: 'udyog-aadhar', label: 'Udyog Aadhar' },
            ]}
          />
        </div>
        <div className="flex w-[23rem] flex-col mt-4">
          <div className="text-sm text-[#898884]">Upload PAN Card</div>
          <Dragger
            {...props}
            className="bg-white rounded-lg rounded-xl my-2 kyc-uploader"
          >
            <p className="ant-upload-hint bg-white text-sm text-[#BCBBB8]">
              Drag & Drop files to start uploading
            </p>
            <p className="bg-white mx-auto mt-4 border rounded-xl w-max py-2 px-10">
              <UploadOutlined className="mr-2" />
              Upload PAN card
            </p>
          </Dragger>
        </div>
        <PrimaryButton
          className="text-white w-[23rem] bg-[#BAC0FB] hover:bg-[#7582F7] primary-button"
          text="Submit for KYC"
          btnClick={() => navigate('/')}
        />
        <Link to={'/'} className="text-xs">
          Skip, I'll do this later
        </Link>
      </div>
    </div>
  );
};
