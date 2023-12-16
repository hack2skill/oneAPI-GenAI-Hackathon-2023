import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Space, Tag, Input, Divider, Select, message } from 'antd';
import { useMutation } from 'react-query';

import { PrimaryButton } from 'src/components/Button';
import { AuthHeader } from 'src/pages/common/header/AuthHeader';
import { getUrl, request, addClientIdToBody } from 'src/utils/networkUtils';
import { AVAILABLE, NOT_AVAILABLE } from 'src/utils/error_msgs';
import { CURRENT_WORKSPACE } from 'src/utils/constants';
import { checkAvailabilityURL } from 'src/pages/auth/workspace/urls';

const { CheckableTag } = Tag;

export const CreateWorkspace = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState({
    name: '',
    url: '',
    company_size: '',
    requirements: '',
  });

  let navigate = useNavigate();
  const tagsData = ['Valuation', 'Estimate', 'Planning'];

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
    setData((prev) => ({
      ...prev,
      requirements: nextSelectedTags.join(','),
    }));
  };

  const checkAvailability = useMutation(checkAvailabilityURL, {
    mutationKey: 'auth/check-workspace-url',
    onSuccess: (res) => {
      if (res.status === 200) {
        let response = JSON.parse(res.data);
        if (response.data === AVAILABLE) {
          messageApi.open({
            type: 'success',
            content: 'Workspace url is available',
          });
        } else if (response.data === NOT_AVAILABLE) {
          messageApi.open({
            type: 'error',
            content: 'Workspace url is not available',
          });
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

  const createWorkspaceURL = (data) => {
    const url = getUrl(`v1/workspace/`);
    return request('POST', url, addClientIdToBody(data), true);
  };

  const createWorkspace = useMutation(createWorkspaceURL, {
    mutationKey: 'auth/create-workspace',
    onSuccess: (res) => {
      let response = JSON.parse(res.data);
      if (res.status === 200) {
        navigate(`/auth/welcome?code=${response.workspace}`);
        localStorage.setItem(CURRENT_WORKSPACE, response.workspace);
      }
    },
    onError: (err) => {
      messageApi.open({
        type: 'error',
        content: 'Workspace url is not available',
      });
    },
  });

  const createWorkspaceClick = () => {
    if (!data.name || !data.url) {
      messageApi.open({
        type: 'error',
        content: 'Please fill all the required data',
      });
    } else {
      createWorkspace.mutate(data);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {contextHolder}
      <AuthHeader />
      <div className="w-full h-full min-h-fit	 flex flex-col items-center bg-[#C6C6C63D]">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-3xl">Create a new Workspace</div>
          <div className="text-sm text-center w-[23rem]">
            Workspaces are shared environments where each valuer office can
            receive cases, create valuation, planning and estimation together
          </div>
          <div className="flex flex-col mt-10">
            <div className="text-sm text-[#898884]">
              Workspace Name <span className="text-[red]">*</span>
            </div>
            <Input
              value={data.name}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="my-1 w-[23rem] text-md rounded-lg h-[2.5rem] flex items-center"
              placeholder="Enter your workspace name"
            />
          </div>
          <div className="flex flex-col mt-5">
            <div className="text-sm text-[#898884]">
              Workspace Url <span className="text-[red]">*</span>
            </div>
            <Input
              addonBefore="propelerai.com/"
              value={data.url}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  url: e.target.value,
                }))
              }
              className="my-1 w-[23rem] text-md rounded-lg h-[2.5rem] flex items-center"
            />
            {data.url ? (
              <div
                className="w-full text-right text-sm text-[#4096ff] hover:cursor-pointer"
                onClick={() => checkAvailability.mutate({ url: data.url })}
              >
                check availability
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col mt-5">
            <div className="text-sm text-[#898884]">Software Requirement</div>
            <div className="my-1 w-[23rem]">
              <Space size={[0, 8]} wrap>
                {tagsData.map((tag) => (
                  <CheckableTag
                    closable
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onChange={(checked) => handleChange(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Space>
            </div>
          </div>
          <Divider className="bg-[black] mb-2" />
          <div className="my-4 flex flex-col w-[23rem]">
            <div className="text-sm text-[#898884]">
              How large is your company ?
            </div>
            <Select
              placeholder="Select your company size"
              className="w-full text-md rounded-lg h-[2.5rem] flex items-center"
              onChange={(value) =>
                setData((prev) => ({
                  ...prev,
                  company_size: value,
                }))
              }
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

          <PrimaryButton
            className="p-[0.6rem] w-[23rem] text-white bg-[#BAC0FB] hover:bg-[#7582F7] rounded-xl primary-button"
            text="Create New Workspace"
            btnClick={createWorkspaceClick}
          />
        </div>
      </div>
    </div>
  );
};
