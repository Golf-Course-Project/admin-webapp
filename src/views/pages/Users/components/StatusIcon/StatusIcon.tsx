import React from 'react';
import InActiveIcon from '@material-ui/icons/VisibilityOff';
import BlockedIcon from '@material-ui/icons/Block';
import LockIcon from '@material-ui/icons/Lock';

const StatusIcon = ({ status, isLocked }: IProps) => {
  
  if(isLocked)
  {
    return (      
      <LockIcon color="disabled" />     
    );
  }  
  else if (status === 3)
  {
    return (      
      <BlockedIcon color="disabled" />     
    );
  }  
  else if(status === 4) {  
    return (      
      <InActiveIcon color="disabled" />     
    );
  }
  else{
    return (<div></div>);
  }
};

interface IProps {
  status: number;
  isLocked: boolean;
}

export default StatusIcon;