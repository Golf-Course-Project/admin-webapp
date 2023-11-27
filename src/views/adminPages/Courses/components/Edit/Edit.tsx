/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CardContent, Divider, Drawer, Grid, IconButton, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { ICourses } from 'interfaces/course.interfaces';
import { ErrorMessage } from 'common/components';

class EditCourse extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'normal',
    editMode: 'facility',
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    blurErrors: [],
    selectedCourse: this.props.selectedCourse,
    facilityName: this.props.selectedCourse != null ? this.props.selectedCourse.facilityName : '',
    courseName: this.props.selectedCourse != null ? this.props.selectedCourse.courseName: '',
    address1: this.props.selectedCourse != null ? this.props.selectedCourse.address1 : '',
    address2: '',
    city: this.props.selectedCourse != null ? this.props.selectedCourse.city : '',
    state: this.props.selectedCourse != null ? this.props.selectedCourse.state : '',
    postalCode: '',    
    longitude: null,
    latitude: null,
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
        selectedCourse: this.props.selectedCourse, 
        courseName: this.props.selectedCourse != null ? this.props.selectedCourse.courseName : '',
        facilityName: this.props.selectedCourse != null ? this.props.selectedCourse.facilityName : '',
        address1: this.props.selectedCourse != null ? this.props.selectedCourse.address1 : '',
        city: this.props.selectedCourse != null ? this.props.selectedCourse.city : '',        
        action: 'normal' 
      });
      
    }
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

    switch(e.currentTarget.name) {
      case 'facilityName':
        if (this.state.facilityName.length < 8 && ! blurErrors.includes(e.currentTarget.name)) blurErrors.push('facilityName');         
        break;
      case 'courseName':
        if (this.state.courseName.length < 8 && ! blurErrors.includes(e.currentTarget.name)) blurErrors.push('courseName');          
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

    if (!this.state.selectedCourse) {
      return (<div style={{ display: 'none' }}>&nbsp;</div>);
    }
    else {
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
                  <Box marginBottom={4} textAlign={'center'}>
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
                </Grid>
                <Grid item xs={12}>
                  <ErrorMessage message={this.setErrorMessage(this.state.messageCode, this.state.messageText)} />
                  <form noValidate autoComplete="off">
                    <Box display="flex" flexDirection={'column'}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
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
                        <Grid item xs={12}>                      
                          <Box
                            display={this.state.action === 'confirm-delete' ? 'none' : 'end'}
                            justifyContent={'end'}
                            sx={{ paddingBottom: '10px' }}
                            onClick={(e: any) => this.setState({ action: 'confirm-delete' })}
                          >
                            <Button variant="contained" startIcon={<SaveIcon />} sx={{ width: '100%' }}>
                              Update {this.state.editMode === 'facility' ? 'Facility' : 'Course' }
                            </Button>
                          </Box>  
                        </Grid>
                        <Grid item xs={12}>  
                          <Box
                            display={this.state.action === 'confirm-delete' ? 'none' : 'end'}
                            justifyContent={'end'}
                            sx={{ paddingBottom: '10px' }}
                            onClick={(e: any) => this.setState({ action: 'confirm-delete' })}
                          >
                            <Button variant="contained" startIcon={<DeleteIcon />} sx={{ width: '100%', background: this.props.theme.palette.grey[600] }}>
                              Delete {this.state.editMode === 'facility' ? 'Facility' : 'Course' }
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
}

export default EditCourse;

interface IProps {
  onClose: () => void;
  theme: Theme;
  open: boolean;
  selectedCourse: ICourses | any;
}

interface IForm {
  action: string,
  editMode: string,
  messageText: string;
  messageCode: number;
  open: boolean;
  blurErrors: string[],
  selectedCourse: ICourses;
  facilityName: string;
  courseName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  longitude: number | null;
  latitude: number | null;
  phone: string ;
  email: string;
  website: string;
  instagram: string;
  description: string;
}