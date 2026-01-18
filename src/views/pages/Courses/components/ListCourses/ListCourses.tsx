/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Container, TextField, Breadcrumbs, Typography, Skeleton, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import RankingIcon from '@material-ui/icons/Bookmark';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LockIcon from '@material-ui/icons/Lock';
import UnknownIcon from '@material-ui/icons/NotListedLocation';
import EditIcon from '@material-ui/icons/Edit';
import ReviewIcon from '@material-ui/icons/Comment';
import SearchIcon from '@material-ui/icons/Search';
import FeaturedIcon from '@material-ui/icons/Star';
import FlaggedIcon from '@material-ui/icons/Flag';

import Illustration from 'svg/illustrations/Globe';
import NotFoundIllustration from 'svg/illustrations/NotFound';
import EditCourse from '../EditCourse';
import EditFacility from '../EditFacility';
import EditReview from '../EditReview';

import { SkeletonTable } from 'common/components';

import { ICourse, ICourseSearchCriteriaBody, ICourseListWithRanking, ICourseListWithRankingApiResponse, ICourseSearchCriteriaProps } from 'interfaces/course.interfaces';
import { IOptions, IRankingPost2 } from 'interfaces/rankings.interfaces';
import { IApiResponse } from 'interfaces/api-response.interface';
import RankingService from 'services/ranking.service';
import CourseService from 'services/course.service';
import ErrorMessage from 'common/components/ErrorMessage';
import { RefValueData } from 'data/refvalue.data';
import { IFacility } from 'interfaces/facility.interfaces';


