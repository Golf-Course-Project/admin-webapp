/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CircularProgress, Divider, Grid, IconButton, Link, List, ListItem, ListItemIcon, ListItemText, Skeleton, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import UploadIcon from '@material-ui/icons/Upload';
import AddIcon from '@material-ui/icons/AddCircle';
import { green, grey } from '@material-ui/core/colors';

const maxFiles = 5;
const listItemLength = 45;

class UploadImages extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
 
  state: IForm = {
    action: 'loading',
    messageCode: 200,
    messageText: '',
    snackOpen: false,
    data: null,
    count: 0,
    courseId: this.props.courseId,
    facilityId: this.props.facilityId,
    buttonText: 'Upload',
    files: [],
    reachedFileLimit: false,
  }

  componentDidMount() {
    if (this.props.ready === true) this.fetch(this.props.courseId);
  }

  componentDidUpdate(prevProps: any) {

    if (prevProps.ready !== this.props.ready) {
      this.setState({ action: 'loading' });
      if (this.props.ready === true) this.fetch(this.props.courseId);
    }
  }

  private handleAddIconOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ action: 'upload-select' });
  }

  private handleCancelUploadOnClick = (e: React.FormEvent<HTMLInputElement>) => {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;    
    if (fileUpload) { fileUpload.value = ''; }
    
    this.setState({ action: 'normal', files: [] });
  }

  private handleDeleteIconBeforeFileUploadOnClick = (index: number) => {
    let filesToUpload = this.state.files;    
    filesToUpload.splice(index, 1);

    if (filesToUpload.length === 0) {
      const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;    
      if (fileUpload) { fileUpload.value = ''; }
      this.setState({ action: 'normal', files: [] });
    } else {    
      this.setState({ files: filesToUpload });
    }
  }


  private fetch = (courseId: string) => {
    this.setState({ action: 'normal' });
  }

  private handleSaveOnClick = (e: React.FormEvent<HTMLInputElement>) => {

  }

  private handleDeleteOnClick = (id: string) => {

  }

  private handleSelectFilesEvent = (e: React.ChangeEvent<HTMLInputElement>) => {    
    var filesToUpload = e.target.files !== undefined ? Array.prototype.slice.call(e.target.files) : undefined;
    this.setState({ action: 'upload-ready', files: filesToUpload });
  }


  private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as unknown as Pick<IForm, keyof IForm>);
  };


  private handleSnackClose = () => {
    this.setState({ snackOpen: false });
  };

  render() {

    return (
      <div style={{ width: '100%' }}>
        <Box display="flex" flexDirection={'column'} minHeight={'200px'} sx={{ p: 0, width: '100%' }}>

          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'}>

            <Typography sx={{ mb: 1 }} variant="h6" component="div">
              🖼️ Course Photos
            </Typography>
            <IconButton sx={{ mb: 1 }} disabled={this.state.action !== 'normal'} onClick={(e: any) => this.handleAddIconOnClick(e)}>
              <AddIcon sx={this.state.action === 'normal' ? { color: green[500] } : { color: grey[500] }} />
            </IconButton>

          </Box>

          <Divider />

          <Box sx={{ 
            display: this.state.action === 'upload-select' || this.state.action === 'upload-ready' ? 'block' : 'none',
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

          <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'} sx={ this.state.action === 'upload-ready' && this.state.files.length > 0 ? {display: 'flex'} : {display: 'none'}}>
            <List dense={true} sx={{ width: '100%' }}>
              {this.state.files.map((file: any, i: number) => (
                <ListItem divider key={i} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={(e: any) => this.handleDeleteIconBeforeFileUploadOnClick(i)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemIcon>
                    <CircularProgress size={20} sx={{ display: 'none' }} />
                    <UploadIcon color={'disabled'} />
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

          <Box sx={this.state.files.length > 0 ? { display: 'block', width: '100%' } : { display: 'none', width: '100%' }}>
            <Grid container spacing={2} style={{ width: '100%' }}>
              <Grid item xs={12} md={12}>
                <Box alignItems={'right'} justifyContent={'right'} sx={{ display: 'flex', paddingTop: '20px' }}>                  
                  <Button variant="contained" color="primary" size="small" onClick={(e: any) => this.handleSaveOnClick(e)}>Save</Button>&nbsp;
                  <Button variant="contained" size="small" onClick={(e: any) => this.handleCancelUploadOnClick(e)} sx={{background: this.props.theme.palette.grey[600]}}>Cancel</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box display="flex" width={'100%'} sx={this.state.action === 'normal' && this.state.count === 0 ? { display: 'flex', width: '100%' } : { display: 'none' }}>
            <Typography
              variant="body1"
              align={'left'}
              sx={{ fontWeight: 500, marginTop: 2, marginBottom: 2 }}
            >
              No records found. <Link component="button" fontSize={16} onClick={(e: any) => this.handleAddIconOnClick(e)}>Click here</Link> to upload new images.                        
              
            </Typography>
          </Box>          

          <Box sx={this.state.action === 'loading' ? { display: 'block', width: '100%' } : { display: 'none', width: '100%' }}>
            <Skeleton animation="wave" width={'100%'} />
            <Skeleton animation="wave" width={'100%'} />
            <Skeleton animation="wave" width={'100%'} />
          </Box>
        </Box>
      </div>
    );

  }
}

export default UploadImages;

interface IProps {
  theme: Theme;
  facilityId: string;
  courseId: string;
  ready: boolean;
}

interface IForm {
  action: string,
  messageText: string;
  messageCode: number;
  snackOpen: boolean;
  data: null,
  count: number;
  facilityId: string;
  courseId: string;
  buttonText: string;
  files: [],
  reachedFileLimit: boolean;  
}

