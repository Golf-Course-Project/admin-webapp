/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Alert, Button, CardContent, Divider, Drawer, Grid, IconButton, Rating, Snackbar, Stack, TextField, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';

import { ErrorMessage } from 'common/components';
import { IFetchReviewApiResponse, IReview } from 'interfaces/review.interface';
import ReviewService from 'services/review.service';
import { IReviewPost } from 'interfaces/review.interfaces';


class EditReview extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',    
    messageCode: 200,
    messageText: '',
    open: this.props.open,
    blurErrors: [],    
    data: null,       
    snackOpen: false,     
    courseId: this.props.courseId,    
    content: '',
    rating: 0,
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

      this.fetch(this.props.courseId);
    }
     
  }

  private resetForm = () => {

    this.setState({
      action: 'loading',    
      messageCode: 200,
      messageText: '',
      open: false,
      blurErrors: [],    
      data: null,       
      courseId: null,    
      snackOpen: false,        
      content: '',
      rating: 0, 
    });
    
  }

  private fetch = (courseId: string) => {
    const client: ReviewService = new ReviewService();

    client.fetch(courseId).then(async (response: IFetchReviewApiResponse) => {      
      
      if (response.success) {
        this.setState({
          data: response.value,          
          action: 'normal',   
          content: response.value?.content || '',
          rating: response.value?.rating || 0,      
        });
      }

      if (response.messageCode === 400) {
        this.setState({ action: 'normal', content: '', rating: 0 });
      }

    }).catch((error: Error) => {
      console.log(error);
    });
  }

  handleOnClose() {
    this.resetForm();
    this.props.onClose();
  }

  handleSaveOnClick() {
    let client: ReviewService | null = new ReviewService();
    let body: IReviewPost = {       
      content: this.state.content,
      rating: this.state.rating
    } as IReview;
 
    this.setState({ action: 'update' });
    
    client?.post(body, this.state.courseId).then(async (response: any) => {
      if (response.success) {
        setTimeout(() => {
          this.setState({ action: 'normal', messageText: '', snackOpen: true });
        }, 1500);
      } else {
        this.setState({ action: 'failed', messageText: this.setErrorMessage(response.messageCode, response.message) });
      }
    }).catch((error: Error) => {
      this.setState({ action: 'failed', messageText: error.message });
    });   

    client = null;
  }  

  handleDeleteOnClick() { 
    let client: ReviewService | null = new ReviewService();
    this.setState({ action: 'delete' });

    client?.delete(this.state.courseId).then(async (response: any) => {
      if (response.success) {
        setTimeout(() => {
          this.resetForm();
          this.props.onClose();
        }, 1500);
      } else {
        this.setState({ action: 'failed', messageText: this.setErrorMessage(response.messageCode, response.message) });
      }
    }).catch((error: Error) => {
      this.setState({ action: 'failed', messageText: error.message });
    });   

    client = null;
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
      case 'content':
        return this.state.blurErrors.includes('content') ? 'Content is required' : ' ';     
      case 'rating':
        return this.state.blurErrors.includes('rating') ? 'Rating is required' : ' ';   
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

        <Box display={'block'} sx={{ height: '100%', padding: 1 }} >
          <Box marginBottom={6}>
            <Typography variant="h3" align={'center'} sx={{ fontWeight: 500, }}>
              {this.props.courseName}
            </Typography>

            <Typography variant="h5" align={'center'}>
              {this.props.facilityName}
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
                  <Box display="flex" flexDirection={'column'} paddingBottom="20px">
                    <Grid container spacing={1}>                       
                      <Grid item xs={12} md={12}>
                        <TextField
                          type="text"
                          label="Content"
                          variant="outlined"
                          color="primary"
                          multiline
                          rows={6}
                          fullWidth
                          name={'content'}
                          value={this.state.content}
                          onChange={(e: any) => this.handleInputChanges(e)}
                          onBlur={(e: any) => this.handleInputBlur(e)}
                          error={this.state.blurErrors.includes('content') ? true : false}
                          helperText={this.setHelperTextMessage('content')}   
                          disabled={this.state.action !== 'normal' ? true : false}   
                          autoFocus={true}                    
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Stack spacing={1}>
                          <Typography component="legend">Rating</Typography>
                          <Rating name="rating" defaultValue={0} precision={0.5} value={this.state.rating} onChange={(e: any) => this.handleInputChanges(e)} disabled={this.state.action !== 'normal' ? true : false} />                      
                        </Stack>
                      </Grid>                                         
                    </Grid>
                  </Box>

                  <Divider />

                  <Box display="flex" flexDirection={'column'} paddingTop="20px">
                    <Grid container spacing={1}>   
                      <Grid item xs={8} md={8}>
                        <Box
                          display={'end'}
                          justifyContent={'end'}
                          sx={{ paddingBottom: '10px', paddingTop: '10px' }}
                          onClick={(e: any) => this.handleSaveOnClick() }
                        >
                          <Button variant="contained" startIcon={<SaveIcon />} sx={this.state.action !== 'update' ? { width: '100%', display: 'flex' } : { width: '100%', display: 'none' }} disabled={this.state.action !== 'normal' ? true : false}>
                            Save
                          </Button>                          

                          <Button variant="contained" startIcon={<SaveIcon />} sx={this.state.action === 'update' ? { width: '100%', display: 'flex' } : { width: '100%', display: 'none' }} disabled={true}>
                            Saving ...
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={8} md={4}>
                        <Box
                          display={'end'}
                          justifyContent={'end'}
                          sx={{ paddingBottom: '10px', paddingTop: '10px' }}
                          onClick={(e: any) => this.setState({ action: 'confirm-delete' })}
                        >
                          <Button variant="contained" startIcon={<DeleteIcon />} sx={{ width: '100%', background: this.props.theme.palette.grey[600] }} disabled={this.state.action !== 'normal' ? true : false} onClick={(e: any) => this.handleDeleteOnClick()}>
                            Delete
                          </Button>

                          <Button variant="contained" startIcon={<DeleteIcon />} sx={{ width: '100%', display: this.state.action === 'deleting' ? 'flex' : 'none' }} disabled={true}>
                            Deleting ...
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
  courseName: string;
  facilityName: string;
}

interface IForm {
  action: string,
  messageText: string;
  messageCode: number;
  blurErrors: string[];
  open: boolean; 
  data: IReview | null;   
  snackOpen: boolean;  
  courseId: string;   
  content: string;
  rating: number;
}
