import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import { ActiveUsers, DeletedUsers, SearchBox } from './components';
import Container from 'common/Container';

const Users = () => {
  const theme: any = useTheme();
  const [searchBody, setSearchBody] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const callbackList = () => {

  };  

  const callbackSearch = (body: any) => {      
    setSearchBody(body);  
    setIsDeleted(body.isDeleted);   
  };  

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main}>
        <SearchBox theme={theme} callback={callbackSearch} />
      </Box>
      <Box bgcolor={theme.palette.alternate.main} marginTop={0} >
        <Container maxWidth={'80%'}>
          {
            isDeleted ? <DeletedUsers callback={callbackList} theme={theme} searchCriteria={searchBody} /> : <ActiveUsers callback={callbackList} theme={theme} searchCriteria={searchBody} />
          }         
        </Container>
      </Box>
    </Box>
  );
};

export default Users;
