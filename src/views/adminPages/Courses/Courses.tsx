import React, { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from 'common/Container';

import { ListCourses, SearchBoxForRanking } from './components';
import { ICourseSearch } from 'interfaces/course.interfaces';
import { CourseSearch } from 'common/classes/course.search';
import { IOptions } from 'interfaces/rankings.interfaces';

const Courses = () => {
  const theme: any = useTheme();
  const [searchBody, setSearchBody] = useState<ICourseSearch>(new CourseSearch());
  const [searchOptions, setSearchOptions] = useState<IOptions>(new SearchOptions());

  const callbackList = () => {

  };  

  const callbackSearch = (body: any, options: IOptions) => {         
    setSearchBody(body);
    setSearchOptions(options);   
  };  

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main}>
        <SearchBoxForRanking theme={theme} callback={callbackSearch} />
      </Box>
      <Box bgcolor={theme.palette.alternate.main} marginTop={0} >
        <Container maxWidth={'90%'}>
          {
            <ListCourses callback={callbackList} theme={theme} searchCriteria={searchBody} options={searchOptions} />
          }         
        </Container>
      </Box>
    </Box>
  );
};

export default Courses;

export class SearchOptions implements IOptions {
  constructor() {
    this.sourceRefValueId = -1;
    this.nameRefValueId = -1;
    this.year = -1;
  }
  sourceRefValueId: number;
  nameRefValueId: number;
  year: number;
}
