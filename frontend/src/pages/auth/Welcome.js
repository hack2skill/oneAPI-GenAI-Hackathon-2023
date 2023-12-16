import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import { PrimaryButton } from 'src/components/Button';
import logo from 'src/images/logo.png';

export const Welcome = () => {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  return (
    <div></div>
    // <div className="w-full h-[100vh] flex flex-col items-center justify-center bg-[#C6C6C63D]">
    //   <div className="flex flex-col h-[23rem] items-center ">
    //     <img src={logo} alt="logo" className="my-4 " />
    //     <div className="my-4 text-3xl">Welcome to PropelerAI</div>
    //     <div className="flex flex-col my-6  w-[20rem] text-center">
    //       Propeler helps you streamline valuation site visits, comparable values
    //       and report creation
    //     </div>
    //     <PrimaryButton
    //       disabled={false}
    //       className="p-[0.6rem] w-[20rem] text-white bg-[#7582F7] hover:bg-[#7582F7] rounded-xl primary-button"
    //       text="Get Started"
    //       btnClick={() => navigate(`/auth/workspace/invite?code=${code}`)}
    //     />
    //   </div>
    // </div>
  );
};
