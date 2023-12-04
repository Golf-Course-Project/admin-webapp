/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CardContent, Divider, Drawer, Grid, IconButton, TextField, ToggleButton, ToggleButtonGroup, Typography, CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { IFacility, IFetchFacilityResponse } from 'interfaces/facility.interfaces';
import { FacilityService } from 'services/facility.service';
import { ErrorMessage } from 'common/components';
import ConfirmDelete from '../ConfirmDelete';

class EditCourse extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',
    editMode: 'facility',
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    blurErrors: [],    
    data: null,    
    facilityId:  this.props.facilityId,
    courseId: this.props.courseId,
    courseName: this.props.courseName,
    facilityName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    longitude: -1,
    latitude: -1,
    phone: '',
    email: '',
    website: '',
    instagram: '',
    description: ''
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.open !== this.props.open) {
      this.setState({
        open: this.props.open,
        courseName: this.props.courseName,
        facilityId: this.props.facilityId,
        courseId: this.props.courseId,
        action: 'loading'
      });

      this.fetch(this.props.facilityId);
    }
  }


  private fetch = (id: string) => {
    const client: FacilityService = new FacilityService();

    client.fetch(id).then(async (response: IFetchFacilityResponse) => {    

      if (response.success) {
        this.setState({
          data: response.value,
          facilityName: response.value.name ?? '',
          address1: response.value.address1 ?? '',
          address2: response.value.address2 ?? '',
          city: response.value.city ?? '',
          state: response.value.state ?? '',
          postalCode: response.value.postalCode ?? '',
          longitude: response.value.longitude ?? '',
          latitude: response.value.latitude?? '',
          phone: response.value.phone ?? '',
          email: response.value?.email ?? '',
          website: response.value?.website ?? '',
          instagram: response.value?.instagram ?? '',
          action: 'normal'
        });
      }

    }).catch((error: Error) => {
      console.log(error);
    });
  }

  private handleEditModeChange = (e: React.MouseEvent<HTMLElement>, x: string) => {
    e.preventDefault();

    this.setState({ editMode: x });
  }

  handleOnClose() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  }

  handleOnCloseAfterDelete() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  }

  cancelDeleteCallback() {
    this.setState({ action: 'normal' });
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

  private handleInputBlur = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    let blurErrors: string[] = this.state.blurErrors;

    if (blurErrors.includes(e.currentTarget.name)) blurErrors.splice(blurErrors.indexOf(e.currentTarget.name), 2);

    switch (e.currentTarget.name) {
      case 'facilityName':
        if (this.state.facilityName.length < 8 && !blurErrors.includes(e.currentTarget.name)) blurErrors.push('facilityName');
        break;
      case 'courseName':
        if (this.state.courseName.length < 8 && !blurErrors.includes(e.currentTarget.name)) blurErrors.push('courseName');
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
            <ConfirmDelete id={this.state.editMode === 'course' ? this.state.courseId : this.state.facilityId} editMode={this.state.editMode} theme={this.props.theme} text={this.state.editMode === 'course' ? this.state.courseName : this.state.facilityName} onSuccess={this.handleOnCloseAfterDelete.bind(this)} onCancel={this.cancelDeleteCallback.bind(this)}></ConfirmDelete>
          </Box>
        </Box>      

        <Box display={this.state.action === 'confirm-delete' ? 'none' : 'block'} sx={{ height: '100%', padding: 1 }} >
          <Box marginBottom={1}>
            <Typography
              variant="h3"
              align={'center'}
              sx={{ fontWeight: 500, }}
            >
              {this.state.courseName}
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
          <Box component={CardContent} padding={4}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box marginBottom={4} textAlign={'center'} display={this.state.action === 'normal' ? 'block' : 'none'}>
                  <ToggleButtonGroup
                    color="primary"
                    exclusive
                    size="large"
                    value={this.state.editMode}
                    sx={{ maxHeight: 56 }}
                  >
                    <ToggleButton value="facility" onClick={(e: any) => this.handleEditModeChange(e, 'facility')}>Facility</ToggleButton>
                    <ToggleButton value="course" onClick={(e: any) => this.handleEditModeChange(e, 'course')}>Course</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Box marginBottom={4} textAlign={'center'} display={this.state.action === 'loading' ? 'block' : 'none'}>
                  <CircularProgress />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <ErrorMessage message={this.setErrorMessage(this.state.messageCode, this.state.messageText)} />
                <form noValidate autoComplete="off">
                  <Box display="flex" flexDirection={'column'}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Facility Name *"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'facilityName'}
                          value={this.state.facilityName}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('facilityName') ? true : false}
                          helperText={this.setHelperTextMessage('facilityName')}
                          disabled={this.state.editMode === 'facility' ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Course Name *"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'courseName'}
                          value={this.state.courseName}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('courseName') ? true : false}
                          helperText={this.setHelperTextMessage('courseName')}
                          disabled={this.state.editMode === 'course' ? false : true}
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
                          error={this.state.blurErrors.includes('address') ? true : false}
                          helperText={this.setHelperTextMessage('address')}
                          disabled={this.state.editMode === 'facility' ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Address 2"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'address2'}
                          value={this.state.address2}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('address2') ? true : false}
                          helperText={this.setHelperTextMessage('address2')}
                          disabled={this.state.editMode === 'facility' ? false : true}
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
                          disabled={this.state.editMode === 'facility' ? false : true}
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
                          disabled={this.state.editMode === 'facility' ? false : true}
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
                          disabled={this.state.editMode === 'facility' ? false : true}
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
                          disabled={this.state.editMode === 'facility' ? false : true}
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
                          disabled={this.state.editMode === 'facility' ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Instagram"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'instagram'}
                          value={this.state.instagram}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('instagram') ? true : false}
                          helperText={this.setHelperTextMessage('instagram')}
                          disabled={this.state.editMode === 'facility' ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} md={8}>
                        <Box
                          display={this.state.action === 'confirm-delete' ? 'none' : 'end'}
                          justifyContent={'end'}
                          sx={{ paddingBottom: '10px' }}
                          onClick={(e: any) => this.setState({ action: 'update' })}
                        >
                          <Button variant="contained" startIcon={<SaveIcon />} sx={{ width: '100%' }}>
                            Update {this.state.editMode === 'facility' ? 'Facility' : 'Course'}
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
                            Delete {this.state.editMode === 'facility' ? 'Facility' : 'Course'}
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
  theme: Theme;
  open: boolean;
  facilityId: string;
  courseId: string ;
  courseName: string;  
}

interface IForm {
  action: string,
  editMode: string,
  messageText: string;
  messageCode: number;
  open: boolean;
  blurErrors: string[],
  data: IFacility | null;
  facilityId: string;
  courseId: string;  
  courseName: string;
  facilityName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  longitude: number | null;
  latitude: number | null;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  description: string;
}