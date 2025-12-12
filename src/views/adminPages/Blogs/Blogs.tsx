import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from 'common/Container';

import { ListBlogs } from './components';

const Blogs = () => {
  const theme: any = useTheme();

  const callbackList = () => {

  };  

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main} marginTop={0} >
        <Container maxWidth={'90%'}>
          {
            <ListBlogs callback={callbackList} theme={theme} />
          }         
        </Container>
      </Box>
    </Box>
  );
};

export default Blogs;
