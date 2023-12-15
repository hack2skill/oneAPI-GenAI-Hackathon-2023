import React from 'react';
import { Button, Input, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

export const AddOffice = () => {
  let navigate = useNavigate();
  const { TextArea } = Input;

  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#C6C6C63D]">
      <div className="flex flex-col  items-center ">
        <div className="my-4 text-3xl">Add a branch office</div>
        <div className="flex flex-col mt-4  w-[20rem] text-center">
          Propeler is meant to be used with your team. Invite some co-workers to
          test it out.
        </div>
        <div className="flex flex-col mt-10">
          <div className="text-sm text-[#898884]">
            Phone Numbers <span className="text-[red]">*</span>
          </div>
          <TextArea
            className="my-1 w-[23rem] text-md rounded-lg flex items-start"
            placeholder="Enter phone numbers"
            rows={4}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </div>
        <div className="mt-4 flex flex-col w-[23rem]">
          <div className="text-sm text-[#898884]">
            Select an office to add to
          </div>
          <Select
            placeholder="Select your company size"
            className="mb-4 w-full text-md rounded-lg h-[2.5rem] flex items-center"
            // onChange={handleChange}
            options={[
              { value: '5', label: '1-5' },
              { value: '10', label: '5-10' },
              { value: '20', label: '10-20' },
              { value: '50', label: '20-50' },
              { value: '50+', label: '50+' },
              { value: 'NA', label: 'Prefer not to share' },
            ]}
          />
        </div>
        <Button
          className="my-4 mb-2 w-[23rem] rounded-xl h-[2.5rem] text-center text-white bg-[#7582F7] px-2 primary-button items-center m-auto"
          // onClick={() => navigate('/auth/workspace/create')}
        >
          Send Invite
        </Button>
        <Button
          className="mt-4 w-[23rem] rounded-xl h-[2.5rem] text-center bg-white text-black px-2"
          onClick={() => navigate('/auth/workspace/kyc')}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
