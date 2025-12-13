import React from 'react';
import { Box, Grid, Skeleton } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

interface IProps {
  display: boolean;
  theme: Theme;
}

class EditBlogSkeleton extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};

  render() {
    return (
      <Box padding={4} sx={this.props.display ? { display: 'block' } : { display: 'none' }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <form noValidate autoComplete="off">
              <Box display="flex" flexDirection={'column'}>
                <Grid container spacing={1}>
                  {/* Blog ID Field */}
                  <Grid item xs={12} md={12} sx={{ marginBottom: '25px' }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: '4px' }} />
                  </Grid>
                  {/* Title Field */}
                  <Grid item xs={12} md={12} sx={{ marginBottom: '25px' }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: '4px' }} />
                  </Grid>
                  {/* Page Name Field */}
                  <Grid item xs={12} md={12} sx={{ marginBottom: '25px' }}>
                    <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: '4px' }} />
                  </Grid>
                  {/* Short Description Field */}
                  <Grid item xs={12} md={12} sx={{ marginBottom: '25px' }}>
                    <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: '4px' }} />
                  </Grid>
                  {/* Description Section */}
                  <Grid item xs={12} md={12} sx={{ marginTop: '15px' }}>                   
                    {/* Editor/Preview Area */}
                    <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: '4px' }} />
                  </Grid>
                  {/* Save Button */}
                  <Grid item xs={12} md={12} sx={{ marginTop: '20px' }}>
                    <Box
                      display={'flex'}
                      justifyContent={'flex-start'}
                      sx={{ paddingBottom: '10px' }}
                    >
                      <Skeleton 
                        variant="rectangular" 
                        width={200} 
                        height={36} 
                        sx={{ borderRadius: '4px' }} 
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default EditBlogSkeleton;
