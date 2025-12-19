/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Button, CardActions, CardContent, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';

import UnLockIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import RoleIcon from '@material-ui/icons/AdminPanelSettings';
import EmailIcon from '@material-ui/icons/Email';
import DateIcon from '@material-ui/icons/CalendarToday';
import LastAttemptIcon from '@material-ui/icons/Login';
import WarningIcon from '@material-ui/icons/ReportGmailerrorred';
import ResetIcon from '@material-ui/icons/RestartAlt';
import OkayIcon from '@material-ui/icons/ThumbUp';
import DeleteIcon from '@material-ui/icons/Delete';
import SetPersonToAdminIcon from '@material-ui/icons/PersonAddAlt1';
import SetPersonToBasicIcon from '@material-ui/icons/PersonRemoveAlt1';

import { IUsers } from 'interfaces/user.admin.interfaces';
import { stringToColor, formatDate } from 'helpers/string.helper';
import UserAdminService from 'services/user.admin.service';
import { IApiResponse } from 'interfaces/api-response.interface';
import ConfirmDelete from '../ConfirmDelete';

class EditUser extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IEditUser = {
    action: 'normal',
    errorMsg: '',
    open: this.props.open,
    user: this.props.user,
  }

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps: any) {    
    if (prevProps.open !== this.props.open) {     
      this.setState({ open: this.props.open, user: this.props.user, action: 'normal' });
    }
  }  

  handleUnLockClick(id: string) {
    let client: UserAdminService | null = new UserAdminService();  
    let user: IUsers = this.state.user;    

    client.UnLock(id).then(async (response: IApiResponse) => {
      if (response.success) {
        user.isLocked = false;
        user.dateLocked = null;

        this.setState({ user: user });
      }
    }).catch((error: Error) => {
      console.log(error);
    });

    client = null;
  }

  handleLockClick(id: string) {
    let client: UserAdminService | null = new UserAdminService();   
    let user: IUsers = this.state.user; 

    client.Lock(id).then(async (response: IApiResponse) => {
      if (response.success) {
        user.isLocked = true;
        user.dateLocked = new Date();

        this.setState({ user: user });
      }
    }).catch((error: Error) => {
      console.log(error);
    });

    client = null;
  }  

  handleResetClick(id: string) {
    let client: UserAdminService | null = new UserAdminService();   
    let user: IUsers = this.state.user; 

    client.Reset(id).then(async (response: IApiResponse) => {
      if (response.success) {
        user.status = 1;
        user.statusText = 'Okay';
        user.loginAttempts = 0;

        this.setState({ user: user, action: 'reset' });
      }
    }).catch((error: Error) => {
      console.log(error);
    });

    client = null;
  }  

  handleRoleChangeClick(role: string, id: string) {
    let client: UserAdminService | null = new UserAdminService();   
    let user: IUsers = this.state.user; 

    client.ChangeRole(role, id).then(async (response: IApiResponse) => {
      if (response.success) {
        user.role = role;       

        this.setState({ user: user });
      }
    }).catch((error: Error) => {
      console.log(error);
    });

    client = null;
  }  

  handleOnClose() {
    this.setState({ action: 'normal' });
    this.props.onClose();
  }

  handleOnCloseAfterDelete() {
    let user: IUsers = this.state.user; 
    user.isDirtyDeleted = true;

    this.setState({ action: 'normal', user: user });
    this.props.onClose();
  }

  cancelDeleteCallback() {
    this.setState({ action: 'normal' });   
  }

  lockedButton(locked: boolean, id: string) {
    if (locked) {
      return (<IconButton edge="end" aria-label="un lock" onClick={(e: any) => this.handleUnLockClick(id)}>
        <UnLockIcon />
      </IconButton>);
    }
    else {
      return (<IconButton edge="end" aria-label="lock" onClick={(e: any) => this.handleLockClick(id)}>
        <LockIcon />
      </IconButton>);
    }
  } 

  lockedStatus(locked: boolean | undefined) {
    if (locked) {
      return <LockIcon color="primary" fontSize='large' />;
    }
    else {
      return <UnLockIcon color="primary" fontSize='large' />;
    }
  }

  statusIcon(status: number) {
    if (status === 3) {
      return (<WarningIcon color="error" fontSize='large' />);
    }
    else {
      return (<OkayIcon color="primary" fontSize='large' />);
    }
  } 

  roleChangeButton(role: string, id: string) {
    if (role.toLowerCase() === 'basic') {
      return (<IconButton edge="end" aria-label="change role to site admin" onClick={(e: any) => this.handleRoleChangeClick('site admin', id)}>
        <SetPersonToAdminIcon />
      </IconButton>);
    }
    else {
      return (<IconButton edge="end" aria-label="change role to basic" onClick={(e: any) => this.handleRoleChangeClick('basic', id)}>
        <SetPersonToBasicIcon />
      </IconButton>);
    }
  } 

  render() {

    if (!this.state.user) {
      return (<div style={{ display: 'none' }}>&nbsp;</div>);
    }
    else {
      return (
        <Drawer
          anchor='right'
          open={this.state.open}
          variant={'temporary'}
          sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: { xs: '100%', sm: 700 } } }}
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
              <ConfirmDelete id={this.props.user.id} theme={this.props.theme} onSuccess={this.handleOnCloseAfterDelete.bind(this)} onCancel={this.cancelDeleteCallback.bind(this)}></ConfirmDelete>
            </Box>
          </Box>

          <Box display={this.state.action === 'confirm-delete' ? 'none' : 'block'} sx={{ height: '100%', padding: 1 }} >
            <Box marginBottom={2} alignItems={'center'} justifyContent={'center'} component={CardActions}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: stringToColor(this.state.user.name) }}></Avatar>
            </Box>
            <Box marginBottom={4}>
              <Typography
                variant="h3"
                align={'center'}
                sx={{ fontWeight: 500, }}
              >
                {this.state.user.name}
              </Typography>
            </Box>            
            <Divider variant="middle" />
            <Box component={CardContent} padding={4}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <List>
                    <ListItem sx={{ paddingLeft: '0px' }}>
                      <ListItemIcon>
                        <EmailIcon color="primary" fontSize='large' />
                      </ListItemIcon>
                      <ListItemText primary={this.state.user.email} />
                    </ListItem>
                    <ListItem 
                      sx={{ paddingLeft: '0px' }}
                      secondaryAction={this.roleChangeButton(this.state.user.role, this.state.user.id)}
                    >
                      <ListItemIcon>
                        <RoleIcon color="primary" fontSize='large' />
                      </ListItemIcon>
                      <ListItemText 
                        primary={this.state.user.role}                        
                      />
                    </ListItem>
                    <ListItem sx={{ paddingLeft: '0px' }}>
                      <ListItemIcon>
                        <DateIcon color="primary" fontSize='large' />
                      </ListItemIcon>
                      <ListItemText 
                        primary={this.state.user.dateCreated}    
                        secondary={'Date created'}                    
                      />
                    </ListItem>
                    <ListItem sx={{ paddingLeft: '0px' }}>
                      <ListItemIcon>
                        <LastAttemptIcon color="primary" fontSize='large' />
                      </ListItemIcon>
                      <ListItemText 
                        primary={formatDate(this.state.user.dateLastAttempt, 'No login attempts')}    
                        secondary={'Last attempted login'}                    
                      />
                    </ListItem>
                    <ListItem sx={{ paddingLeft: '0px' }}
                      secondaryAction={this.lockedButton(this.state.user.isLocked, this.state.user.id)}                     
                    >
                      <ListItemIcon>
                        {this.lockedStatus(this.state.user.isLocked)}
                      </ListItemIcon>
                      <ListItemText
                        primary={this.state.user.isLocked ? 'Locked' : 'Not locked'}   
                        secondary={this.state.user.isLocked ? formatDate(this.state.user.dateLocked) : ''}                    
                      />
                    </ListItem>
                    <ListItem sx={{ paddingLeft: '0px' }}
                      secondaryAction={
                        <IconButton edge="end" aria-label="reset" onClick={(e: any) => this.handleResetClick(this.state.user.id)} sx={ this.state.user.status === 3 ? { display: 'flex' } : { display: 'none' }}>
                          <ResetIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        {this.statusIcon(this.state.user.status)}
                      </ListItemIcon>
                      <ListItemText primary={this.state.user.statusText} secondary={this.state.action === 'reset' ? 'User has been reset' : '' } />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box
            display={this.state.action === 'confirm-delete' ? 'none' : 'flex'}
            justifyContent={'flex-end'}
            sx={{ paddingBottom: '10px', marginRight: '20px', marginLeft: '20px' }}
            onClick={(e: any) => this.setState({ action: 'confirm-delete' })}
          >
            <Button variant="contained" startIcon={<DeleteIcon />} sx={{ width: '100%', background: this.props.theme.palette.grey[600] }}>
              Delete user
            </Button>
          </Box>
        </Drawer>
      );
    }
  }
}

export default EditUser;

interface IProps {
  onClose: () => void;
  theme: Theme;
  open: boolean;
  user: IUsers | any;
}

interface IEditUser {
  action: string,
  errorMsg: string;
  open: boolean;
  user: IUsers;
}