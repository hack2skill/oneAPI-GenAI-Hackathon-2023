import React, { useState } from 'react';
import { InputNumber, message } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

import { PrimaryButton } from 'src/components/Button';
import { getUrl, request, addClientIdToBody } from 'src/utils/networkUtils';
import { addQueryParams } from 'src/utils/helpers';

import logo from 'src/images/logo.png';

export const SignUp = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone');
  const [number, setNumber] = useState(phone || null);

  let navigate = useNavigate();

  const generateOtpURL = (data) => {
    const url = addQueryParams(getUrl(`v1/auth/generate-otp/`), {
      type: 'signup',
    });
    return request('POST', url, addClientIdToBody(data), false);
  };

  const { mutate } = useMutation(generateOtpURL, {
    mutationKey: 'auth/signup-generate-otp',
    onSuccess: (res) => {
      if (res.status === 204) {
        navigate(`/auth/verify-otp?phone=${number}`);
      }
    },
    onError: (err) => {
      if (err.response.data && err.response.data.username) {
        messageApi.open({
          type: 'error',
          content: err,
        });
      }
    },
  });

  const signUpClick = () => {
    if (number) {
      if (number.toString().length !== 10) {
        messageApi.open({
          type: 'error',
          content: 'Enter a valid number',
        });
      } else {
        mutate({
          phone: number,
        });
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      signUpClick();
    }
  };

  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#C6C6C63D]">
      {contextHolder}
      <div className="flex flex-col h-[23rem] items-center ">
        <img src={logo} alt="logo" className="my-4 " />
        <div className="my-4 text-3xl">Create your account</div>
        <div className="flex flex-col my-6">
          <div className="text-sm text-[#898884]">
            Phone Number <span className="text-[red]">*</span>
          </div>
          <InputNumber
            required
            value={number}
            placeholder="Enter your phone number"
            className="my-2 w-[20rem] text-md text-center rounded h-[2.5rem] flex items-center input-number"
            min={1}
            onChange={(e) => setNumber(e)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <PrimaryButton
          className="p-[0.6rem] w-[20rem] text-white bg-[#BAC0FB] hover:bg-[#7582F7] rounded primary-button"
          text="Send OTP"
          btnClick={signUpClick}
        />
        <Link to="/auth/login" className="text-xs">
          Login instead
        </Link>
      </div>
    </div>
  );
};
