import * as React from 'react';

interface PlayIconProps {
  width?: string;
  height?: string;
  className?: string;
}

const IconCongratulation: React.FC<PlayIconProps> = ({
  width = '50px',
  height = '50px',
  className = '',
}) => {
  return (
    <img
      src={'/icons/congratulation.png'}
      alt="Button Icon"
      width={width}
      height={height}
      className={className}
    />
  );
};
export { IconCongratulation };
