import React from 'react';
import { Spin } from 'antd';

export const Loader = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Spin size="large" />
    </div>
  );
};
