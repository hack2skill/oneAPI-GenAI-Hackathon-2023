import React, { useState } from 'react';
import { Input, message } from 'antd';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useMutation } from 'react-query';

import { getUrl, request, addClientIdToBody } from 'src/utils/networkUtils';
import { PrimaryButton } from 'src/components/Button';
import { AuthHeader } from 'src/pages/common/header/AuthHeader';

export const InviteCoWorkers = () => {
  let navigate = useNavigate();
  const [numbers, setNumbers] = useState();
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();

  const code = searchParams.get('code');
  const { TextArea } = Input;

  const inviteURL = (data) => {
    const url = getUrl(`v1/workspace/invite`);
    return request('POST', url, addClientIdToBody(data), true);
  };

  const { mutate } = useMutation(inviteURL, {
    mutationKey: 'auth/invite-to-workspace',
    onSuccess: (res) => {
      if (res.status === 204) {
        messageApi.open({
          type: 'error',
          content: 'Your invites has been sent',
        });
        navigate(`/auth/workspace/kyc?code=${code}`);
      }
    },
    onError: (err) => {
      messageApi.open({
        type: 'error',
        content: 'Some error occurred. Please try again',
      });
    },
  });

  const inviteClick = () => {
    let phone_numbers = numbers;
    if (!phone_numbers || !phone_numbers.length) {
      messageApi.open({
        type: 'error',
        content: 'Please enter phone numbers to invite',
      });
    } else {
      let numbersList = phone_numbers.split(',');
      for (const item in numbersList) {
        let data = numbersList[item].replace(/\s/g, '');
        if (data.length !== 10) {
          messageApi.open({
            type: 'error',
            content: (
              <>
                One of the numbers entered is invalid <br />
              </>
            ),
          });
          return;
        }
      }

      mutate({
        code: code,
        numbers: numbers,
      });
    }
  };

  return (
    <div className="h-screen flex flex-col min-h-fit">
      {contextHolder}
      <AuthHeader />
      <div className="w-full h-full flex flex-col items-center md:pt-10 bg-[#C6C6C63D] min-h-fit">
        <div className="flex flex-col h-[23rem] items-center ">
          <div className="my-4 text-3xl">Invite your co-workers</div>
          <div className="flex flex-col my-6  w-[23rem] text-center">
            Propeler is meant to be used with your team. Invite some co-workers
            to test it out.
          </div>
          <div className="flex flex-col my-6">
            <div className="text-sm text-[#898884]">
              Workspace URL <span className="text-[red]">*</span>
            </div>
            <Input
              disabled
              placeholder={`propelerai.com/team_invite/redeem/${code}`}
              className="my-2 w-[23rem] text-md text-center rounded h-[2.5rem] flex items-center"
              min={1}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-[#898884]">
              Phone Numbers <span className="text-[red]">*</span>
            </div>
            <TextArea
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
              className="my-1 w-[23rem] text-md rounded-lg flex items-start"
              placeholder="Enter phone numbers"
              rows={4}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div>
          <PrimaryButton
            btnClick={inviteClick}
            className="p-[0.6rem] w-[23rem] text-white bg-[#BAC0FB] hover:bg-[#7582F7] rounded primary-button"
            text="Send Invites"
            // btnClick={() => navigate('/auth/workspace/kyc')}
          />
          <Link to="/auth/login" className="text-xs">
            Skip this step
          </Link>
        </div>
      </div>
    </div>
  );
};
