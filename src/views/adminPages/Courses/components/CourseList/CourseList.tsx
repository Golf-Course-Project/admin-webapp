/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@material-ui/core';
import EditRowIcon from '@material-ui/icons/ModeEditOutlineOutlined';

import { IListCoursesResponse, ICourses, ICourseSearch } from 'interfaces/course.interfaces';
import CourseService from 'services/course.service';
import { SkeletonTable } from 'common/components';
import EditCourse from '../Edit';
import { CourseSearch } from 'common/classes/course.search';

class CourseList extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  readonly _pageSize: number = 25;

  state: ICourseListPage = {
    action: 'loading',
    errorMsg: '',
    data: [],      
    rowId: '',
    selectedRowId: '',
    openSideBar: false,
    selectedCourse: null   
  }

  componentDidMount() {    
    this.load_courses(new CourseSearch('mi'));    
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.searchCriteria !== this.props.searchCriteria && this.props.searchCriteria !== null) {        
      this.load_courses(this.props.searchCriteria);          
    }
  } 

  private handleMouseEnter = (e: any, id: string) => {
    this.setState({ rowId: id });

    //if (id === this.state.selectedRowId) {
    //  this.setState({ selectedRowId: '' });
    //}
  }

  private handleMouseLeave = (e: any, id: string) => {
    this.setState({ rowId: '' });
  }    

  private handleSidebarOpen = (row: ICourses) => {      
    this.setState({ openSideBar: true, selectedCourse: row, selectedRowId: row.id});      
  };  

  private handleSidebarClose = () => {
    this.setState({ openSideBar: false });    
  };

  private load_courses = (body: ICourseSearch) => {
    const client: CourseService = new CourseService();  
    //const defaultBody: IListUsersRequest = { name: null, email: null, role: null, status: -1, isDeleted: false }; 
    //let body: IListUsersRequest = this.props.searchCriteria != null ? this.props.searchCriteria : defaultBody;   

    client.Search(body).then(async (response: IListCoursesResponse) => {       
      
      if (response.success) {      
        this.setState({
          paging: {
            currentPage: 1,
            spanStart: 1,
            spanEnd: this._pageSize
          },
          pageCount: Math.ceil(response.count / this._pageSize),
          data: response.value,
          action: 'normal'
        });
      }

    }).catch((error: Error) => {      
      console.log(error);
    });
  }  

  render() {
    return (
      <Box>                  
        <Box sx={this.state.action === 'normal' ? { display: 'block' } : { display: 'none' }}>          
          <Box marginBottom={4} sx={{ display: 'flex' }}>            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ paddingLeft: '20px' }}>Facility</TableCell>                    
                    <TableCell align="left">Course</TableCell>
                    <TableCell align="left">Address</TableCell>
                    <TableCell align="left">City</TableCell>     
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
                      <TableCell align="left">{row.facilityName}</TableCell>
                      <TableCell align="left">{row.courseName}</TableCell>     
                      <TableCell align="left">{row.address1}</TableCell>    
                      <TableCell align="left">{row.city}</TableCell>              
                      <TableCell align="center" sx={{ width: '130px'}}>
                        <div style={{ display: this.state.rowId === row.id ? 'flex' : 'none'}}>
                          <IconButton aria-label="edit user" onClick={(e:any) => this.handleSidebarOpen(row)}>
                            <EditRowIcon />
                          </IconButton>                             
                        </div>
                      </TableCell>                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>          
        </Box>
        <Box>
          <SkeletonTable rows={10} columns={5} display={this.state.action === 'loading' ? true : false}></SkeletonTable>                 
        </Box>   
        <EditCourse theme={this.props.theme} open={this.state.openSideBar} facilityId={this.state.selectedCourse?.facilityId} courseId={this.state.selectedCourse?.id} courseName={this.state.selectedCourse?.courseName} onClose={this.handleSidebarClose}></EditCourse>     
      </Box>
    );
  }
}

export default CourseList;

interface IProps {
  callback: () => void;
  theme: Theme;
  searchCriteria: ICourseSearch | null;
}

interface ICourseListPage {
  action: string,
  errorMsg: string;
  data: ICourses[];   
  rowId: string;
  selectedRowId: string; 
  openSideBar: boolean;
  selectedCourse: ICourses | null;
}
