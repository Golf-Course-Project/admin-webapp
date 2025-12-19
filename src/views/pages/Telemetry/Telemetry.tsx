import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from 'common/Container';

import { ListTelemetry } from './components';

const Telemetry = () => {
  const theme: any = useTheme();

  const callbackList = () => {

  };  

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main} marginTop={0} >
        <Container maxWidth={'90%'}>
          {
            <ListTelemetry callback={callbackList} theme={theme} />
          }         
        </Container>
      </Box>
    </Box>
  );
};

export default Telemetry;
