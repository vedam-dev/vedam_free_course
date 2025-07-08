import React from 'react';

import CustomButton from './CustomButton';
import Form from './Form';

const page = () => {
  return (
    <div>
      <CustomButton label="Sign in with Google" />
      <Form />
    </div>
  );
};

export default page;
