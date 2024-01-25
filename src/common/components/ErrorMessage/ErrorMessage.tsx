import React from 'react';
import Box from '@material-ui/core/Box';
import { Alert, AlertTitle } from '@material-ui/core';

class ErrorMessage extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};  

  render() {
    return (
      <Box marginBottom={4} display={this.props.message !== '' ? 'box' : 'none'} width={'100%'}>
        <Alert variant="outlined" severity="error">
          <AlertTitle>Oops</AlertTitle>
          <div dangerouslySetInnerHTML={{ __html: this.props.message }} />
        </Alert>
      </Box>
    );
  }
}

interface IProps {
  message: string;
}

export default ErrorMessage;
