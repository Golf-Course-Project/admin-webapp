import React from 'react';
import { Alert, AlertTitle } from '@material-ui/core';

class ErrorMessage extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};  

  render() {
    if (!this.props.message) return null;
    
    return (
      <div style={{ width: '100%', boxSizing: 'border-box' }}>
        <Alert variant="outlined" severity="error" style={{ width: '100%', maxWidth: '100%', paddingTop: '12px', paddingBottom: '8px' }}>
          <AlertTitle>{this.props.message}</AlertTitle>
        </Alert>
      </div>
    );
  }
}

interface IProps {
  message: string;
}

export default ErrorMessage;
