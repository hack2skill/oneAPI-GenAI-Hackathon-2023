import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import moment from 'moment/moment';
import Avatar from 'react-avatar';
import { message, Input } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import { INVALID_WORKSPACE } from 'src/utils/error_msgs';
import { getUrl, request, addClientIdToBody } from 'src/utils/networkUtils';
import { PrimaryButton } from 'src/components/Button';
import { AuthHeader } from 'src/pages/common/header/AuthHeader';
import { Loader } from 'src/components/loader';

export const JoinWorkspace = () => {
  const [workspaceInvitations, setWorkspaceInvitations] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [selected, setSelected] = useState({});
  const [joinUsingCode, setJoinUsingCode] = useState(false);
  const [workspaceCode, setWorkspaceCode] = useState('');

  let navigate = useNavigate();

  const fetchInvitesURL = () => {
    const url = getUrl(`v1/workspace/invite`);
    return request('GET', url, null, true).then((res) => res.data);
  };

  const { isLoading } = useQuery(['workspace/invites'], fetchInvitesURL, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setWorkspaceInvitations(JSON.parse(data));
    },
    onError: (err) => console.log(err),
  });

  const acceptInviteURL = (data) => {
    const url = getUrl(`v1/workspace/invite`);
    return request('PUT', url, addClientIdToBody(data), true);
  };

  const { mutate, isAcceptLoading } = useMutation(acceptInviteURL, {
    mutationKey: 'workspace/accept-invite',
    onSuccess: (res) => {
      let response = JSON.parse(res.data);
      if (res.status === 201) {
        navigate(`/${response.url}`);
      }
    },
    onError: (err) => {
      let response = JSON.parse(err.response.data);
      if (response.detail === INVALID_WORKSPACE) {
        messageApi.open({
          type: 'error',
          content: 'The entered code is invalid',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'Some error occurred, Please try again',
        });
      }
    },
  });

  const joinWorkspaceCLick = () => {
    if (joinUsingCode) {
      if (!workspaceCode) {
        messageApi.open({
          type: 'error',
          content: 'Enter workspace code to join',
        });
        return;
      }
      mutate({
        workspace_code: workspaceCode,
      });
    } else {
      if (!selected) {
        messageApi.open({
          type: 'error',
          content: 'Select an invitation to join',
        });
        return;
      }
      mutate({
        invite_code: selected.workspace.code,
        company_name: selected.companyName,
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      joinWorkspaceCLick();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="h-screen flex flex-col">
      {contextHolder}
      <AuthHeader />
      <div className="w-full h-full flex flex-col items-center py-14 bg-[#C6C6C63D]">
        <div className="flex flex-col h-[25rem] items-center ">
          <div className="my-4 text-3xl">Join an existing workspace</div>
          <div className="text-sm w-[23rem] text-center mb-4">
            If you have received an invite, it will be visible below
          </div>
          {!joinUsingCode ? (
            workspaceInvitations.length ? (
              workspaceInvitations.map((item) => (
                <div
                  key={item}
                  onClick={() =>
                    setSelected(
                      selected?.workspace?.code === item.workspace.code
                        ? {}
                        : item
                    )
                  }
                  className="w-[23rem] rounded-md px-4 py-4 flex justify-between items-center mt-4 hover:cursor-pointer"
                  style={{
                    backgroundColor:
                      selected?.workspace?.code === item.workspace.code
                        ? '#CAD4E8'
                        : '#D9D9D9',
                  }}
                >
                  <div className="flex justify-center items-center">
                    <Avatar
                      size="30"
                      name={item.workspace.name}
                      className="h-[2rem] w-[2rem] bg-white rounded-full mr-2"
                    />

                    <div>
                      <div>{item.workspace.name}</div>
                      <div className="text-xs"> Invited by: {item.invitee}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#625B71]">
                      Sent {moment(item.createdAt).fromNow()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-[22rem] rounded-md px-4 py-4 flex justify-center border-2 border-slate-400	 border-dotted items-center mt-4">
                <InfoCircleOutlined />
                <span className="ml-2 text-sm">
                  No pending invitations found
                </span>
              </div>
            )
          ) : (
            <div className="flex flex-col my-6 w-[23rem]">
              <div className="text-sm text-[#898884]">Workspace Code</div>
              <Input
                required
                value={workspaceCode}
                placeholder="Enter workspace code"
                className="mt-2 w-[23rem] text-md text-center rounded h-[2.5rem] flex items-center input-number"
                min={1}
                onChange={(e) => setWorkspaceCode(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
          )}
          {!joinUsingCode ? <div className="my-2"></div> : <></>}
          {!joinUsingCode ? (
            <PrimaryButton
              className="p-[0.6rem] w-[23rem] text-black bg-white hover:text-black rounded-xl"
              text="Join using workspace code instead"
              btnClick={() => setJoinUsingCode(true)}
              loading={isAcceptLoading}
            />
          ) : (
            <PrimaryButton
              className="p-[0.6rem] w-[23rem] text-black bg-white hover:text-black rounded-xl"
              text="Join using invites instead"
              btnClick={() => setJoinUsingCode(false)}
            />
          )}

          {Object.keys(selected).length > 0 || joinUsingCode ? (
            <PrimaryButton
              disabled={false}
              className="p-[0.6rem] w-[23rem] text-white bg-[#7582F7] hover:bg-[#7582F7] rounded-xl primary-button"
              text="Join"
              btnClick={() => joinWorkspaceCLick()}
              loading={isAcceptLoading}
            />
          ) : (
            <PrimaryButton
              disabled={false}
              className="p-[0.6rem] w-[23rem] text-white bg-[#7582F7] hover:bg-[#7582F7] rounded-xl primary-button"
              text="Create New Workspace"
              btnClick={() => navigate('/auth/workspace/create')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
