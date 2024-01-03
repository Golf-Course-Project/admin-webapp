/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@material-ui/core';
import EditRowIcon from '@material-ui/icons/ModeEditOutlineOutlined';
import GolfCourseIcon from '@material-ui/icons/GolfCourse';
import PublicIcon from '@material-ui/icons/RadioButtonChecked';
import PrivateIcon from '@material-ui/icons/MotionPhotosOff';
import UnknownIcon from '@material-ui/icons/RadioButtonUnchecked';
import CopyIcon from '@material-ui/icons/ContentCopy';
import CheckIcon from '@material-ui/icons/Check';

import { IListCoursesApiResponse, ICourses, ICourseSearch, ICoursePatch } from 'interfaces/course.interfaces';
import CourseService from 'services/course.service';
import { SkeletonTable } from 'common/components';
import EditCourse from '../EditCourse';
import { CourseSearch } from 'common/classes/course.search';
import { IFacility } from 'interfaces/facility.interfaces';
import EditFacility from '../EditFacility';
import ErrorMessage from 'common/components/ErrorMessage';
import { green } from '@material-ui/core/colors';

class CourseList extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  readonly _pageSize: number = 25;

  state: ICourseListPage = {
    action: 'loading',
    errorMsg: '',     
    data: [],       
    rowId: '',
    selectedRowId: '',    
    clip: false,
    openCourseSideBar: false,
    openFacilitySideBar: false,
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
    
    this.setState({ openCourseSideBar: true, openFacilitySideBar: false, selectedCourse: row, selectedRowId: row.id, nextRowId: this.state.data[index + 1].id});      
       
    //console.log(`index id: ${this.state.data[index + 1].id}`);
    //console.log(`row id: ${row.id}`);
    //this.state.data[index].courseName = course.name;  
  };  

  private handleOpenFacilitySideBar = (row: ICourses) => {      
    this.setState({ openCourseSideBar: false, openFacilitySideBar: true, selectedCourse: row, selectedRowId: row.id});      
  };  

  private handleSidebarClose = () => {
    this.setState({ openCourseSideBar: false, openFacilitySideBar: false });       
  };

  private handleSnackClose = () => {
    this.setState({ openSideBar: false, snackAction: false, snackMsg: '' });       
  };  

  private handleCopyFacilityToClipBoard = (e: ICourses) => {
    navigator.clipboard.writeText(`${e.facilityName} in ${e.city} ${e.state}`);  
    this.setState({ clip: true });
  }

  private handleFacilityUpdate = (facility: IFacility | null) => {
    if (facility === null) return;
    this.setState({ openCourseSideBar: false, openFacilitySideBar: false, snackAction: true, snackMsg: `${facility.name} has been updated` });
            
    this.setState(data => {
      const newData = this.state.data.map(item => item.facilityId === facility.id
        ? { ...item, facilityName: facility.name, type: facility.type }
        : item
      );
      return { data: newData };
    });     
  };

  private handleCourseUpdate = (course: ICoursePatch | null) => {
    if (course === null) return;
    
    //this.setState({ 
    //  openCourseSideBar: false, 
    //  openFacilitySideBar: false, 
    //  snackAction: true, 
    //  snackMsg: `${course.name} has been updated`, 
    //});         

    // if save option is save and next, then move to the next row
    //if (saveOption === 'next') {
    //  const index = this.state.data.findIndex((item: ICourses) => item.id === course.id);
    //   this.setState({ rowId: this.state.data[index + 1].id, selectedRowId: this.state.data[index + 1].id });
    // }  
   
    this.setState(data => {
      const newData = this.state.data.map(item => item.id === course.id
        ? { ...item, courseName: course.name, address1: course.address1, city: course.city }
        : item
      );
      return { data: newData };
    });    
  };

  private load_courses = (body: ICourseSearch) => {
    const client: CourseService = new CourseService();  
    //const defaultBody: IListUsersRequest = { name: null, email: null, role: null, status: -1, isDeleted: false }; 
    //let body: IListUsersRequest = this.props.searchCriteria != null ? this.props.searchCriteria : defaultBody;   

    client.search(body).then(async (response: IListCoursesApiResponse) => {        

      if (response.messageCode !== 200) {
        this.setState({ errorMsg: response.message });
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
          errorMsg: '',
          action: 'normal'
        }); 
       
        const newArray = response.value.map(item => ({
          id: item.id,
          facilityId: item.facilityId
        }));

        localStorage.setItem('course_search_results_array', JSON.stringify(newArray));        
      }
    }).catch((error: Error) => {      
      console.log(error);
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
                        {row.facilityName} 
                        <CopyIcon sx={{ fontSize: 15, display: (this.state.rowId === row.id && ! this.state.clip) ? 'inline' : 'none', marginLeft: '10px' }} color="disabled" onClick={(e: any) => this.handleCopyFacilityToClipBoard(row)} />
                        <CheckIcon sx={{ fontSize: 15, display: (this.state.rowId === row.id && this.state.clip) ? 'inline' : 'none', marginLeft: '10px', color: green[700] }} />
                      </TableCell>
                      <TableCell align="left">{row.courseName}</TableCell>     
                      <TableCell align="left">{row.address1}</TableCell>    
                      <TableCell align="left">{row.city}</TableCell>              
                      <TableCell align="center" sx={{ width: '80px' }}>
                        <div style={{ display: this.state.rowId === row.id ? 'flex' : 'none'}}>
                          <IconButton aria-label="edit facility" onClick={(e:any) => this.handleOpenFacilitySideBar(row)}>
                            <GolfCourseIcon />
                          </IconButton>                             
                        </div>
                      </TableCell>  
                      <TableCell align="center" sx={{ width: '80px'}}>
                        <div style={{ display: this.state.rowId === row.id ? 'flex' : 'none'}}>
                          <IconButton aria-label="edit course" onClick={(e:any) => this.handleOpenCourseSideBar(row)}>
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
          <SkeletonTable rows={10} columns={6} display={this.state.action === 'loading' ? true : false}></SkeletonTable>                 
        </Box>   

        <EditCourse
          theme={this.props.theme}
          open={this.state.openCourseSideBar}
          facilityId={this.state.selectedCourse?.facilityId}
          facilityName={this.state.selectedCourse?.facilityName}
          id={this.state.selectedCourse?.id}
          name={this.state.selectedCourse?.courseName}         
          onClose={this.handleSidebarClose}
          onCourseUpdate={(e: any) => this.handleCourseUpdate(e)}          
          //onFacilityUpdate={(e: any) => this.handleFacilityUpdate(e)}
        ></EditCourse>

        <EditFacility
          theme={this.props.theme}
          open={this.state.openFacilitySideBar}
          id={this.state.selectedCourse?.facilityId}          
          onClose={this.handleSidebarClose}         
          onFacilityUpdate={(e: any) => this.handleFacilityUpdate(e)}
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

interface ICourseListPage {
  action: string,
  errorMsg: string;  
  data: ICourses[]; 
  rowId: string;
  selectedRowId: string;  
  clip: boolean; 
  openCourseSideBar: boolean;
  openFacilitySideBar: boolean;
  selectedCourse: ICourses | null;
}