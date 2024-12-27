/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Alert, Button, CircularProgress, Divider, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Link, List, ListItem, ListItemIcon, ListItemText, Skeleton, Snackbar, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import UploadIcon from '@material-ui/icons/Upload';
import AddIcon from '@material-ui/icons/AddCircle';
import RefreshIcon from '@material-ui/icons/Refresh';
import CheckedIcon from '@material-ui/icons/RadioButtonChecked';
import UnCheckedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined';
import { green, grey } from '@material-ui/core/colors';

import { ICoursePatchForDefaultPhoto, ICoursePhoto, IFetchPhotosApiResponse, IPatchCourseApiResponse, IPostPhotosApiResponse } from 'interfaces/course.interfaces';
import CourseService from 'services/course.service';
import { IStandardApiResponse } from 'interfaces/api-response.interface';

const maxFiles = 6;
const listItemLength = 45;

class CoursePhotos extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'loading',
    messageCode: 200,
    messageText: '',
    snackOpen: false,
    data: [],
    count: 0,
    courseId: this.props.courseId,
    facilityId: this.props.facilityId,
    filesSelectedToBeUploaded: [],   
    reachedFileLimit: false,   
    defaultPhotoName: this.props.default,
  } 

  componentDidMount() {
    if (this.props.ready === true) {
      this.fetch(this.props.courseId);
    }
  }

  componentDidUpdate(prevProps: any) {    
    if (prevProps.ready !== this.props.ready) {
      this.setState({ action: 'loading' });      
      
      if (this.props.ready === true) {     
        this.fetch(this.props.courseId);        
      }
    }
  }

  private getDefaultPhotoName = (url: string | undefined) => {  
    if (url === undefined || url === null || url === '' || url === 'undefined') return '';
        
    const parts = url.split('/');
    return parts[parts.length - 1]; 
  }

  private handleAddIconOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ action: 'upload-select', filesSelectedToBeUploaded: [] });
  }

  private handleRefreshIconOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ action: 'loading' });
    this.fetch(this.props.courseId);
  }

  private handleCancelUploadOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileUpload) { fileUpload.value = ''; }

    this.setState({ action: 'normal', filesSelectedToBeUploaded: [] });
  }

  private handleDeleteIconBeforeFileUploadOnClick = (index: number) => {
    let filesSelectedToBeUploaded = this.state.filesSelectedToBeUploaded;
    filesSelectedToBeUploaded.splice(index, 1);

    if (filesSelectedToBeUploaded.length === 0) {
      const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileUpload) { fileUpload.value = ''; }
      this.setState({ action: 'normal', files: [] });
    } else {
      this.setState({ files: filesSelectedToBeUploaded });
    }
  }

  private handleDeletePhotoOnClick = (name: string) => {
    let client: CourseService | null = new CourseService();

    client.deletePhoto(this.state.courseId, name).then(async (response: IStandardApiResponse) => {
      if (response.success) {
        const courses = this.state.data.filter(item => item.name !== name);
        this.setState({ data: courses });
      }
      else {
        this.setState({ messageText: response.message, snackOpen: true });
      }

    }).catch((error: Error) => {
      this.setState({ action: 'failed', message: error.message });
    });

    client = null;
  }

  private handleCheckIconForDefaultPhotoOnClick = (url: string, isDefault: boolean) => {
    const body: ICoursePatchForDefaultPhoto | null = { id: this.state.courseId, defaultPhoto: url } as ICoursePatchForDefaultPhoto;
    let client: CourseService | null = new CourseService();

    client.patch(body).then(async (response: IPatchCourseApiResponse) => {
      if (response.success) {
        this.setState({ defaultPhotoName: this.getDefaultPhotoName(url) });
      }
      else {
        this.setState({ messageText: response.message, snackOpen: true });
      }

    }).catch((error: Error) => {
      this.setState({ action: 'failed', message: error.message });
    });

    client = null;
  }

  private fetch = (courseId: string) => {
    const client: CourseService = new CourseService();

    client.fetchPhotos(courseId).then(async (response: IFetchPhotosApiResponse) => {        
          
      if (response.success) {
        this.setState({
          data: response.value,
          count: response.count,
          action: 'normal',
          defaultPhotoName: this.props.default
        });
      }

      if (response.messageCode === 400) {
        this.setState({ action: 'normal', count: 0, data: [] });
      }
    }).catch((error: Error) => {
      console.log(error);
    });
  }

  private handleUploadFileButtonOnClick = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
  
    this.setState({ action: 'upload-active' });   

    const _filesToUpload: File[] = [...this.state.filesSelectedToBeUploaded];   
    //const _extensions: string[] = ['png', 'gif', 'jpeg', 'jpg'];

    var formData = new FormData();

    _filesToUpload.forEach((file, i) => {
      formData.append('files', file);
    });    
   
    const client: CourseService = new CourseService();

    await client.postPhotos(formData, this.props.courseId).then((response: IPostPhotosApiResponse) => {
            
      if (response.success) {
        const newData: ICoursePhoto[] = response.value || []; // Ensure response value is always an array
        this.setState({ action: 'normal', filesSelectedToBeUploaded: [], data: newData });
      }
    }).catch((error: Error) => {
      console.log(error);
    });
  }

  private handleSelectFilesEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _filesToUpload = e.target.files !== undefined ? Array.prototype.slice.call(e.target.files) : [];
    const _numberOfFilesWeCanUpload = maxFiles - this.state.data.length;

    if (_filesToUpload.length > _numberOfFilesWeCanUpload) {
      this.setState({ messageText: `The maximum number of photos is ${maxFiles}. You can upload ${_numberOfFilesWeCanUpload} more file(s).`, snackOpen: true });
      return;
    }

    this.setState({ action: 'upload-ready', filesSelectedToBeUploaded: _filesToUpload });
  }

  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<IForm, keyof IForm>);
  };

  private handleSnackClose = () => {
    this.setState({ snackOpen: false, messageText: '' });
  };

  render() {

    return (
      <div style={{ width: '100%', marginTop: '10px' }}>

        <Snackbar open={this.state.snackOpen} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={(e: any) => this.handleSnackClose()}>
          <Alert severity="error" sx={{ minWidth: '400px' }}>
            {this.state.messageText}
          </Alert>
        </Snackbar>

        <Box display="flex" flexDirection={'column'} minHeight={'200px'} sx={{ p: 0, width: '100%' }}>          

          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'}>
            <Typography sx={{ mb: 1 }} variant="h6" component="div">
              🖼️ Course Photos
            </Typography>
            <Box display={'flex'} justifyContent={'right'} alignItems={'right'}>
              <IconButton sx={{ mb: 1 }} disabled={this.state.action !== 'normal'} onClick={(e: any) => this.handleRefreshIconOnClick(e)}>
                <RefreshIcon sx={this.state.action !== 'normal' ? { color: grey[500] } : {}} />
              </IconButton>
              <IconButton sx={{ mb: 1 }} disabled={this.state.action !== 'normal' || this.state.data.length >= maxFiles} onClick={(e: any) => this.handleAddIconOnClick(e)}>
                <AddIcon sx={this.state.action === 'normal' && this.state.data.length < maxFiles ? { color: green[500] } : { color: grey[500] }} />
              </IconButton>
            </Box>
          </Box>

          <Divider />

          <Box sx={{
            display: this.state.action.includes('upload-') ? 'block' : 'none',
            width: '100%',
            paddingLeft: '10px',
            paddingBottom: '10px',
            paddingTop: '5px',
            marginTop: '10px',
            border: `2px dashed ${this.props.theme.palette.divider}`
          }}>  
            <Grid container spacing={2} style={{ width: '100%' }}>
              <Grid item xs={12} md={12}>
                <label htmlFor="upload-photo">
                  <input
                    style={{ marginTop: '5px', height: '20px' }}
                    type="file"
                    id="fileUpload"
                    multiple
                    name="file"
                    disabled={this.state.reachedFileLimit}
                    onChange={(e: any) => this.handleSelectFilesEvent(e)}
                  />
                </label>
              </Grid>
            </Grid>         
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'} sx={this.state.action.includes('upload-') && this.state.filesSelectedToBeUploaded.length > 0 ? { display: 'flex' } : { display: 'none' }}>
            <List dense={true} sx={{ width: '100%' }}>
              {this.state.filesSelectedToBeUploaded.map((file: any, i: number) => (
                <ListItem divider key={i} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={(e: any) => this.handleDeleteIconBeforeFileUploadOnClick(i)} disabled={this.state.action === 'upload-active' || this.state.action === 'upload-complete' ? true : false}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemIcon>
                    <CircularProgress size={20} sx={this.state.action === 'upload-active' ? { display: 'flex' } : { display: 'none' }} />
                    {this.state.action !== 'upload-active' ? <UploadIcon color={'disabled'} /> : ''}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name.length > (0.8 * listItemLength) ? `${file.name.substring(0, Math.floor(0.8 * listItemLength))}...` : file.name}
                    secondary={file.size + ' bytes'}
                    sx={{ fontSize: 'small' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box display="flex" width={'100%'} sx={this.state.action === 'normal' && this.state.count === 0 ? { display: 'flex', width: '100%' } : { display: 'none' }}>
            <Typography
              variant="body1"
              align={'left'}
              sx={{ fontWeight: 500, marginTop: 2, marginBottom: 2 }}
            >
              No course photos found. <Link component="button" fontSize={16} onClick={(e: any) => this.handleAddIconOnClick(e)}>Click here</Link> to upload new images.

            </Typography>
          </Box>

          <Box display="flex" width={'100%'} sx={this.state.action === 'normal' && this.state.count > 0 ? { display: 'flex', width: '100%' } : { display: 'none' }}>
            <ImageList sx={{ width: '100%' }} cols={2}>             
              {this.state.data.map((photo, index) => (
                <ImageListItem key={index}>
                  <img
                    srcSet={`${photo.url}?w=248&&fit=crop&auto=format&dpr=2 2x`}
                    src={`${photo.url}?w=248&fit=crop&auto=format`}
                    alt={photo.name}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={photo.name.length > 14 ? `${photo.name.substring(0, 11)}...` : photo.name}
                    actionIcon={
                      <div>
                        {photo.name.toLowerCase() === this.state.defaultPhotoName ? (                        
                          <>                                                     
                            <IconButton
                              color="primary"
                              aria-label={`info about ${photo.name}`}
                            >
                              <CheckedIcon />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                            aria-label={`info about ${photo.name}`}
                            onClick={(e: any) => this.handleCheckIconForDefaultPhotoOnClick(photo.url, false)}
                          >
                            <UnCheckedIcon />
                          </IconButton>
                        )}

                        <IconButton
                          sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                          aria-label={`info about ${photo.name}`}
                          onClick={(e: any) => this.handleDeletePhotoOnClick(photo.name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>

          <Box sx={(this.state.action !== 'loading' && this.state.action !== 'normal') ? { display: 'block', width: '100%' } : { display: 'none', width: '100%' }}>
            <Grid container spacing={2} style={{ width: '100%' }}>
              <Grid item xs={6} md={6}>
                <Box alignItems={'left'} justifyContent={'left'} sx={{ display: 'flex', paddingTop: '10px' }}>
                  <Button variant="contained" size="small" onClick={(e: any) => this.handleCancelUploadOnClick(e)} sx={{ background: this.props.theme.palette.grey[600] }} disabled={this.state.action === 'upload-active' || this.state.action === 'upload-complete' ? true : false}>Cancel</Button>
                </Box>
              </Grid>
              <Grid item xs={6} md={6}>
                <Box alignItems={'right'} justifyContent={'right'} sx={this.state.filesSelectedToBeUploaded.length > 0 ? { display: 'flex', width: '100%', paddingTop: '10px' } : { display: 'none', width: '100%' }}>
                  <Button variant="contained" color="primary" size="small" onClick={(e: any) => this.handleUploadFileButtonOnClick(e)} disabled={this.state.action === 'upload-active' || this.state.action === 'upload-complete' ? true : false}>{this.state.action === 'upload-active' || this.state.action === 'upload-complete' ? 'Uploading...' : 'Upload'}</Button>&nbsp;
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box sx={this.state.action === 'loading' ? { display: 'block', width: '100%', marginTop: '11px', } : { display: 'none', width: '100%' }}>
            <Grid container wrap="nowrap">
              <Grid item xs={12} md={6} marginRight={'2px'}>
                <Skeleton animation="wave" variant='rectangular' width={'100%'} height={'164px'} />
              </Grid>
              <Grid item xs={12} md={6} marginLeft={'2px'}>
                <Skeleton animation="wave" variant='rectangular' width={'100%'} height={'164px'} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    );

  }
}

export default CoursePhotos;

interface IProps {
  theme: Theme;
  facilityId: string;
  courseId: string;
  ready: boolean;
  default: string | undefined;
}

interface IForm {
  action: string,
  messageText: string,
  messageCode: number,
  snackOpen: boolean,
  data: ICoursePhoto[],
  count: number,
  facilityId: string,
  courseId: string,
  filesSelectedToBeUploaded: [], 
  reachedFileLimit: boolean,  
  defaultPhotoName?: string,
}

