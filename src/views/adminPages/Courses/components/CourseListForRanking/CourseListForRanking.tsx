/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Container, TextField } from '@material-ui/core';
import { SkeletonTable } from 'common/components';
import EditCourse from '../EditCourse';
import RankingIcon from '@material-ui/icons/Bookmark';
import LockIcon from '@material-ui/icons/Lock';
import Illustration from 'svg/illustrations/Globe';

import { IListCoursesApiResponse, ICourses, ICourseSearch, ICourse } from 'interfaces/course.interfaces';
import CourseService from 'services/course.service';
import ErrorMessage from 'common/components/ErrorMessage';

class CourseListForRanking extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  readonly _pageSize: number = 25;

  state: IForm = {
    action: 'empty',
    errorMsg: '',   
    data: [],
    count: 0,   
    rowId: '',
    selectedRowId: '',      
    openCourseSideBar: false,   
    selectedCourse: null,
    textboxValue: '', 
  }

  componentDidMount() {
       
  }

  componentDidUpdate(prevProps: any) {    
    if (prevProps.searchCriteria !== this.props.searchCriteria && this.props.searchCriteria !== null) {        
      this.setState({ action: 'loading' });     
      this.search(this.props.searchCriteria);                
    }
  } 

  handleInputChange = (e: any) => {
    this.setState({ textboxValue: e.target.value });
    console.log(e.target.value);
  }

  private handleCellClick = (id: string, value: string) => {
    this.setState({ selectedRowId: id, textboxValue: value});

  }
  
  private handleMouseEnter = (e: any, id: string) => {
    this.setState({ rowId: id, clip: false });

    //if (id === this.state.selectedRowId) {
    //  this.setState({ selectedRowId: '' });
    //}
  }

  private handleMouseLeave = (e: any, id: string) => {
    this.setState({ rowId: '', clip: false });
  }    

  private handleOpenCourseSideBar = (row: ICourses) => {           
    const index = this.state.data.findIndex((item: ICourses) => item.id === row.id);    
    const nextRowId = (index + 1) < this.state.count ? this.state.data[index + 1].id : this.state.data[index].id;  

    this.setState({ openCourseSideBar: true, openFacilitySideBar: false, selectedCourse: row, selectedRowId: row.id, nextRowId: nextRowId});      
  };    

  private handleSidebarClose = () => {
    this.setState({ openCourseSideBar: false, openFacilitySideBar: false });       
  }; 
  
  private handleCourseUpdate = (course: ICourse | null) => {
    if (course === null) return;   
   
    this.setState(data => {
      const newData = this.state.data.map(item => item.id === course.id
        ? { ...item, courseName: course.name, address1: course.address1, city: course.city }
        : item
      );
      return { data: newData };
    });    
  };

  private search = (body: ICourseSearch) => {
    const client: CourseService = new CourseService();  
    
    client.search(body).then(async (response: IListCoursesApiResponse) => {        

      if (response.messageCode !== 200) {
        this.setState({ errorMsg: response.message, action: 'error', courseArray: [], selectedRowId: ''});        
        return;
      }

      if (response.success) {          
        
        this.setState({
          paging: {
            currentPage: 1,
            spanStart: 1,
            spanEnd: this._pageSize
          },
          pageCount: Math.ceil(response.count / this._pageSize),
          data: response.value,
          count: response.count,
          selectedRowId: '',     
          errorMsg: '',
          action: 'normal'         
        });       
             
      }
    }).catch((error: Error) => {      
      this.setState({ errorMsg: error.message, action: 'error', courseArray: []});           
    });
  }  

  render() {
    return (
      <Box>   

        <ErrorMessage message={this.state.errorMsg}></ErrorMessage>               
        
        <Box display="flex" justifyContent="center" alignItems="center" sx={this.state.action === 'empty' ? { display: 'block' } : { display: 'none' }}>
          <Container maxWidth="sm">
            <Box display="flex" justifyContent="center" alignItems={'center'}>
              <Illustration width='400px' height='400px'/>
            </Box>
          </Container>         
        </Box>

        <Box sx={this.state.action === 'normal' ? { display: 'block' } : { display: 'none' }}>          
          <Box marginBottom={4} sx={{ display: 'flex' }}>            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>   
                    <TableCell align="center" sx={{ width: '60px' }}>&nbsp;</TableCell>                
                    <TableCell align="center" sx={{ width: '60px' }}>&nbsp;</TableCell> 
                    <TableCell align="left">Course</TableCell>
                    <TableCell align="left">Facility</TableCell>            
                    <TableCell align="left">City</TableCell>  
                    <TableCell align="left">State</TableCell>   
                    <TableCell align="center" sx={{ width: '100px' }}>Ranking</TableCell>  
                    <TableCell align="left">&nbsp;</TableCell>                                                                                         
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.map((row) => (                    
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: '80px'}}
                      hover
                      onMouseEnter={(e: any) => this.handleMouseEnter(e, row.id) }
                      onMouseLeave={(e: any) => this.handleMouseLeave(e, row.id) }
                      selected={this.state.selectedRowId === row.id ? true : false}                                      
                    > 
                      <TableCell align="center">                                                 
                        { row.type === 2  ? <LockIcon color="disabled" /> : null }         
                      </TableCell> 
                      <TableCell align="center">                                                 
                        { row.rankingCount > 0 ? <RankingIcon color="secondary" /> : null }         
                      </TableCell>                                       
                      <TableCell align="left">
                        <Link component="button" onClick={(e:any) => this.handleOpenCourseSideBar(row)}>{row.courseName}</Link>                        
                      </TableCell>   
                      <TableCell align="left">
                        {row.facilityName}                       
                      </TableCell>                           
                      <TableCell align="left">{row.city}</TableCell>   
                      <TableCell align="left">{row.state}</TableCell>  
                      <TableCell align="center" onClick={(e:any) => this.handleCellClick(row.id, '')}>
                        {this.state.selectedRowId === row.id ? (
                          <TextField
                            autoFocus
                            size="small"
                            value={this.state.textboxValue}
                            id={row.id}
                            name={row.id}
                            onChange={(e:any) => this.handleInputChange(e)}                            
                          />
                        ) : (
                          row.rankingCount
                        )}
                      </TableCell>
                      <TableCell align="left">&nbsp;</TableCell>                                                                               
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>          
        </Box>

        <Box>
          <SkeletonTable rows={10} columns={6} display={this.state.action === 'loading' ? true : false}></SkeletonTable>                 
        </Box>    

        <EditCourse
          theme={this.props.theme}
          open={this.state.openCourseSideBar}
          facilityId={this.state.selectedCourse?.facilityId}          
          id={this.state.selectedCourse?.id}
          name={this.state.selectedCourse?.courseName}         
          onClose={this.handleSidebarClose}
          onCourseUpdate={(e: any) => this.handleCourseUpdate(e)}                                
          courses={[]}         
        >
        </EditCourse>       
      </Box>
    );
  }
}

export default CourseListForRanking;

interface IProps {
  callback: () => void;
  theme: Theme;
  searchCriteria: ICourseSearch | null;
}

interface IForm {
  action: string,
  errorMsg: string;  
  data: ICourses[]; 
  count: number;
  rowId: string;
  selectedRowId: string;     
  openCourseSideBar: boolean;  
  selectedCourse: ICourses | null; 
  textboxValue: any;
}