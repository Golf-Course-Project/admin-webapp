import React from 'react';
import { Skeleton, Box, Grid, Card, CardContent, Typography, } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

class TokensSkeleton extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  state: IComponent = {
    items_array: Array.from(Array(this.props.items), (_, i) => i + 1),   
  }

  render() {
    return (
      <Grid container spacing={2} sx={this.props.display ? { display: 'flex' } : { display: 'none' }}>
        {this.state.items_array.map((item, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Box
              component={'a'}
              href={'#0'}
              display={'block'}
              width={'100%'}
              height={'100%'}
              sx={{
                textDecoration: 'none',
                transition: 'all .2s ease-in-out',
                '&:hover': {
                  transform: `translateY(-${this.props.theme.spacing(1 / 2)})`,
                },
              }}
            >
              <Box
                component={Card}
                width={'100%'}
                height={'100%'}
                borderRadius={3}
              >
                <Box
                  component={CardContent}
                  height={'100%'}
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                >
                  <Skeleton variant="circular" width={90} height={90} />
                  <Box
                    component={Typography}
                    variant={'h6'}
                    gutterBottom
                    fontWeight={500}
                  >
                    <Skeleton variant="text" width={160} height={50} />
                  </Box>
                  <Typography color="text.secondary">
                    <Skeleton variant="text" width={300} />
                  </Typography>
                  <Typography color="text.secondary">
                    <Skeleton variant="text" width={300} />
                  </Typography>
                  <Typography color="text.secondary">
                    <Skeleton variant="text" width={300} />
                  </Typography>
                  <Box flexGrow={1} />
                  <Box justifyContent={'center'} marginTop={2}>
                    <Skeleton variant="text" width={120} height={80} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }
}

interface IProps {
  items: number;  
  display: boolean;
  theme: Theme;
}

interface IComponent {
  items_array: number[]; 
}

export default TokensSkeleton;
