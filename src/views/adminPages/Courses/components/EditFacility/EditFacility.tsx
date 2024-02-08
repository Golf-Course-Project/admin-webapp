/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Alert, Button, CardContent, Divider, Drawer, Grid, IconButton, Snackbar, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import CopyIcon from '@material-ui/icons/ContentCopy';
import CheckIcon from '@material-ui/icons/Check';
import SwapIcon from '@material-ui/icons/ChangeCircle';
import { green } from '@material-ui/core/colors';

import { IFacility, IFetchFacilityApiResponse, IPatchFacilityApiResponse } from 'interfaces/facility.interfaces';
import { FacilityService } from 'services/facility.service';
import { ErrorMessage } from 'common/components';
import ConfirmDelete from '../ConfirmDelete';


class EditFacility extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',    
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    blurErrors: [],    
    data: null,    
    facilityId:  this.props.facilityId,
    courseId: this.props.courseId,
    name: '',
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
    facebook: '',
    description: '',
    type: -1,
    snackOpen: false,
    clip: false,
    courses: this.props.courses
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.open !== this.props.open) {
      this.setState({
        open: this.props.open,        
        facilityId: this.props.facilityId,        
        action: 'loading'
      });

      this.fetch(this.props.facilityId);
    }

    if (prevProps.courses !== this.props.courses) {
      this.setState({ courses: this.props.courses });     
    }    
  }

  private resetForm = () => {

    this.setState({
      action: 'loading',    
      messageCode: 200,
      messageText: '',
      open: this.props.open,
      blurErrors: [],    
      data: null,    
      facilityId:  this.props.facilityId,
      courseId: this.props.courseId,
      name: '',
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
      facebook: '',
      description: '',
      type: -1,
      snackOpen: false,
      clip: false,         
    });
    
  }

  private fetch = (facilityId: string) => {
    const client: FacilityService = new FacilityService();

    client.fetch(facilityId).then(async (response: IFetchFacilityApiResponse) => {      

      if (response.success) {
        this.setState({
          data: response.value,
          name: response.value.name ?? '',
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
          facebook: response.value?.facebook ?? '',
          description: response.value?.description ?? '',
          action: 'normal',
          type: response.value.type ?? -1
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
    const index = this.state.courses.findIndex((item: IListItem) => item.facilityId === this.state.facilityId);
    const facilityId = this.state.courses[index - 1].facilityId;
    const courseId = this.state.courses[index - 1].courseId;

    this.setState({ action: 'loading', snackOpen: false, facilityId: facilityId });  
    this.fetch(facilityId);
    
    const obj = { courseId: courseId, facilityId: facilityId };    
    this.props.onFacilityChange(obj);
  }

  handleOnDownClick() {    
    const index = this.state.courses.findIndex((item: IListItem) => item.facilityId === this.state.facilityId);
    let facilityId = this.state.courses[index].facilityId;
    let courseId = this.state.courses[index].courseId;
    let i = 1;    

    // get the last facility id in that matches and then we cal load the next new one
    // this is to handle the case where there are multiple courses for the same facility
    do {      
      facilityId = this.state.courses[index + i].facilityId;   
      courseId = this.state.courses[index + i].courseId; 
      i++;
    } while (facilityId === this.state.facilityId);   

    this.setState({ action: 'loading', snackOpen: false, facilityId: facilityId });        
    this.fetch(facilityId);

    const obj = { courseId: courseId, facilityId: facilityId };    
    this.props.onFacilityChange(obj);
  }

  handleOnCloseAfterDelete() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  }

  handleUpdateFacilityOnClick() {
    let client: FacilityService | null = new FacilityService();
    let body: IFacility | null = { 
      id: this.state.facilityId, 
      name: this.state.name,
      address1: this.state.address1,
      address2: this.state.address2,
      city: this.state.city, 
      postalCode: this.state.postalCode !== '' ? parseInt(this.state.postalCode) : null,  
      longitude: this.state.longitude, 
      latitude: this.state.latitude,
      email: this.state.email,
      website: this.state.website,
      phone: this.state.phone,
      instagram: this.state.instagram,
      facebook: this.state.facebook,
      description: this.state.description,
      type: this.state.type
    } as IFacility;     
    
    client.patch(body).then(async (response: IPatchFacilityApiResponse) => {   
      if (response.success) {          
        this.setState({ action: 'updated', message: '', snackOpen: true }); 
        this.props.onFacilityUpdate(response.value);      
      } else {
        this.setState({ action: 'failed', message: this.setErrorMessage(response.messageCode, response.message) });
      }
    }).catch((error: Error) => {
      this.setState({ action: 'failed', message: error.message });
    });
     
    client = null;
  }

  handleOnSwapToCourse() {
    const obj = { courseId: this.state.courseId, facilityId: this.state.facilityId };    
    this.props.onSwapFacilityToCourse(obj);
  }

  cancelDeleteCallback() {
    this.setState({ action: 'normal' });
  }

  private handleTypeChange = (e: React.MouseEvent<HTMLElement>, value: number) => {
    e.preventDefault();

    this.setState({ type: value });   
  }

  private handleSnackClose = () => {
    this.setState({ snackOpen: false });       
  };

  private handleCopyFacilityToClipBoard = () => {
    navigator.clipboard.writeText(`${this.state.name} in ${this.state.city} ${this.state.state}`);  
    this.setState({ clip: true });
    setTimeout(() => {  this.setState({ clip: false }); }, 2000);
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
      case 'Name':
        if (this.state.name.length < 8 && !blurErrors.includes(e.currentTarget.name)) blurErrors.push('name');
        break;     
      default:
        break;
    }

    this.setState({ blurErrors: blurErrors });
  }

  private setHelperTextMessage = (field: string) => {
    switch (field) {
      case 'name':
        return this.state.blurErrors.includes('name') ? 'Name is required' : ' ';     
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
        <Snackbar open={this.state.snackOpen} autoHideDuration={1000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={(e: any) => this.handleSnackClose()}>
          <Alert severity="success" sx={{ minWidth: '400px' }}>
            Facility successfully updated!
          </Alert>
        </Snackbar>

        <Grid container spacing={1}>              
          <Grid item xs={8}>
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '5px', paddingTop: '15px' }}            
            >              
              <Button variant="contained" size="small" color="secondary" startIcon={<SwapIcon />} onClick={(e: any) => this.handleOnSwapToCourse()}>Open Course</Button>
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '5px', paddingTop: '25px' }}              
            >              
              <CopyIcon sx={{ fontSize: 15, display: (! this.state.clip) ? 'inline' : 'none', marginLeft: '10px' }} onClick={(e: any) => this.handleCopyFacilityToClipBoard()} />
              <CheckIcon sx={{ fontSize: 15, display: (this.state.clip) ? 'inline' : 'none', marginLeft: '10px', color: green[700] }} />
            </Box>
          </Grid>
          <Grid item xs={1}>
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '5px', paddingTop: '10px' }}
              onClick={(e: any) => this.handleOnUpClick()}
            >
              <IconButton>
                <ArrowUpIcon fontSize="small" />
              </IconButton>         
            </Box>  
          </Grid>
          <Grid item xs={1}>
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              sx={{ paddingRight: '10px', paddingTop: '10px' }}
              onClick={(e: any) => this.handleOnDownClick()}
            >
              <IconButton>
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
            <ConfirmDelete id={this.state.facilityId} editMode={'facility'} theme={this.props.theme} text={this.state.name} onSuccess={this.handleOnCloseAfterDelete.bind(this)} onCancel={this.cancelDeleteCallback.bind(this)}></ConfirmDelete>
          </Box>
        </Box>      

        <Box display={this.state.action === 'confirm-delete' ? 'none' : 'block'} sx={{ height: '100%', padding: 1 }} >
          <Box marginBottom={6}>
            <Typography
              variant="h3"
              align={'center'}
              sx={{ fontWeight: 500, }}
            >
              {this.state.name}
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
                          label="Facility Name *"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'name'}
                          value={this.state.name}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('courseName') ? true : false}
                          helperText={this.setHelperTextMessage('courseName')}                          
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
                          disabled={this.state.address1 !== '' ? false : true}
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
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          type="text"
                          label="Facebook"
                          variant="outlined"
                          color="primary"
                          fullWidth
                          name={'facebook'}
                          value={this.state.facebook}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('facebook') ? true : false}
                          helperText={this.setHelperTextMessage('facebook')}                          
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <ToggleButtonGroup
                          color="primary"
                          exclusive   
                          size="large"                   
                          value={this.state.type}  
                          sx={{ maxHeight: 56, width: '100%', justifyContent: 'center' }}                      
                        >
                          <ToggleButton value={1} onClick={(e: any) => this.handleTypeChange(e, 1)} sx={{ minWidth: '20%' }}>Public</ToggleButton>
                          <ToggleButton value={3} onClick={(e: any) => this.handleTypeChange(e, 3)} sx={{ minWidth: '35%' }}>Semi-Private</ToggleButton>
                          <ToggleButton value={2} onClick={(e: any) => this.handleTypeChange(e, 2)} sx={{ minWidth: '20%' }}>Private</ToggleButton>
                          <ToggleButton value={-1} onClick={(e: any) => this.handleTypeChange(e, -1)} sx={{ minWidth: '25%' }}>Unknown</ToggleButton>
                        </ToggleButtonGroup>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Description"
                          variant="outlined"
                          color="primary"
                          multiline
                          rows={6}
                          fullWidth
                          name={'description'}
                          value={this.state.description}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('description') ? true : false}
                          helperText={this.setHelperTextMessage('description')}                          
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={8}>
                        <Box
                          display={this.state.action === 'confirm-delete' ? 'none' : 'end'}
                          justifyContent={'end'}
                          sx={{ paddingBottom: '10px', paddingTop: '10px' }}
                          onClick={(e: any) => this.handleUpdateFacilityOnClick() }
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
                          sx={{ paddingBottom: '10px', paddingTop: '10px' }}
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

export default EditFacility;

interface IProps {
  onClose: () => void;
  onFacilityUpdate: (facility: IFacility | null) => void;  
  onFacilityChange: (obj: any) => void;
  onSwapFacilityToCourse: (obj: any) => void;
  theme: Theme;
  open: boolean;
  facilityId: string;
  courseId: string;
  courses: IListItem[] | [];
}

interface IForm {
  action: string,
  messageText: string;
  messageCode: number;
  open: boolean;
  blurErrors: string[],
  data: IFacility | null;
  facilityId: string;   
  courseId: string; 
  name: string;
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
  facebook: string;
  description: string;
  type: number;
  snackOpen: boolean;
  clip: boolean;
  courses: IListItem[] | [];
}

interface IListItem {
  courseId: string;
  facilityId: string;
}