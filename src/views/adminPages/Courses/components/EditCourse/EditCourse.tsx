/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CardContent, Divider, Drawer, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { IFacility } from 'interfaces/facility.interfaces';
import { ICoursePatch, IFetchCourseApiResponse, IPatchCourseApiResponse } from 'interfaces/course.interfaces';
import { ErrorMessage } from 'common/components';
import ConfirmDelete from '../ConfirmDelete';
import CourseService from 'services/course.service';

class EditCourse extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',   
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    blurErrors: [],    
    data: null,    
    id: this.props.id,
    name: this.props.name,
    facilityId: this.props.facilityId,
    facilityName: this.props.facilityName,
    address1: '',    
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    email: '',
    website: '',  
    longitude: -1,
    latitude: -1,   
    description: ''
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
        facilityName: this.props.facilityName,        
        action: 'loading'
      });

      this.fetch(this.props.id);
    }
  }

  private fetch = (id: string) => {
    const client: CourseService = new CourseService();

    client.fetch(id).then(async (response: IFetchCourseApiResponse) => {    

      if (response.success) {
        this.setState({
          data: response.value,  
          facilityId: response.value?.facilityId ?? '',
          description: response.value?.description ?? '',
          longitude: response.value?.longitude ?? '',
          latitude: response.value?.latitude?? '',         
          address1: response.value?.address1 ?? '',         
          city: response.value?.city ?? '',
          state: response.value?.state ?? '',
          postalCode: response.value?.postalCode ?? -1,    
          phone: response.value?.phone ?? '',
          email: response.value?.email ?? '',
          website: response.value?.website ?? '',                   
        });
      }

    }).catch((error: Error) => {
      console.log(error);
    });
  }
  
  handleOnClose() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  }

  handleOnCloseAfterDelete() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  } 

  handleUpdateCourseOnClick() {
    this.setState({ action: 'update' });

    let body: ICoursePatch | null = { 
      id: this.state.id, 
      name: this.state.name, 
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      address1: this.state.address1, 
      city: this.state.city,
      postalCode: this.state.postalCode !== '' ? parseInt(this.state.postalCode) : null, 
      phone: this.state.phone,
      email: this.state.email,
      website: this.state.website   
    } as ICoursePatch;   
    let client: CourseService | null = new CourseService();    

    client.patch(body).then(async (response: IPatchCourseApiResponse) => {   
      if (response.success) {       
        this.setState({ action: 'updated', message: '' });
        this.props.onCourseUpdate(body);
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

  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<IForm, keyof IForm>);
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
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: { xs: '100%', sm: 900 } } }}
      >       
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

          <Box component={CardContent} padding={4}>
            <Grid container spacing={1}>              
              <Grid item xs={12}>
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
                        />
                      </Grid>                       

                      <Grid item xs={12} md={8}>
                        <Box
                          display={this.state.action === 'confirm-delete' ? 'none' : 'end'}
                          justifyContent={'end'}
                          sx={{ paddingBottom: '10px' }}
                          onClick={(e: any) => this.handleUpdateCourseOnClick() }
                        >
                          <Button variant="contained" startIcon={<SaveIcon />} sx={this.state.action !== 'update' ? { width: '100%', display: 'flex' } : { width: '100%', display: 'none' }}>
                            Update
                          </Button>                          

                          <Button variant="contained" startIcon={<SaveIcon />} sx={this.state.action === 'update' ? { width: '100%', display: 'flex' } : { width: '100%', display: 'none' }} disabled={true}>
                            Updating ...
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
  theme: Theme;
  open: boolean;
  facilityId: string;
  facilityName: string;
  id: string ;
  name: string;  
}

interface IForm {
  action: string, 
  messageText: string;
  messageCode: number;
  open: boolean;
  blurErrors: string[],
  data: IFacility | null;
  facilityId: string;
  id: string;  
  name: string;
  facilityName: string;
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
}