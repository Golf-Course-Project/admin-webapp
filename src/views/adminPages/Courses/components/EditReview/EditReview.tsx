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
import { IReview } from 'interfaces/review.interface';


class EditReview extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',    
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    blurErrors: [],    
    data: null,       
    courseId: this.props.courseId,    
    snackOpen: false,     
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.open !== this.props.open) {
      this.setState({
        open: this.props.open,        
        courseId: this.props.courseId,        
        action: 'loading'
      });

      //this.fetch(this.props.courseId);
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
      courseId: this.props.courseId,    
      snackOpen: false,         
    });
    
  }

  private fetch = (facilityId: string) => {
    const client: FacilityService = new FacilityService();

    client.fetch(facilityId).then(async (response: IFetchFacilityApiResponse) => {      

      if (response.success) {
        this.setState({
          data: response.value,          
          action: 'normal',         
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

  handleOnCloseAfterDelete() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  }

  handleUpdateReviewOnClick() {
    let client: FacilityService | null = new FacilityService();
    let body: IFacility | null = { 
      id: this.state.courseId,      
    } as IFacility;     
    
    client.patch(body).then(async (response: IPatchFacilityApiResponse) => {   
      if (response.success) {          
        this.setState({ action: 'updated', message: '', snackOpen: true }); 
        //this.props.onReviewUpdate(response.value);      
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

  private handleTypeChange = (e: React.MouseEvent<HTMLElement>, value: number) => {
    e.preventDefault();

    this.setState({ type: value });   
  }

  private handleSnackClose = () => {
    this.setState({ snackOpen: false });       
  }; 

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
        //if (this.state.name.length < 8 && !blurErrors.includes(e.currentTarget.name)) blurErrors.push('name');
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
            Review successfully updated!
          </Alert>
        </Snackbar>

        <Grid container spacing={1}>           
          <Grid item xs={12}>
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
            Deleted
          </Box>
        </Box>      

        <Box display={this.state.action === 'confirm-delete' ? 'none' : 'block'} sx={{ height: '100%', padding: 1 }} >
          <Box marginBottom={6}>
            <Typography
              variant="h3"
              align={'center'}
              sx={{ fontWeight: 500, }}
            >
              Course Name
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
                          label="Description"
                          variant="outlined"
                          color="primary"
                          multiline
                          rows={6}
                          fullWidth
                          name={'description'}
                          value={''}
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
                          onClick={(e: any) => this.handleUpdateReviewOnClick() }
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

export default EditReview;

interface IProps {
  onClose: () => void;    
  theme: Theme;
  open: boolean;  
  courseId: string; 
}

interface IForm {
  action: string,
  messageText: string;
  messageCode: number;
  blurErrors: string[];
  open: boolean; 
  data: IReview | null;   
  courseId: string;   
  snackOpen: boolean;  
}
