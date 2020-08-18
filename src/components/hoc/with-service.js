import React from 'react';
import {ServiceConsumer} from '../service-context';

const withService = () => (Wrapped) => {
  return (props) => {
    return (
      <ServiceConsumer>
        {(apiService) => {
          return <Wrapped {...props} apiService={apiService} />;
        }}
      </ServiceConsumer>
    );
  };
};

export default withService;
