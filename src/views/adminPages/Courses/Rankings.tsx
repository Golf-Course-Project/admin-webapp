import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from 'common/Container';

import { CourseListForRanking, SearchBox } from './components';
import { ICourseSearch } from 'interfaces/course.interfaces';
import { CourseSearch } from 'common/classes/course.search';

const Rankings = () => {
  const theme: any = useTheme();
  const [searchBody, setSearchBody] = useState<ICourseSearch>(new CourseSearch());

  const callbackList = () => {

  };  

  const callbackSearch = (body: any) => {      
    setSearchBody(body);   
  };  

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main}>
        <SearchBox theme={theme} callback={callbackSearch} />
      </Box>
      <Box bgcolor={theme.palette.alternate.main} marginTop={0} >
        <Container maxWidth={'90%'}>
          {
            <CourseListForRanking callback={callbackList} theme={theme} searchCriteria={searchBody} />
          }         
        </Container>
      </Box>
    </Box>
  );
};

export default Rankings;
