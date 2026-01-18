import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Container from 'common/Container';

import { ListCourses, SearchBoxForRanking } from './components';
import { ICourseSearchCriteriaProps } from 'interfaces/course.interfaces';
import { CourseSearch } from 'common/classes/course.search';
import { IOptions } from 'interfaces/rankings.interfaces';

const Courses = () => {
  const theme: any = useTheme();
  const location = useLocation();
  const [searchBody, setSearchBody] = useState<ICourseSearchCriteriaProps>(new CourseSearch());
  const [searchOptions, setSearchOptions] = useState<IOptions>(new SearchOptions());
  const [initialSearchParams, setInitialSearchParams] = useState<{searchText?: string, state?: string} | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchText = searchParams.get('searchText');
    const state = searchParams.get('state');
    
    if (searchText || state) {
      setInitialSearchParams({
        searchText: searchText || undefined,
        state: state || undefined
      });
    }
  }, [location.search]);

  const callbackList = () => {

  };  

  const callbackSearch = (body: any, options: IOptions) => {         
    setSearchBody(body);
    setSearchOptions(options);   
  };  

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main}>
        <SearchBoxForRanking theme={theme} callback={callbackSearch} initialSearchParams={initialSearchParams} />
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
