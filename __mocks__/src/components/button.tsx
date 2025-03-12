import React from 'react';
import { getThis } from '../utils/utils';

export const Button: React.FC = () => {
  const buttonText = getThis('Button Text');

  return (
    <button data-testid="root_button">
      {buttonText}
    </button>
  );
};