class ListCourses extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  readonly _pageSize: number = 25;

  state: IForm = {
    action: 'empty',
    errorMsg: '',   
    data: [],
    count: 0,   
    rowId: '',
    selectedRowId: '', 
    anchorEl: null,  
    menuOpen: false,   
    openCourseSideBar: false,   
    openFacilitySideBar: false,
    openReviewSideBar: false,
    selectedCourse: null,
    textboxValue: '', 
    isTextboxInEditMode: false,
    isTextboxDirty: false,
    year: 2024,
    sourceRefValueId: -1,
    source: '',
    nameRefValueId: -1,
    name: ''
  }

  componentDidMount() {
       
  }

  componentDidUpdate(prevProps: any) {    
    
    if (prevProps.options !== this.props.options && this.props.options !== null) {
      this.setState({
        year: this.props.options.year,
        sourceRefValueId: this.props.options.sourceRefValueId,
        nameRefValueId: this.props.options.nameRefValueId,
        source: RefValueData.sources.find((item: any) => item.id === this.props.options?.sourceRefValueId)?.text,
        name: RefValueData.names.find((item: any) => item.id === this.props.options?.nameRefValueId)?.text,
      });
    }
    
    if (prevProps.searchCriteria !== this.props.searchCriteria && this.props.searchCriteria !== null) {
      this.setState({ action: 'loading' });

      const body: ICourseSearchCriteriaBody = {
        state: this.props.searchCriteria.state,
        text: this.props.searchCriteria.text,
        name: this.props.searchCriteria.name,
        city: this.props.searchCriteria.city,
        isRanked: this.props.searchCriteria.isRanked,   
        isFlagged: this.props.searchCriteria.isFlagged, 
        isFeatured: this.props.searchCriteria.isFeatured,  
        tier: this.props.searchCriteria.tier,
        year: this.props.options !== null ? this.props.options.year : 2024,
        sourceRefValueId: this.props.options !== null ? this.props.options.sourceRefValueId : 100,
        nameRefValueId: this.props.options !== null ? this.props.options.nameRefValueId : 201,
      };

      this.search(body);
    }    
  } 

  handleInputChange = (e: any) => {
    const _textboxvalue: string = this.state.textboxValue;
    this.setState({ isTextboxDirty: e.target.value !== this.state.textboxValue, textboxValue: e.target.value !== this.state.textboxValue ? e.target.value : _textboxvalue});
  }

  private handleCellClick = (id: string, value: string) => {
    this.setState({ selectedRowId: id, textboxValue: value, isTextboxInEditMode: true, isTextboxDirty: false});
  }

  private handleRankingValueOnBlur = () => {   
    if (this.state.isTextboxDirty) {
      const data: IRankingPost2 = {
        courseId: this.state.selectedRowId,
        sourceRefValueId: this.state.sourceRefValueId,
        nameRefValueId: this.state.nameRefValueId,
        year: this.state.year,
        value: parseInt(this.state.textboxValue)
      };     

      this.createUpdate(data);    
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

  private handleOpenCourseSideBar = (row: ICourseListWithRanking) => {           
    const index = this.state.data.findIndex((item: ICourseListWithRanking) => item.courseId === row.courseId);    
    const nextRowId = (index + 1) < this.state.count ? this.state.data[index + 1].courseId : this.state.data[index].courseId;  

    this.setState({ openCourseSideBar: true, 
      openFacilitySideBar: false, 
      selectedCourse: row, selectedRowId: 
      row.courseId, 
      nextRowId: nextRowId, 
      isEditingTextbox: false });      
  };  
  
  private handleOpenFacilitySideBar = (row: ICourseListWithRanking) => {      
    this.setState({ openCourseSideBar: false, openFacilitySideBar: true, selectedCourse: row, selectedRowId: row.courseId, isEditingTextbox: false});      
  };  

  private handleOpenReviewSideBar = (row: ICourseListWithRanking) => {
    this.setState({ openCourseSideBar: false, openFacilitySideBar: false, openReviewSideBar: true, selectedCourse: row, selectedRowId: row.courseId, isEditingTextbox: false});
  }

  private handleSidebarClose = () => {
    this.setState({ openCourseSideBar: false, openFacilitySideBar: false, openReviewSideBar: false});       
  }; 
  
  private handleCourseUpdate = (course: ICourse | null) => {
    if (course === null) return;   
   
    this.setState(data => {
      const newData = this.state.data.map(item => item.courseId === course.id
        ? { ...item, courseName: course.name, city: course.city, tier: course.tier }
        : item
      );
      return { data: newData };
    });    
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

  private handleMenuOpenClick = (courseId: string, e: any) => { 
    this.setState({ anchorEl: e.currentTarget, menuOpen: true, selectedRowId: courseId });
  }

  private handleMenuCloseClick = (courseId: string, e: any) => { 
    this.setState({ anchorEl: null, menuOpen: false, selectedRowId: null });
  }

  private handleGoogleSearch = () => {
    const row = this.state.data.find(item => item.courseId === this.state.selectedRowId);
    if (row && row.courseName && row.state) {
      const searchQuery = encodeURIComponent(`${row.courseName} ${row.state} golf`);
      const url = `https://www.google.com/search?q=${searchQuery}`;
      window.open(url, '_blank');
    }
    this.setState({ anchorEl: null, menuOpen: false, selectedRowId: null });
  };

  private handleSwapFacilityToCourse = (obj: {courseId: string, facilityId: string}) => {   
    this.setState({ rowId: obj.courseId, selectedRowId: obj.courseId, openCourseSideBar: true, openFacilitySideBar: false });
  };

  private handleSwapCourseToFacility = (obj: {courseId: string, faclityId: string}) => {   
    this.setState({ openCourseSideBar: false, openFacilitySideBar: true, rowId: obj.courseId, selectedRowId: obj.courseId });
  };

  private handleCourseCreated = (facilityName: string, state: string) => {
    // Close the facility panel
    this.setState({ openFacilitySideBar: false });
    
    // Update URL with search parameters
    const searchParams = new URLSearchParams();
    searchParams.set('searchText', `name:${facilityName}`);
    searchParams.set('state', state);
    
    // Update the browser URL
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, '', newUrl);
    
    // Trigger the search
    window.location.href = newUrl;
  };

  private search = (body: ICourseSearchCriteriaBody) => {
    const client: CourseService = new CourseService();  
    
    client.searchWithRanking(body).then(async (response: ICourseListWithRankingApiResponse) => {        

      if (response.messageCode !== 200) {
        // Check if it's a "no results" case vs actual error
        if (response.message && response.message.toLowerCase().includes('no results')) {
          this.setState({
            paging: {
              currentPage: 1,
              spanStart: 1,
              spanEnd: this._pageSize
            },
            pageCount: 0,
            data: [],
            count: 0,
            selectedRowId: '',     
            errorMsg: '',
            action: 'normal'         
          });
          return;
        }
        this.setState({ errorMsg: response.message, action: 'error', selectedRowId: ''});        
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

  private createUpdate = (body: IRankingPost2) => {
    const client: RankingService = new RankingService(); 

    client.createUpdate(body).then(async (response: IApiResponse) => {        

      if (response.messageCode !== 200) {
        this.setState({ errorMsg: response.message, action: 'error', selectedRowId: ''});        
        return;
      }

      if (response.success) {  
        this.setState({ isTextboxInEditMode: false, isTextboxDirty: false });

        this.setState(data => {
          const newData = this.state.data.map(item => item.courseId === body.courseId
            ? { ...item, rankingValue: body.value }
            : item
          )
            .filter(item => item.rankingValue !== 0)
            .sort((a, b) => a.rankingValue - b.rankingValue);

          return { data: newData };
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

        <Box display="flex" justifyContent="center" alignItems="center" sx={this.state.action === 'normal' && this.state.count === 0 ? { display: 'block' } : { display: 'none' }}>
          <Container>
            <Box 
              height={'100%'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              marginTop={8}
            >
              <Box
                height={'100%'}
                width={'100%'}
                maxWidth={500}
              >
                <NotFoundIllustration width={'100%'} height={'100%'} />
              </Box>
              <Box marginLeft={2}>
                <Typography
                  variant="h6"
                  component="p"
                  color="textSecondary"
                  align="left"
                >
                  Oops! Looks like there are no results for your search.
                  <br />
                  Try something else.
                </Typography>
              </Box>
            </Box>
          </Container>         
        </Box>

        <Box sx={this.state.action === 'normal' && this.state.count > 0 ? { display: 'block' } : { display: 'none' }}>          
          <Box marginBottom={2} paddingLeft={1}>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography color="disabled">{this.state.source}</Typography>
              <Typography color="disabled">{this.state.name}</Typography>
              <Typography color="disabled">{this.state.year}</Typography>
            </Breadcrumbs>
          </Box>
          
          <Box marginBottom={4} sx={{ display: 'flex' }}>            
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>   
                    <TableCell align="center" sx={{ width: '60px'}}>&nbsp;</TableCell>
                    <TableCell align="left">Course</TableCell>        
                    <TableCell align="center" sx={{ width: '15px'}}>&nbsp;</TableCell>   
                    <TableCell align="center" sx={{ width: '15px'}}>&nbsp;</TableCell>
                    <TableCell align="center" sx={{ width: '15px'}}>&nbsp;</TableCell> 
                    <TableCell align="center" sx={{ width: '15px'}}>&nbsp;</TableCell> 
                    <TableCell align="center" sx={{ width: '15px'}}>&nbsp;</TableCell> 
                    <TableCell align="center" sx={{ width: '50px'}}>&nbsp;</TableCell> 
                    <TableCell align="left">City</TableCell>  
                    <TableCell align="center">State</TableCell>   
                    <TableCell align="center" sx={{ width: '100px' }}>Ranking</TableCell>  
                    <TableCell align="center" sx={{ width: '100px' }}>Tier</TableCell>
                    <TableCell align="left">&nbsp;</TableCell>                                                                                         
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.map((row) => (                    
                    <TableRow
                      key={row.courseId}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: '80px'}}
                      hover
                      onMouseEnter={(e: any) => this.handleMouseEnter(e, row.courseId) }
                      onMouseLeave={(e: any) => this.handleMouseLeave(e, row.courseId) }
                      selected={this.state.selectedRowId === row.courseId ? true : false}                                      
                    >                         
                      <TableCell align="center">
                        <IconButton
                          aria-label="more"
                          id="long-button"
                          aria-controls={this.state.menuOpen && this.state.selectedRowId === row.courseId ? 'basic-menu' : undefined}
                          aria-expanded={this.state.menuOpen && this.state.selectedRowId === row.courseId ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={(e:any) => this.handleMenuOpenClick(row.courseId, e)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id="basic-menu"
                          anchorEl={this.state.anchorEl}
                          open={this.state.menuOpen && this.state.selectedRowId === row.courseId }
                          onClose={(e:any) => this.handleMenuCloseClick(row.courseId, e)}
                          MenuListProps={{ 'aria-labelledby': 'basic-button', }}
                        >
                          <MenuItem onClick={(e:any) => this.handleOpenReviewSideBar(row)}>
                            <ListItemIcon>
                              <ReviewIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={row.isReviewed ? 'Edit Review' : 'Create Review'} />                         
                          </MenuItem>
                          <MenuItem onClick={(e:any) => this.handleOpenFacilitySideBar(row)}>
                            <ListItemIcon>
                              <EditIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={`Edit ${row.facilityName}`} />                                
                          </MenuItem>
                          <MenuItem onClick={this.handleGoogleSearch}>
                            <ListItemIcon>
                              <SearchIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Google" />                                
                          </MenuItem>                         
                        </Menu>                        
                      </TableCell>  

                      <TableCell align="left">
                        <Link component="button" onClick={(e:any) => this.handleOpenCourseSideBar(row)} sx={{ textAlign: 'left' }}>
                          {row.courseName === row.facilityName ? row.courseName : `${row.courseName} @ ${row.facilityName}`}
                        </Link>                        
                      </TableCell>                        
                        
                      <TableCell align="center">                                                 
                        { row.type === 2  ? <LockIcon color="disabled" fontSize="small" /> : null } 
                        { row.type === -1  ? <UnknownIcon color="disabled" fontSize="small" /> : null }  
                      </TableCell>  

                      <TableCell align="center">  
                        <Tooltip title={'Flagged (' + row.isFlagged + ')'}>
                          <FlaggedIcon color={row.isFlagged ? 'error' : 'disabled'} fontSize="small" />  
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center">  
                        <Tooltip title={'Ranking (' + row.rankingValue + ')'}>
                          <RankingIcon color={row.rankingValue > 0 ? 'primary' : 'disabled'} fontSize="small" />  
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center">    
                        <Tooltip title={'Reviewed'}>                        
                          <ReviewIcon color={row.isReviewed ? 'primary' : 'disabled'} fontSize="small" />
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center">  
                        <Tooltip title={'Featured'}>
                          <FeaturedIcon color={row.isFeatured ? 'secondary' : 'disabled'} fontSize="small" />                       
                        </Tooltip>
                      </TableCell>  

                      <TableCell align="left">&nbsp;</TableCell>  

                      <TableCell align="left">{row.city}</TableCell>   

                      <TableCell align="center">{row.state}</TableCell>  

                      <TableCell align="center" onClick={(e:any) => this.handleCellClick(row.courseId, row.rankingValue > 0 ? row.rankingValue.toString() : '')}>
                        {this.state.selectedRowId === row.courseId && this.state.isTextboxInEditMode ? (
                          <TextField
                            autoFocus
                            size="small"
                            value={this.state.textboxValue}
                            id={row.courseId}
                            name={row.courseId}
                            onChange={(e:any) => this.handleInputChange(e)}   
                            onBlur={(e:any) => this.handleRankingValueOnBlur()}                         
                          />
                        ) : (
                          row.rankingValue
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {row.tier}  
                      </TableCell>
                      <TableCell align="left">&nbsp;</TableCell>                                                                               
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>          
        </Box>

        <Box display={this.state.action === 'loading' ? 'block' : 'none'}>  
          <Box marginBottom={2} paddingLeft={1}>
            <Skeleton variant='text' width={300} height={30}></Skeleton>
          </Box>

          <SkeletonTable rows={10} columns={6} display={this.state.action === 'loading' ? true : false}></SkeletonTable>                 
        </Box>    

        <EditCourse
          theme={this.props.theme}
          open={this.state.openCourseSideBar}
          facilityId={this.state.selectedCourse?.facilityId}          
          id={this.state.selectedCourse?.courseId}
          name={this.state.selectedCourse?.courseName}         
          onClose={this.handleSidebarClose}
          onCourseUpdate={(e: any) => this.handleCourseUpdate(e)}    
          onSwapCourseToFacility={(e: any) => this.handleSwapCourseToFacility(e)}                              
          courses={[]}         
        >
        </EditCourse>   

        <EditFacility
          theme={this.props.theme}
          open={this.state.openFacilitySideBar}
          facilityId={this.state.selectedCourse?.facilityId}          
          onClose={this.handleSidebarClose}         
          onFacilityUpdate={(e: any) => this.handleFacilityUpdate(e)} 
          onSwapFacilityToCourse={(e: any) => this.handleSwapFacilityToCourse(e)}
          onCourseCreated={(facilityName: string, state: string) => this.handleCourseCreated(facilityName, state)}                
          courses={[]}  
        ></EditFacility>    

        <EditReview
          theme={this.props.theme}
          open={this.state.openReviewSideBar}
          courseId={this.state.selectedCourse?.courseId} 
          courseName={this.state.selectedCourse?.courseName}  
          facilityName={this.state.selectedCourse?.facilityName}
          onClose={this.handleSidebarClose}   
        ></EditReview>     
      </Box>
    );
  }
}

export default ListCourses;

interface IProps {
  callback: () => void;
  theme: Theme;
  searchCriteria: ICourseSearchCriteriaProps | null;
  options: IOptions | null;
}

interface IForm {
  action: string,
  errorMsg: string;  
  data: ICourseListWithRanking[]; 
  count: number;
  rowId: string;
  selectedRowId: string;  
  anchorEl: any;   
  menuOpen: boolean;
  openCourseSideBar: boolean; 
  openFacilitySideBar: boolean; 
  openReviewSideBar: boolean;
  selectedCourse: ICourseListWithRanking | null; 
  textboxValue: any;
  isTextboxInEditMode: boolean;
  isTextboxDirty: boolean
  year: number;
  sourceRefValueId: number;
  source: string;
  nameRefValueId: number;
  name: string;
}