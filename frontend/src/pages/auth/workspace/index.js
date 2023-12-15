import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';

import { checkAvailabilityURL } from 'src/pages/auth/workspace/urls';
import { CURRENT_WORKSPACE, TOKEN_TYPE } from 'src/utils/constants';
import { NOT_AVAILABLE } from 'src/utils/error_msgs';

import { JoinWorkspace } from './join';
import { CreateWorkspace } from './create';
import { InviteCoWorkers } from './create/InviteCoWorkers';
import { AddOffice } from './create/AddOffice';
import { Kyc } from './create/Kyc';

export default function Workspace() {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  let navigate = useNavigate();

  useEffect(() => {
    if (code) {
      checkAvailability.mutate({
        code: code,
      });
    }
  }, [code]);

  const checkAvailability = useMutation(checkAvailabilityURL, {
    mutationKey: 'auth/check-workspace-url',
    onSuccess: (res) => {
      if (res.status === 200) {
        let response = JSON.parse(res.data);
        if (response.data === NOT_AVAILABLE) {
          localStorage.removeItem(CURRENT_WORKSPACE);
          localStorage.removeItem(TOKEN_TYPE);
          navigate('/auth/login');
        }
      }
    },
    onError: (err) => {
      messageApi.open({
        type: 'error',
        content: 'Some error occurred, Please try again',
      });
    },
  });

  return (
    <>
      {contextHolder}
      <Routes>
        <Route path={'join'} element={<JoinWorkspace />} />
        <Route path={'create'} element={<CreateWorkspace />} />
        <Route path={'invite'} element={<InviteCoWorkers />} />
        <Route path={'add-office/new'} element={<AddOffice />} />
        <Route path={'kyc'} element={<Kyc />} />
      </Routes>
    </>
  );
}
