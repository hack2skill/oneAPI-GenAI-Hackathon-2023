import React, { useState } from 'react';
import { InputNumber, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

import { getUrl, request, addClientIdToBody } from 'src/utils/networkUtils';
import { addQueryParams } from 'src/utils/helpers';
import { PHONE_IS_INVALID } from 'src/utils/error_msgs';
import { PrimaryButton } from 'src/components/Button';
import logo from 'src/images/logo.png';

export const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [number, setNumber] = useState();
  let navigate = useNavigate();

  const generateOtpURL = (data) => {
    const url = addQueryParams(getUrl(`authenticator/generate_otp/`), {
      type: 'login',
    });
    return request('POST', url, addClientIdToBody(data), false);
  };

  const { mutate } = useMutation(generateOtpURL, {
    mutationKey: 'auth/login-generate-otp',
    onSuccess: (res) => {
      if (res.status === 204) {
        navigate(`/auth/verify-otp?phone=${number}`);
      }
    },
    onError: (err) => {
      if (JSON.parse(err.response.data).detail === PHONE_IS_INVALID) {
        messageApi.open({
          type: 'error',
          content: 'Phone number does not exists',
        });
      }
    },
  });

  const loginClick = () => {
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
      loginClick();
    }
  };

  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#C6C6C63D]">
      {contextHolder}
      <div className="flex flex-col h-[23rem] items-center ">
        <img src={logo} alt="logo" className="my-4 " />
        <div className="my-4 text-3xl">Login to PropelerAI</div>
        <div className="flex flex-col my-6">
          <div className="text-sm text-[#898884]">Phone Number</div>
          <InputNumber
            required
            value={number}
            placeholder="Enter your phone number"
            className="my-2 w-[20rem] text-md text-center rounded h-[2.5rem] flex items-center input-number"
            min={1}
            onChange={setNumber}
            onKeyDown={handleKeyPress}
          />
        </div>
        <PrimaryButton
          disabled={number ? false : true}
          className="p-[0.6rem] w-[20rem] text-white bg-[#BAC0FB] hover:bg-[#7582F7] rounded primary-button"
          text="Send OTP"
          btnClick={loginClick}
        />
        <Link to="/auth/signup" className="text-xs">
          Signup
        </Link>
      </div>
    </div>
  );
};
