import { FC } from 'react';
import { CgSpinnerTwo } from 'react-icons/cg';
import './spinner.css';


interface SpinnerProps {
  size?: string,
  marginTop?: string,
}

export const Spinner: FC<SpinnerProps> = ({ size, marginTop }) => {
  return (
    <div className="spinner-container">
      <CgSpinnerTwo className={`spinner ${size} ${marginTop}`} />
    </div>
  );
};

Spinner.defaultProps = {
  size: 'font-3',
  marginTop: 'm-0',
};
