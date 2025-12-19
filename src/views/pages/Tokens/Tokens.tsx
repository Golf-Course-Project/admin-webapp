import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { ActiveTokens } from './components';

import Container from 'common/Container';

const Tokens = () => {
  const theme: any = useTheme(); 

  return (
    <Box>      
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <ActiveTokens theme={theme} />
        </Container>
      </Box>
    </Box>
  );
};

export default Tokens;
