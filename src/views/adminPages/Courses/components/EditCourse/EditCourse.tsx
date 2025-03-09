/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CardContent, CircularProgress, Divider, Drawer, Grid, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import SwapIcon from '@material-ui/icons/ChangeCircle';

import { IFacility } from 'interfaces/facility.interfaces';
import { ICourse, ICoursePatch, IFetchCourseAndFacilityApiResponse, IPatchCourseApiResponse } from 'interfaces/course.interfaces';
import { ErrorMessage } from 'common/components';
import ConfirmDelete from '../ConfirmDelete';
import CourseService from 'services/course.service';
import RankCourse from '../RankCourse';
import CoursePhotos from '../CoursePhotos';
//import Ratings from '../Ratings';

class EditCourse extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',   
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    ready: false,
    blurErrors: [],    
    data: null,    
    id: this.props.id,
    name: this.props.name,
    facilityId: this.props.facilityId,
    facilityName: '',
    title: '',
    address1: '',    
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',  
    longitude: -1,
    latitude: -1,   
    description: '',
    synced: false,
    designer: '',
    tier: '',
    tags: '',
    priceLow: -1,
    priceHigh: -1,
    isFeatured: false,
    isFlagged: false,
    defaultPhoto: '',
    snackOpen: false,      
    courses: this.props.courses
  }

  private resetForm = () => {

    this.setState({
      action: 'loading',
      messageCode: 200,
      messageText: '',
      open: false,
      ready: false,
      blurErrors: [],
      data: null,
      id: '',
      name: '',
      facilityId: '',
      facilityName: '',
      title: '',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      phone: '',
      email: '',
      website: '',
      longitude: -1,
      latitude: -1,
      description: '',
      designer: '', 
      tier: '',
      tags: '',
      priceLow: -1,
      priceHigh: -1,
      isFeatured: false,
      isFlagged: false,
      defaultPhoto: '',
      synced: false,
      snackOpen: false,      
    });
    
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps: any) {       

    if (prevProps.open !== this.props.open) {
      this.setState({
        open: this.props.open,
        name: this.props.name,
        id: this.props.id,
        facilityId: this.props.facilityId,
        action: 'loading',
        ready: false
      });

      if (this.props.open === true) this.fetch(this.props.id);      
    }

    if (prevProps.courses !== this.props.courses) {
      this.setState({ courses: this.props.courses });     
    }    
  }

  private getDefaultPhotoName = (url: string | undefined) => {  
    if (url === undefined || url === null || url === '' || url === 'undefined') return '';
        
    const parts = url.split('/');
    return parts[parts.length - 1]; 
  }

  private fetch = (id: string) => {
    const client: CourseService = new CourseService();

    client.fetchIncFacility(id).then(async (response: IFetchCourseAndFacilityApiResponse) => {    

      if (response.success) {
        this.setState({
          data: response.value,  
          id: response.value?.course?.id ?? '',
          facilityId: response.value?.course?.facilityId ?? '',
          facilityName: response.value?.facility?.name ?? '',
          name: response.value?.course?.name ?? '',
          title: response.value?.course?.title ?? '',
          description: response.value?.course?.description ?? '',
          longitude: response.value?.course?.longitude ?? '',
          latitude: response.value?.course?.latitude?? '',         
          address1: response.value?.course?.address1 ?? '',         
          city: response.value?.course?.city ?? '',
          state: response.value?.course?.state ?? '',
          postalCode: response.value?.course?.postalCode ?? -1,    
          phone: response.value?.course?.phone ?? '',
          email: response.value?.course?.email ?? '',
          website: response.value?.course?.website ?? '',
          designer: response.value?.course?.designer ?? '', 
          tier: response.value?.course?.tier ?? '', 
          tags: response.value?.course?.tags ?? '', 
          priceLow: response.value?.course?.priceLow ?? null,
          priceHigh: response.value?.course?.priceHigh ?? null,
          isFeatured: response.value?.course?.isFeatured ?? false,
          isFlagged: response.value?.course?.isFlagged ?? false,
          defaultPhoto: this.getDefaultPhotoName(response.value?.course?.defaultPhoto ?? ''),                   
          synced: response.value?.course?.isSynced ?? false,  
          action: 'normal',
          ready: true       
        });
      }
    }).catch((error: Error) => {
      console.log(error);
    });
  }
  
  handleOnClose() {
    this.resetForm();
    this.props.onClose();
  }

  handleOnUpClick() {
    const index = this.state.courses.findIndex((item: ICourseItem) => item.courseId === this.state.id);
    const id = this.state.courses[index - 1].courseId;

    this.setState({ action: 'loading', ready: false, snackOpen: false, id: id });  
    this.fetch(id);
    
    const obj = { courseId: id, facilityId: this.state.facilityId };    
    this.props.onCourseChange(obj);
  }

  handleOnDownClick() {
    const index = this.state.courses.findIndex((item: ICourseItem) => item.courseId === this.state.id);
    const id = this.state.courses[index + 1].courseId;
    
    this.setState({ action: 'loading', ready: false, snackOpen: false, id: id });        
    this.fetch(id);

    const obj = { courseId: this.state.id, facilityId: this.state.facilityId };    
    this.props.onCourseChange(obj);
  }

  handleOnCloseAfterDelete() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  } 

  handleUpdateOnClick() {
    this.setState({ action: 'update' });   

    let body: ICoursePatch | null = { 
      id: this.state.id, 
      name: this.state.name, 
      title: this.state.title,
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      address1: this.state.address1, 
      city: this.state.city,
      postalCode: this.state.postalCode !== '' ? parseInt(this.state.postalCode) : null, 
      phone: this.state.phone,
      email: this.state.email,
      website: this.state.website,    
      isSynced: this.state.synced,   
      description: this.state.description,
      designer: this.state.designer,
      tier: this.state.tier,
      tags: this.state.tags,
      priceLow: this.state.priceLow,
      priceHigh: this.state.priceHigh,
      isFeatured: this.state.isFeatured,
      isFlagged: this.state.isFlagged
    } as ICoursePatch;     
    
    let client: CourseService | null = new CourseService();    

    client.patch(body).then(async (response: IPatchCourseApiResponse) => { 

      if (response.success) {       
        this.setState({ action: 'updated', message: '', snackOpen: true });
        this.props.onCourseUpdate(response.value);                 
      } else {
        this.setState({ action: 'failed', message: this.setErrorMessage(response.messageCode, response.message) });
      }

    }).catch((error: Error) => {
      this.setState({ action: 'failed', message: error.message });
    });
   
    client = null;
  }

  cancelDeleteCallback() {
    this.setState({ action: 'normal' });
  }

  private handleSnackClose = () => {
    this.setState({ snackOpen: false });       
  };  

  handleOnSwapToFacility() {
    const obj = { courseId: this.state.id, facilityId: this.state.facilityId };    
    this.props.onSwapCourseToFacility(obj);
  }

  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<IForm, keyof IForm>);
  }; 

  private handleSelectChanges = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const target = e.target as HTMLSelectElement;
    this.setState({ [target.name]: target.value } as unknown as Pick<IForm, keyof IForm>); 
  };

  private handleTrueFalseSelectChanges = (e: React.FormEvent<HTMLSelectElement>) => {
    e.preventDefault();   

    const target = e.target as HTMLSelectElement;
    this.setState({ [target.name]: target.value === 'true' ? true : false } as unknown as Pick<IForm, keyof IForm>);
  };

  private handleInputBlur = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    let blurErrors: string[] = this.state.blurErrors;

    if (blurErrors.includes(e.currentTarget.name)) blurErrors.splice(blurErrors.indexOf(e.currentTarget.name), 2);

    switch (e.currentTarget.name) {     
      case 'courseName':
        if (this.state.name.length < 8 && !blurErrors.includes(e.currentTarget.name)) blurErrors.push('name');
        break;
      default:
        break;
    }

    this.setState({ blurErrors: blurErrors });
  }

  private handleSyncChange = (e: React.MouseEvent<HTMLElement>, value: boolean) => {
    e.preventDefault();

    if (value) {
      this.setState({ 
        address1: this.state.data?.facility?.address1 ?? '',
        city: this.state.data?.facility?.city ?? '',
        state: this.state.data?.facility?.state ?? '',
        postalCode: this.state.data?.facility?.postalCode ?? '',
        phone: this.state.data?.facility?.phone ?? '',
        email: this.state.data?.facility?.email ?? '',
        website: this.state.data?.facility?.website ?? '',
        longitude: this.state.data?.facility?.longitude ?? -1,
        latitude: this.state.data?.facility?.latitude ?? -1,                
      });
    }

    this.setState({ synced: value });   
  }

  private handleTagDelete = (value: string) => { 
    alert(value);
  }


  private setHelperTextMessage = (field: string) => {
    switch (field) {
      case 'facilityName':
        return this.state.blurErrors.includes('facilityName') ? 'Facility Name is required' : ' ';
      case 'courseName':
        return this.state.blurErrors.includes('courseName') ? 'Course Name is required' : ' ';
      default:
        return ' ';
    }
  }

  private setErrorMessage = (messageCode: number, msg: string = '') => {
    switch (messageCode) {
      case 402:
        return 'Form values that were posted to the server are invalid.';
      case 406:
        return 'Email address already exists for another user. Please try with a different email address.';
      case 600:
        return 'There was an error on the server: ' + msg;
      default:
        return '';
    }
  }

  render() {

    return (
      <Drawer
        anchor='right'
        open={this.state.open}
        variant={'temporary'}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: { xs: '100%', sm: '75%' } } }}
      >  
        <Snackbar open={this.state.snackOpen} autoHideDuration={1000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={(e: any) => this.handleSnackClose()}>
          <Alert severity="success" sx={{ minWidth: '400px' }}>
            Course successfully updated!
          </Alert>
        </Snackbar>          

        <Grid container spacing={1}>              
          <Grid item xs={9}>
            <Box
              display={this.props.onSwapCourseToFacility === undefined ? 'none' : 'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '5px', paddingTop: '15px' }}            
            >              
              <Button variant="contained" size="small" color="primary" startIcon={<SwapIcon />} onClick={(e: any) => this.handleOnSwapToFacility()}>Open Facility</Button>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box
              display={this.props.courses.length === 0 ? 'none' : 'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '5px', paddingTop: '10px' }}              
            >
              <IconButton disabled={(this.state.courses[0] && this.state.courses[0].courseId === this.state.id) ? true : false} onClick={(e: any) => this.handleOnUpClick()}>
                <ArrowUpIcon fontSize="small" />
              </IconButton>         
            </Box>  
          </Grid>
          <Grid item xs={1}>
            <Box
              display={this.props.courses.length === 0 ? 'none' : 'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '10px', paddingTop: '10px' }}              
            >
              <IconButton disabled={this.state.courses[this.state.courses.length - 1] && this.state.courses[this.state.courses.length - 1].courseId === this.state.id ? true : false} onClick={(e: any) => this.handleOnDownClick()}>
                <ArrowDownIcon fontSize="small" />
              </IconButton>         
            </Box>  
          </Grid>
          <Grid item xs={1}>
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '10px', paddingTop: '10px' }}
              onClick={(e: any) => this.handleOnClose()}
            >
              <IconButton>
                <CloseIcon fontSize="small" />
              </IconButton>         
            </Box>  
          </Grid>
        </Grid>          

        <Box display={this.state.action === 'confirm-delete' ? 'block' : 'none'} sx={{ height: '100%', padding: 1 }} >
          <Box marginTop={20} justifyContent={'center'}>
            <ConfirmDelete id={this.state.id} editMode={'course'} theme={this.props.theme} text={this.state.name} onSuccess={this.handleOnCloseAfterDelete.bind(this)} onCancel={this.cancelDeleteCallback.bind(this)}></ConfirmDelete>
          </Box>
        </Box>      

        <Box display={this.state.action === 'confirm-delete' ? 'none' : 'block'} sx={{ height: '100%', padding: 1 }} >
        
          <Box marginBottom={1}>
            <Typography
              variant="h3"
              align={'center'}
              sx={{ fontWeight: 500, }}
            >
              {this.state.name}
            </Typography>
          </Box>

          <Box marginBottom={2}>
            <Typography
              variant="h5"
              align={'center'}
              sx={{ fontWeight: 100, }}
            >
              {this.state.facilityName}
            </Typography>
          </Box>

          <Divider variant="middle" />

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Box width={'100%'}>
              <ErrorMessage message={this.state.messageText} />
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} marginTop={4} marginBottom={2} textAlign={'center'}>
            <Box display={this.state.action !== 'loading' ? 'block' : 'none'} width={'100%'}>
              <ToggleButtonGroup
                color="primary"
                exclusive
                size="large"
                value={this.state.synced}
                sx={{ maxHeight: 56, justifyContent: 'center' }}
              >
                <ToggleButton value={true} onClick={(e: any) => this.handleSyncChange(e, true)}>Sync with Facility</ToggleButton>
                <ToggleButton value={false} onClick={(e: any) => this.handleSyncChange(e, false)}>Don't Sync</ToggleButton>                
              </ToggleButtonGroup>
            </Box>

            <Box display={this.state.action === 'loading' ? 'flex' : 'none'}>
              <CircularProgress color="primary" />
            </Box>  
          </Box>                  

          <Box component={CardContent} padding={4}>
            <Grid container spacing={1}>              
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <ErrorMessage message={this.setErrorMessage(this.state.messageCode, this.state.messageText)} />
                <form noValidate autoComplete="off">
                  <Box display="flex" flexDirection={'column'}>
                    <Grid container spacing={1}>                     
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Course Name *"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'name'}
                          value={this.state.name}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('name') ? true : false}
                          helperText={this.setHelperTextMessage('name')}                          
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Title for URL *"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'title'}
                          value={this.state.title}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('title') ? true : false}
                          helperText={this.setHelperTextMessage('title')}                          
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Address"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'address1'}
                          value={this.state.address1}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('address1') ? true : false}
                          helperText={this.setHelperTextMessage('address1')}      
                          disabled={this.state.synced}                   
                        />
                      </Grid>                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="City *"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'city'}
                          value={this.state.city}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('city') ? true : false}
                          helperText={this.setHelperTextMessage('city')}     
                          disabled={this.state.synced}                      
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Postal Code"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'postalCode'}
                          value={this.state.postalCode}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('postalCode') ? true : false}
                          helperText={this.setHelperTextMessage('postalCode')}   
                          disabled={this.state.synced}                       
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Latitude"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'latitude'}
                          value={this.state.latitude}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('latitude') ? true : false}
                          helperText={this.setHelperTextMessage('latitude')}
                          disabled={this.state.synced} 
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Longitude"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'longitude'}
                          value={this.state.longitude}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('longitude') ? true : false}
                          helperText={this.setHelperTextMessage('longitude')}
                          disabled={this.state.synced} 
                        />
                      </Grid>     
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Phone"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'phone'}
                          value={this.state.phone}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('phone') ? true : false}
                          helperText={this.setHelperTextMessage('phone')}   
                          disabled={this.state.synced}                       
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Email"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'email'}
                          value={this.state.email}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('email') ? true : false}
                          helperText={this.setHelperTextMessage('email')}    
                          disabled={this.state.synced}                      
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Website"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'website'}
                          value={this.state.website}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('website') ? true : false}
                          helperText={this.setHelperTextMessage('website')}   
                          disabled={this.state.synced}                      
                        />
                      </Grid>        
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Designer"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'designer'}
                          value={this.state.designer}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('designer') ? true : false}
                          helperText={this.setHelperTextMessage('designer')}                                                  
                        />
                      </Grid>    
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Price - Low"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'priceLow'}
                          value={this.state.priceLow}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('priceLow') ? true : false}
                          helperText={this.setHelperTextMessage('priceLow')}                                                  
                        />
                      </Grid>    
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Price - High"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'priceHigh'}
                          value={this.state.priceHigh}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('priceHigh') ? true : false}
                          helperText={this.setHelperTextMessage('priceHigh')}                                                  
                        />
                      </Grid>    
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Tags"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'tags'}
                          value={this.state.tags}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('tags') ? true : false}
                          helperText={this.setHelperTextMessage('tags')}                                                  
                        />
                      </Grid>    
                      <Grid item xs={12} md={6} sx={{ paddingBottom: '15px' }}>
                        <FormControl fullWidth variant="outlined" color="primary">
                          <InputLabel id="tier-label">Tier</InputLabel>
                          <Select                           
                            id='tier'
                            name={'tier'}
                            label={'Tier'}
                            labelId='tier-label'
                            defaultValue=''
                            fullWidth                                     
                            value={this.state.tier}                    
                            onChange={(e: any) => this.handleSelectChanges(e)}                         
                          >
                            <MenuItem value={''}></MenuItem>
                            <MenuItem value={'I'}>I</MenuItem>
                            <MenuItem value={'II'}>II</MenuItem>
                            <MenuItem value={'III'}>III</MenuItem>
                            <MenuItem value={'IV'}>IV</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>       
                      <Grid item xs={12} md={6} sx={{ paddingBottom: '20px' }}>
                        <FormControl fullWidth variant="outlined" color="primary">
                          <InputLabel id="year-label">Is Featured?</InputLabel>
                          <Select
                            labelId="isFeatured-label"
                            id="isFeatured"
                            value={this.state.isFeatured.toString()}
                            onChange={(e: any) => this.handleTrueFalseSelectChanges(e)}
                            label="Is Featured?"
                            name="isFeatured"
                            fullWidth={true}
                          >   
                            <MenuItem value={'false'}>
                              No
                            </MenuItem>              
                            <MenuItem value={'true'}>
                               Yes
                            </MenuItem>                           
                          </Select>
                        </FormControl>
                      </Grid>     
                      <Grid item xs={12} md={6} sx={{ paddingBottom: '20px' }}>
                        <FormControl fullWidth variant="outlined" color="primary">
                          <InputLabel id="year-label">Is Flagged?</InputLabel>
                          <Select
                            labelId="isFlagged-label"
                            id="isFlagged"
                            value={this.state.isFlagged.toString()}
                            onChange={(e: any) => this.handleTrueFalseSelectChanges(e)}
                            label="Is Flagged?"
                            name="isFlagged"
                            fullWidth={true}
                          >   
                            <MenuItem value={'false'}>
                              No
                            </MenuItem>              
                            <MenuItem value={'true'}>
                               Yes
                            </MenuItem>                           
                          </Select>
                        </FormControl>
                      </Grid>                                 
                      <Grid item xs={12} md={12} sx={{ marginTop: '15px' }}>
                        <TextField
                          type="text"
                          label="Description"
                          variant="outlined"
                          color="primary"
                          multiline
                          rows={10}
                          fullWidth
                          name={'description'}
                          value={this.state.description}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('description') ? true : false}
                          helperText={this.setHelperTextMessage('description')}                                                 
                        />
                      </Grid>  

                      {/* <Grid item xs={12} md={12} sx={{ paddingBottom: '20px' }}>
                        <Stack direction="row" spacing={1}>
                          <Chip label="primary" size="small" onDelete={(e: any) => this.handleTagDelete('temp')}/>
                          <Chip label="success" size="small" />
                        </Stack>
                      </Grid> */}

                      <Grid item xs={12} md={8}>                        
                        <Box
                          display={this.state.action === 'confirm-delete' ? 'none' : 'end'}
                          justifyContent={'end'}
                          sx={{ paddingBottom: '10px' }}                          
                        >
                          <Button variant="contained" startIcon={<SaveIcon />} sx={{ width: '100%' }} onClick={(e: any) => this.handleUpdateOnClick() }>
                            Save
                          </Button>             
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box
                          display={this.state.action === 'confirm-delete' ? 'none' : 'end'}
                          justifyContent={'end'}
                          sx={{ paddingBottom: '10px' }}
                          onClick={(e: any) => this.setState({ action: 'confirm-delete' })}
                        >
                          <Button variant="contained" startIcon={<DeleteIcon />} sx={{ width: '100%', background: this.props.theme.palette.grey[600] }}>
                            Delete
                          </Button>
                        </Box>
                      </Grid>                     
                    </Grid>
                  </Box>
                </form>
              </Grid>  
              <Grid item lg={1} md={12} sm={12} xs={12}></Grid>                       
              <Grid item lg={5} md={12} sm={12} xs={12} sx={{width: '100%'}} >                         
                <Box>
                  <RankCourse courseId={this.state.id} facilityId={this.state.facilityId} theme={this.props.theme} ready={this.state.ready} />
                </Box>                

                <Box>                  
                  <CoursePhotos courseId={this.state.id} facilityId={this.state.facilityId} theme={this.props.theme} ready={this.state.ready} default={this.state.defaultPhoto} />
                </Box>

                { /* <Ratings courseId={this.state.id} facilityId={this.state.facilityId} theme={this.props.theme} /> */ }                                     
              </Grid>

              
            </Grid>
          </Box>
        </Box>

      </Drawer>
    );

  }
}

export default EditCourse;

interface IProps {
  onClose: () => void; 
  onCourseUpdate: (course: ICoursePatch | null) => void;
  onCourseChange: (obj: any) => void;
  onSwapCourseToFacility: (obj: any | null) => void | undefined;
  theme: Theme;
  open: boolean;
  facilityId: string; 
  id: string ;
  name: string;
  courses: ICourseItem[] | [];
}

interface IForm {
  action: string, 
  messageText: string;
  messageCode: number;
  open: boolean;
  ready: boolean;
  blurErrors: string[],
  data: { facility: IFacility | null, course: ICourse | null } | null,
  facilityId: string;
  id: string;  
  name: string;
  facilityName: string;
  title: string;
  description: string;
  longitude: number | null;
  latitude: number | null; 
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string; 
  designer: string;
  tier: string;
  tags: string;
  priceHigh: number;
  priceLow: number;
  isFeatured: boolean;
  isFlagged: boolean;
  defaultPhoto: string;
  synced: boolean; 
  snackOpen: boolean;  
  courses: ICourseItem[] | [];
}

interface ICourseItem {
  courseId: string;
  facilityId: string;
}