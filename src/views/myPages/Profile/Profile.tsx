import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '../../../common/Container';
import { Avatar, MyInformation } from './components';
import { IGetMyProfileResponse, IMyProfile } from 'interfaces/user.profile.interfaces';
import UserProfileService from 'services/user.profile.service';

const Profile = () => {
  const theme: any = useTheme();
  const [myProfileData, setMyPofileData] = useState({ name: '', email: '', avatar_url: '', isLocked: false } as IMyProfile);

  useEffect(() => {
    const client: UserProfileService = new UserProfileService();

    client.GetMyProfile().then(async (response: IGetMyProfileResponse) => {
      if (response.success) {           
        setMyPofileData((myProfileData) => response.value);                 
      }
    }).catch((error: Error) => {
      console.log(error);
    });
  }, []);

  //  const load_users = () => {      
  //    const client: UserProfileService = new UserProfileService(); 
  //
  //    client.GetMyProfile().then(async (response: IGetMyProfileResponse) => {     
  //      if (response.success) {      
  //        console.log('success');          
  //      }
  //    }).catch((error: Error) => {      
  //      console.log(error);
  //    });
  //  };
  //  
  //  load_users();

  return (<Box>

    <Box bgcolor={theme.palette.alternate.main} position={'relative'}>
      <Container position="relative" zIndex={2}>
        <MyInformation theme={theme} data={myProfileData} />
      </Container>
    </Box>
    <Box>
      <Container position="relative" zIndex={2}>
        <Avatar name="Dan Hellem" />
      </Container>
    </Box>
  </Box>
  );
};

export default Profile;
