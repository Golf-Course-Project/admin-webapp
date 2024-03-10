import React from 'react';
import MyAvatar from 'common/components/Avatar/Avatar';
import { Box, Button, Container, Input, Skeleton, Typography, Snackbar, Alert } from '@material-ui/core';
import ErrorMessage from 'common/components/ErrorMessage';
import UserProfileService from 'services/user.profile.service';
import { IAvatarUploadResponse } from 'interfaces/user.avatar.interfaces';
import { MessageCode } from 'helpers/enums';

class Avatar extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IForm = {
    action: 'normal',
    status: 'loading',
    name: '',
    url: '',
    file: undefined,
    msg: '',
    buttonText: 'Upload',
    success: false,
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.name !== this.props.name || prevProps.url !== this.props.url) {
      this.setState({
        name: this.props.name,
        url: this.props.url,
        status: 'normal'
      });

      console.log(this.state.action);
    }
  }

  handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    var newFile = e.target.files !== undefined ? e.target.files?.item(0) : undefined;
    this.setState({ action: 'fileselected', file: newFile });   
  }

  handleUploadClick(e: React.FormEvent<HTMLButtonElement>) {
    this.setState({ action: 'uploading', buttonText: 'Uploading, please wait...' });
    
    var extensions: string[] = ['png', 'gif', 'jpeg', 'jpg'];
    var index: number | undefined = -1;

    // validate the file extension
    for(let i = 0; i < extensions.length; i++) {
      index = this.state.file !== undefined ? this.state.file.name.toLowerCase().indexOf(extensions[i]) : -1;
    
      // if greater than zero, then we must have found a match
      if (index > 0) break;
    }

    // if we did not find a valid file extension, then set msg for error control
    if (index === -1) { 
      this.setState({ msg: 'File extension not supported. File type must be png, gif, or jpeg.', buttonText: 'Upload failed'  });
    }
    else 
    {
      if (this.state.file !== undefined) {
        var formData = new FormData();
        formData.append('file', this.state.file);
        formData.append('fileName', this.state.file.name);    
        
        const client: UserProfileService = new UserProfileService();

        client.UploadAvatar(formData).then(async (response: IAvatarUploadResponse) => {
          if (response.messageCode === MessageCode.PartialFailure) { console.log(response.message); }
          if (response.success) {             
            this.setState({ url: response.value, action: 'normal', success: true, buttonText: 'Upload' });
          }
        }).catch((error: Error) => {
          console.log(error);
        });
      }
    }
  }
  
  handleCancelUploadClick(e: React.FormEvent<HTMLButtonElement>) {
    this.setState({ file: undefined, action: 'normal', buttonText: 'Upload', msg: '' });    
  }  

  handleChangeAvatarButtonClick(e: React.FormEvent<HTMLButtonElement>) {
    this.setState({ action: 'choosefile' });
  }

  render() {
    return (
      <Box>
        <Snackbar open={this.state.success ? true : false} autoHideDuration={4000} onClose={(e: any) => this.setState({ success: false })}>
          <Alert severity="info" variant='filled' sx={{ minWidth: '400px' }}>
            Your new avatar has been uploaded and your profile updated
          </Alert>
        </Snackbar>  

        <Box justifyContent={'center'} sx={this.state.status === 'loading' ? { display: 'flex' } : { display: 'none' }}>
          <Box width={600} position="relative" zIndex={2}>
            <Box justifyContent={'center'} display={'flex'} sx={{ paddingBottom: '20px' }}>
              <Skeleton width={'30%'} height={40} />
            </Box>
            <Box justifyContent={'center'} display={'flex'}>
              <Skeleton variant="circular" width={this.props.size} height={this.props.size} />
            </Box>
            <Box justifyContent={'center'} display={'flex'}>
              <Skeleton width={'25%'} height={70} />
            </Box>
          </Box>
        </Box>

        <Container sx={this.state.status === 'normal' ? { display: 'block' } : { display: 'none' }}>
          <Box position="relative" zIndex={2} >
            <Typography
              sx={{
                textTransform: 'uppercase',
                fontWeight: 'medium',
              }}
              gutterBottom
              color={'textSecondary'}
              align={'center'}
              paddingBottom={'20px'}
            >
              Avatar
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <MyAvatar name={this.state.name} size={this.props.size} url={this.state.url} />
          </Box>
          <Box alignItems={'center'} justifyContent={'center'} sx={this.state.action !== 'normal' ? { display: 'none', paddingTop: '20px' } : { display: 'flex', paddingTop: '20px' }}>
            <Button variant="contained" component="span" onClick={(e: any) => this.handleChangeAvatarButtonClick(e)}>Change Avatar</Button>
          </Box>
          <Box alignItems={'center'} justifyContent={'center'} sx={this.state.action === 'choosefile' || this.state.action === 'fileselected' ? { display: 'flex', paddingTop: '20px' } : { display: 'none', paddingTop: '20px' }}>
            <label htmlFor="upload-photo">
              <Input
                id="upload-photo"
                name="upload-photo"               
                type="file"
                onChange={(e: any) => this.handleFileChange(e)}                
              />
            </label>
          </Box>
          <Box alignItems={'center'} justifyContent={'center'} sx={this.state.action === 'choosefile' || this.state.action === 'fileselected' || this.state.action === 'uploading' ? { display: 'flex', paddingTop: '20px' } : { display: 'none', paddingTop: '20px' }}>
            <Button variant="contained" component="span" onClick={(e: any) => this.handleUploadClick(e)} disabled={this.state.action === 'choosefile' || this.state.action === 'uploading' ?  true : false}>{this.state.buttonText}</Button>&nbsp;
            <Button component="span" onClick={(e: any) => this.handleCancelUploadClick(e)}>Cancel</Button>
          </Box>
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} sx={{paddingTop: '10px'}}>
            <Box width={'48%'}>
              <ErrorMessage message={this.state.msg} />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }
}

interface IProps {
  name: string;
  url: string;
  size: number;
}

interface IForm {
  action: string,
  status: string,
  name: string,
  url: string,
  file: File | undefined,
  msg: string;
  buttonText: string;
  success: boolean;
}

export default Avatar;