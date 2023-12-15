import { Button } from 'antd';

export const PrimaryButton = ({
  text,
  className,
  btnClick,
  params,
  disabled,
  loading = false,
}) => {
  return (
    <Button
      disabled={disabled}
      className={`mt-4 mb-2  h-[3rem] rounded text-center  ${className}`}
      onClick={() => btnClick(params)}
      loading={loading}
    >
      {text}
    </Button>
  );
};
