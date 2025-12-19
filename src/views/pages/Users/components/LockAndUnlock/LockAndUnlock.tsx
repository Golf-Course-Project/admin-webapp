import React from 'react';
import UnLockIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import { IconButton } from '@material-ui/core';

import UserAdminService from 'services/user.admin.service';
import { IApiResponse } from 'interfaces/api-response.interface';
import { IUsers } from 'interfaces/user.admin.interfaces';

class LockAndUnlock extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  
  state: ILockAndUnlock = {
    action: 'normal',
    errorMsg: '',
    isLocked: this.props.user.isLocked,
  }

  componentDidMount() {

  }

  handleUnLockClick(id: string) {  
    let client: UserAdminService | null = new UserAdminService();  
    let user = this.props.user;  
    
    client.UnLock(id).then(async (response: IApiResponse) => {
      if (response.success) {   
        this.setState({ isLocked: false });  
        user.isLocked = false;
        
        if (typeof this.props.callback == 'function') this.props.callback(user);
      }
    }).catch((error: Error) => {
      console.log(error);
    });
    
    client = null;
  }

  handleLockClick(id: string) {   
    let client: UserAdminService | null = new UserAdminService();    
    let user = this.props.user;  

    client.Lock(id).then(async (response: IApiResponse) => {
      if (response.success) {   
        this.setState({ isLocked: true });         
        user.isLocked = true;
        
        if (typeof this.props.callback == 'function') this.props.callback(user);
      }
    }).catch((error: Error) => {
      console.log(error);
    });
    
    client = null;
  }

  render() {
    
    if(this.state.isLocked)
    {    
      return (
        <IconButton aria-label="unlock user" onClick={(e: any) => this.handleUnLockClick(this.props.user.id)}>
          <UnLockIcon />
        </IconButton>
      );
    }
    else {
      return (
        <IconButton aria-label="lock user" onClick={(e: any) => this.handleLockClick(this.props.user.id)}>
          <LockIcon />
        </IconButton>
      );
    }
  }
}

export default LockAndUnlock;

interface IProps {
  callback: (user: IUsers) => void;
  user: IUsers;
}

interface ILockAndUnlock {
  action: string,
  errorMsg: string;
  isLocked: boolean;
}
