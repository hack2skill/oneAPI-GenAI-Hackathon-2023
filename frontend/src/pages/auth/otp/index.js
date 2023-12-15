import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useMutation } from 'react-query';
import { message } from 'antd';

import { PrimaryButton } from 'src/components/Button';
import { TOKEN_TYPE } from 'src/utils/constants';
import { getUrl, request, addClientIdToBody } from 'src/utils/networkUtils';

import './style.css';

export const OtpAuth = () => {
  const [otp, setOtp] = useState();
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  let navigate = useNavigate();

  const phone = searchParams.get('phone'); // "testphone"

  async function redirectUser(response) {
    let hostname = window.location.hostname;
    let port = window.location.port;

    if (hostname.includes('.')) {
      let idx = hostname.indexOf('.');
      hostname = hostname.substring(idx + 1, hostname.length);
    }
    if (port) {
      hostname = `${hostname}:${port}`;
    }

    if (process.env.NODE_ENV === 'production') {
      window.location.href = `https://${response.url}.${hostname}/auth/redirect/?code=${response.accessToken}`;
    } else {
      window.location.href = `http://${response.url}.${hostname}/auth/redirect/?code=${response.accessToken}`;
    }
    // localStorage.setItem(TOKEN_TYPE, response.accessToken);
  }

  const verifyOtpURL = (data) => {
    const url = getUrl(`v1/auth/verify-otp/`);
    return request('POST', url, addClientIdToBody(data), false);
  };

  const { mutate } = useMutation(verifyOtpURL, {
    mutationKey: 'auth/verify-otp',
    onSuccess: (res) => {
      if (res.status === 200) {
        let response = JSON.parse(res.data);
        localStorage.setItem(TOKEN_TYPE, response.accessToken);

        if (response.accessToken && !response.workspace) {
          navigate('/auth/workspace/join');
        } else {
          redirectUser(response);
        }
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

  const verifOtpClick = () => {
    if (otp.toString().length === 6) {
      mutate({
        phone: phone,
        otp: otp,
      });
    } else {
      messageApi.open({
        type: 'error',
        content: 'Enter a valid otp',
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      verifOtpClick();
    }
  };

  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#C6C6C63D]">
      {contextHolder}
      <div className="flex flex-col h-[20rem] items-center">
        <div className="mb-2 text-3xl">Check your phone</div>
        <div className="text-base w-[20rem] text-center my-2">
          We’ve sent a one-time password. Please check your messages at +91
          {phone}
        </div>
        <div onKeyDown={handleKeyPress}>
          <OtpInput
            value={otp}
            onChange={(otp) => setOtp(otp)}
            numInputs={6}
            separator={<span> &nbsp;</span>}
            className="bg-white otp-input border mx-2 my-10 p-2 rounded-[30%]"
          />
        </div>
        <PrimaryButton
          className="p-[0.6rem] w-[20rem] text-white bg-[#BAC0FB] hover:bg-[#7582F7] rounded-xl primary-button"
          text="Verify OTP"
          btnClick={verifOtpClick}
        />
        <Link to={`/auth/signup?phone=${phone}`} className="text-xs">
          Edit number
        </Link>
      </div>
    </div>
  );
};
