/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@material-ui/core';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';
import PublicIcon from '@material-ui/icons/RadioButtonChecked';
import PrivateIcon from '@material-ui/icons/MotionPhotosOff';
import UnknownIcon from '@material-ui/icons/RadioButtonUnchecked';

import { IListCoursesApiResponse, ICourses, ICourseSearch, ICourse } from 'interfaces/course.interfaces';
import CourseService from 'services/course.service';
import { SkeletonTable } from 'common/components';
import EditCourse from '../EditCourse';
import { IFacility } from 'interfaces/facility.interfaces';
import EditFacility from '../EditFacility';
import ErrorMessage from 'common/components/ErrorMessage';

class CourseList extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  readonly _pageSize: number = 25;

  state: IForm = {
    action: 'empty',
    errorMsg: '',   
    data: [],
    count: 0,   
    rowId: '',
    selectedRowId: '',    
    clip: false,
    openCourseSideBar: false,
    openFacilitySideBar: false,
    selectedCourse: null,
    courseArray: []
  }

  componentDidMount() {
       
  }

  componentDidUpdate(prevProps: any) {
    
    if (prevProps.searchCriteria !== this.props.searchCriteria && this.props.searchCriteria !== null) {        
      this.setState({ action: 'loading' });
      this.search(this.props.searchCriteria);                
    }

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

  private handleOpenFacilitySideBar = (row: ICourses) => {      
    this.setState({ openCourseSideBar: false, openFacilitySideBar: true, selectedCourse: row, selectedRowId: row.id});      
  };  

  private handleSidebarClose = () => {
    this.setState({ openCourseSideBar: false, openFacilitySideBar: false });       
  }; 

  private handleFacilityUpdate = (facility: IFacility | null) => {
    if (facility === null) return;
                
    this.setState(data => {
      const newData = this.state.data.map(item => item.facilityId === facility.id
        ? { ...item, facilityName: facility.name, type: facility.type }
        : item
      );
      return { data: newData };
    });     
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

  private handleCourseChange = (obj: {courseId: string, faclityId: string}) => {
    const index = this.state.data.findIndex((item: ICourses) => item.id === obj.courseId);
    const nextRowId = (index + 1) < this.state.count ? this.state.data[index + 1].id : this.state.data[index].id;  

    this.setState({ rowId: nextRowId, selectedRowId: nextRowId });
  };

  private handleFacilityChange = (obj: {courseId: string, faclityId: string}) => {    
    this.setState({ rowId: obj.courseId, selectedRowId: obj.courseId });
  };

  private handleSwapFacilityToCourse = (obj: {courseId: string, facilityId: string}) => {   
    this.setState({ rowId: obj.courseId, selectedRowId: obj.courseId, openCourseSideBar: true, openFacilitySideBar: false });
  };

  private handleSwapCourseToFacility = (obj: {courseId: string, faclityId: string}) => {   
    this.setState({ openCourseSideBar: false, openFacilitySideBar: true, rowId: obj.courseId, selectedRowId: obj.courseId });
  };

  private search = (body: ICourseSearch) => {
    const client: CourseService = new CourseService();  
    
    client.search(body).then(async (response: IListCoursesApiResponse) => {        

      if (response.messageCode !== 200) {
        this.setState({ errorMsg: response.message, action: 'error', courseArray: [], selectedRowId: ''});
        localStorage.removeItem('course_search_results_array'); 
        return;
      }

      if (response.success) {  

        const newArray = response.value.map(item => ({
          courseId: item.id,
          facilityId: item.facilityId
        }));
        
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
          action: 'normal',
          courseArray: newArray
        });       

        localStorage.setItem('course_search_results_array', JSON.stringify(newArray));        
      }
    }).catch((error: Error) => {      
      this.setState({ errorMsg: error.message, action: 'error', courseArray: []});   
      localStorage.removeItem('course_search_results_array');   
    });
  }  

  render() {
    return (
      <Box>   

        <ErrorMessage message={this.state.errorMsg}></ErrorMessage>               

        <Box sx={this.state.action === 'normal' ? { display: 'block' } : { display: 'none' }}>          
          <Box marginBottom={4} sx={{ display: 'flex' }}>            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">&nbsp;</TableCell>
                    <TableCell align="left">Facility</TableCell>                    
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
                      <TableCell align="center" sx={{ width: '40px'}}>
                        <UnknownIcon color="disabled" sx={(row.type !== 1 && row.type !== 2) ? {display: 'flex'} : {display: 'none'}}/>
                        <PublicIcon color="primary" sx={row.type === 1 ? {display: 'flex'} : {display: 'none'}}/>
                        <PrivateIcon color="secondary" sx={row.type === 2 ? {display: 'flex'} : {display: 'none'}}/>
                      </TableCell>                                                           
                      <TableCell align="left">
                        <Link component="button" onClick={(e:any) => this.handleOpenFacilitySideBar(row)}>{row.facilityName}</Link>                        
                      </TableCell>
                      <TableCell align="left">
                        <Link component="button" onClick={(e:any) => this.handleOpenCourseSideBar(row)}>{row.courseName}</Link>
                      </TableCell>     
                      <TableCell align="left">{row.address1}</TableCell>    
                      <TableCell align="left">{row.city}</TableCell>              
                      <TableCell align="center" sx={{ width: '80px' }}>
                        <div style={{ display: this.state.rowId === row.id ? 'flex' : 'none'}}>                          
                          <GolfCourseIcon />                                                 
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
          onCourseChange={(e: any) => this.handleCourseChange(e)}  
          onSwapCourseToFacility={(e: any) => this.handleSwapCourseToFacility(e)}   
          courses={this.state.courseArray}         
        ></EditCourse>

        <EditFacility
          theme={this.props.theme}
          open={this.state.openFacilitySideBar}
          facilityId={this.state.selectedCourse?.facilityId}          
          onClose={this.handleSidebarClose}         
          onFacilityUpdate={(e: any) => this.handleFacilityUpdate(e)}
          onFacilityChange={(e: any) => this.handleFacilityChange(e)}  
          onSwapFacilityToCourse={(e: any) => this.handleSwapFacilityToCourse(e)}
        ></EditFacility>        
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

interface IForm {
  action: string,
  errorMsg: string;  
  data: ICourses[]; 
  count: number;
  rowId: string;
  selectedRowId: string;  
  clip: boolean; 
  openCourseSideBar: boolean;
  openFacilitySideBar: boolean;
  selectedCourse: ICourses | null;
  courseArray: {courseId: string, facilityId: string}[];
}