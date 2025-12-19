import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import TokensSkeleton from './TokensSkeleton';
import { stringToColor, formatDateAndTime } from 'helpers/string.helper';

//import { MessageCode } from 'helpers/enums';
import { ITokens, IListTokensResponse } from 'interfaces/token.admin.interfaces';
import TokenAdminService from 'services/token.admin.service';
import { IApiResponse } from 'interfaces/api-response.interface';

class ActiveTokens extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  readonly _pageSize: number = 25;

  state: IActiveTokensPage = {
    action: 'loading',
    errorMsg: '',
    data: [],
    deletedTokenId: '',
    selectedTokenId: '',
    pageCount: 1,
    paging: { currentPage: 1, spanStart: 1, spanEnd: this._pageSize },
  }

  componentDidMount() {
    this.load_tokens();
  }

  private load_tokens = () => {
    const client: TokenAdminService = new TokenAdminService();

    client.List().then(async (response: IListTokensResponse) => {
      if (response.messageCode === 500) {
        window.location.href = './login';
      }

      if (response.success) {
        this.setState({
          paging: {
            currentPage: 1,
            spanStart: 1,
            spanEnd: this._pageSize
          },
          pageCount: Math.ceil(response.count / this._pageSize),
          data: response.value,
          action: 'normal'
        });
      }
    }).catch((error: Error) => {
      console.log(error);
    });
  }

  private handleDeleteClick = (id: string) => {
    let client: TokenAdminService | null = new TokenAdminService();  
    
    client.Delete(id).then(async (response: IApiResponse) => {
      if (response.success) {
        this.setState({ selectedTokenId: '', deletedTokenId: id });   
        this.load_tokens();
      }
    }).catch((error: Error) => {
      console.log(error);
    });

    client = null;
  }

  render() {
    return (
      <Box>
        <Box marginBottom={4}>
          <Box
            component={Typography}
            fontWeight={700}
            variant={'h3'}
            gutterBottom
            align={'center'}
          >
            Active user tokens
          </Box>
        </Box>
        <Box sx={this.state.action === 'normal' ? { display: 'block' } : { display: 'none' }}>
          <Grid container spacing={2}>
            {this.state.data.map((item, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Box
                  component={'a'}
                  href={'#0'}
                  display={'block'}
                  width={'100%'}
                  height={'100%'}
                  sx={{
                    textDecoration: 'none',                   
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
                      <Box
                        component={Avatar}
                        width={90}
                        height={90}
                        marginBottom={2}
                        sx={{ bgcolor: stringToColor(item.name) }}
                      />
                      <Box
                        component={Typography}
                        variant={'h6'}
                        gutterBottom
                        fontWeight={500}
                      >
                        {item.name}
                      </Box>
                      <Typography color="text.secondary">
                        {item.email}
                      </Typography> 
                      <Typography color="text.secondary">
                        Updated: {formatDateAndTime(item.lastChecked)}
                      </Typography>
                      <Typography color="text.secondary">
                        Expires: {formatDateAndTime(item.expiration)}
                      </Typography>
                      <Box flexGrow={1} />
                      <Box justifyContent={'center'} marginTop={2}>
                        <Button size="large" variant={'contained'} fullWidth startIcon={<DeleteIcon />} onClick={(e: any) => this.handleDeleteClick(item.id)}>
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box>
          <TokensSkeleton items={3} theme={this.props.theme} display={this.state.action === 'loading' ? true : false}></TokensSkeleton>                 
        </Box>
      </Box>
    );
  }
}

export default ActiveTokens;

interface IProps {
  theme: Theme;
}

interface IActiveTokensPage {
  action: string,
  errorMsg: string;
  data: ITokens[];
  pageCount: number;
  paging: IPaging;  
  selectedTokenId: string;
  deletedTokenId: string;
}

interface IPaging {
  currentPage: number;
  spanStart: number;
  spanEnd: number;
}