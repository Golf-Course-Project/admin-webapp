/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Pagination, IconButton, Typography, Tooltip, } from '@material-ui/core';
import Avatar from '../Avatar/Avatar';
import DestroyIcon from '@material-ui/icons/DeleteForever';
import RestoreIcon from '@material-ui/icons/Restore';

//import { MessageCode } from 'helpers/enums';
import { IListUsersRequest, IListUsersResponse, IUsers } from 'interfaces/user.admin.interfaces';
import UserAdminService from 'services/user.admin.service';
import { SkeletonTable } from 'common/components';
import { formatDate } from 'helpers/string.helper';
import { IApiResponse } from 'interfaces/api-response.interface';

class DeletedUsers extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  readonly _pageSize: number = 25;

  state: IList = {
    action: 'loading',
    errorMsg: '',
    data: [],
    pageCount: 1,
    paging: { currentPage: 1, spanStart: 1, spanEnd: this._pageSize },
    rowId: '',
  }

  componentDidMount() {
    this.load_users();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.searchCriteria !== this.props.searchCriteria) {
      this.load_users();
    }
  }

  private handleMouseEnter = (e: any, id: string) => {
    this.setState({ rowId: id });   
  }

  private handleMouseLeave = (e: any, id: string) => {
    this.setState({ rowId: '' });
  }  

  private handlePageChange = (e: React.ChangeEvent<HTMLButtonElement>, value: string) => {
    const next: string = '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>';
    const back: string = '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>';
    let current: number = 1;

    if (value !== undefined || value !== '') current = parseInt(value);
    if (isNaN(current)) current = this.state.paging.currentPage;
    if (e.target.innerHTML === next) current = this.state.paging.currentPage + 1;
    if (e.target.innerHTML === back) current = this.state.paging.currentPage - 1;

    const start: number = (current * this._pageSize) - this._pageSize + 1;
    const end: number = current * this._pageSize;

    this.setState({ paging: { currentPage: current, spanStart: start, spanEnd: end } });
  }

  private handleRestoreClick = (e: any, id: string) => {
    let client: UserAdminService | null = new UserAdminService();
   
    client.Restore(id).then(async (response: IApiResponse) => {
      if (response.success) {
        const list: IUsers[] = this.state.data.filter((x) => x.id !== id);
        this.setState({ data: list });  
      }
    }).catch((error: Error) => {
      console.log(error);
    });

    client = null;
  }

  private handleDeleteForeverClick = (e: any, id: string) => {
    let client: UserAdminService | null = new UserAdminService();
   
    client.DeleteForever(id).then(async (response: IApiResponse) => {
      if (response.success) {
        const list: IUsers[] = this.state.data.filter((x) => x.id !== id);
        this.setState({ data: list });  
      }
    }).catch((error: Error) => {
      console.log(error);
    });

    client = null;
  }

  private load_users = () => {
    const client: UserAdminService = new UserAdminService();
    const defaultBody: IListUsersRequest = { name: null, email: null, role: null, status: -1, isDeleted: true };
    let body: IListUsersRequest = this.props.searchCriteria != null ? this.props.searchCriteria : defaultBody;
    body.isDeleted = true;

    client.List(body).then(async (response: IListUsersResponse) => {
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

  render() {
    return (
      <Box>
        <Box sx={this.state.action === 'normal' ? { display: 'block' } : { display: 'none' }}>
          <Box marginBottom={4} sx={{ display: 'flex' }}>
            <TableContainer component={Paper} sx={this.state.data.length > 0 ? { display: 'flex' } : { display: 'none' }}>
              <Table sx={{ minWidth: 650 }} aria-label="deleted users">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ paddingLeft: '20px' }}>Name</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Last Login Attempt</TableCell>
                    <TableCell align="left">Date Deleted</TableCell>
                    <TableCell align="center"></TableCell>                   
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.filter((x) => x.rowNumber >= this.state.paging.spanStart && x.rowNumber <= this.state.paging.spanEnd && !x.isDirtyDeleted).map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      hover
                      onMouseEnter={(e: any) => this.handleMouseEnter(e, row.id) }
                      onMouseLeave={(e: any) => this.handleMouseLeave(e, row.id) }
                    >
                      <TableCell component="th" scope="row" sx={{ paddingLeft: '20px' }}>
                        <Avatar name={row.name} role={row.role} ></Avatar>
                      </TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{formatDate(row.dateLastAttempt)}</TableCell>
                      <TableCell align="left">{formatDate(row.dateDeleted)}</TableCell>
                      <TableCell align="center" sx={{ width: '130px'}}>
                        <div style={{ display: this.state.rowId === row.id ? 'flex' : 'none'}}>
                          <Tooltip title="Restore user" arrow>
                            <IconButton aria-label="restore user" onClick={(e: any) => this.handleRestoreClick(e, row.id)}>
                              <RestoreIcon />
                            </IconButton> 
                          </Tooltip>

                          <Tooltip title="Delete this user forever" arrow>
                            <IconButton aria-label="delete forever" onClick={(e: any) => this.handleDeleteForeverClick(e, row.id)}>
                              <DestroyIcon />
                            </IconButton>   
                          </Tooltip>
                        </div>
                      </TableCell>                     
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant={'h5'} sx={this.state.data.length <= 0 && this.state.action === 'normal' ? { fontWeight: 500, display: 'flex', textAlign: 'center' } : { display: 'none' }} gutterBottom align={'center'}>
                There are no deleted users to take care of
            </Typography>
          </Box>
          <Box>
            <Stack spacing={2} sx={this.state.pageCount > 1 ? { display: 'flex' } : { display: 'none' }} alignItems={'center'}>
              <Pagination count={this.state.pageCount} page={this.state.paging.currentPage} variant="outlined" onChange={(e: any) => this.handlePageChange(e, e.target.innerText)} hidePrevButton hideNextButton />
            </Stack>
          </Box>
        </Box>
        <Box>
          <SkeletonTable rows={5} columns={4} display={this.state.action === 'loading' ? true : false}></SkeletonTable>
        </Box>
      </Box>
    );
  }
}

export default DeletedUsers;

interface IProps {
  callback: () => void;
  theme: Theme;
  searchCriteria: any;
}

interface IList {
  action: string,
  errorMsg: string;
  data: IUsers[];
  pageCount: number;
  paging: IPaging;
  rowId: string;
}

interface IPaging {
  currentPage: number;
  spanStart: number;
  spanEnd: number;
}
