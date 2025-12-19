import React from 'react';
import MyAvatar from '@material-ui/core/Avatar';
import { Box, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { stringToColor } from 'helpers/string.helper';


function stringAvatar(name: string, size: number) {
  return {
    sx: {
      bgcolor: stringToColor(name),    
      width: size,
      height: size,
    },
    //children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const Avatar = ({ name, role, size = 40 }: IProps) => {
  return (
    <Box component={ListItem} disableGutters width={'auto'}>
      <ListItemAvatar>
        <MyAvatar {...stringAvatar(name, size)} />
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={role}
      />
    </Box>
  );
};

interface IProps {
  name: string;
  role: string;
  size?: number;
}

export default Avatar;