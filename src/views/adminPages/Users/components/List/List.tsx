/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Box from '@material-ui/core/Box';
import { Theme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, Pagination, IconButton, } from '@material-ui/core';
import EditRowIcon from '@material-ui/icons/ModeEditOutlineOutlined';
import Avatar from '../Avatar/Avatar';

//import { MessageCode } from 'helpers/enums';
import { IListUsersRequest, IListUsersResponse, IUserList } from 'interfaces/user.admin.interfaces';
import UserAdminService from 'services/user.admin.service';
import StatusIcon from '../StatusIcon';
import Edit from '../Edit';
import LockAndUnlock from '../LockAndUnlock';
import { TableSkeleton } from 'common/components';
import { formatDate } from 'helpers/string.helper';

class List extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {};
  readonly _pageSize: number = 25;

  state: IList = {
    action: 'loading',
    errorMsg: '',
    data: [],   
    pageCount: 1,
    paging: { currentPage: 1, spanStart: 1, spanEnd: this._pageSize },
    rowId: '',
    selectedRowId: '',
    openSideBar: false,
    selectedUser: null,
  }

  componentDidMount() {
    this.load_users();    
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.searchCriteria !== this.props.searchCriteria) {    
      this.load_users();    
    }
  }

  //shouldComponentUpdate(nextProps: any, nextState: any) {
  //  console.log(nextProps);
  //  console.log(nextState);

  //  if (nextProps.value !== this.props.value) {
  //    return true;
  //  } else {
  //    return false;
  //  }
  //}

  private handlePageChange = (e: React.ChangeEvent<HTMLButtonElement>, value: string) => {
    const next: string = '<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>';
    const back: string = '<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>';
    let current: number = 1;    

    if (value !== undefined || value !== '' ) current = parseInt(value);
    if (isNaN(current)) current = this.state.paging.currentPage;
    if (e.target.innerHTML === next) current = this.state.paging.currentPage + 1; 
    if (e.target.innerHTML === back) current = this.state.paging.currentPage - 1;       

    const start: number = (current * this._pageSize) - this._pageSize + 1;
    const end: number = current * this._pageSize;

    this.setState({ paging: { currentPage: current, spanStart: start, spanEnd: end } });
  }

  private handleMouseEnter = (e: any, id: string) => {
    this.setState({ rowId: id });

    if (id === this.state.selectedRowId) {
      this.setState({ selectedRowId: '' });
    }
  }

  private handleMouseLeave = (e: any, id: string) => {
    this.setState({ rowId: '' });
  }  

  private handleSidebarClose = () => {
    this.setState({ openSideBar: false });
  };

  private handleSidebarOpen = (user: IUserList) => {  
    user.isDirtyDeleted = false;    
    this.setState({ openSideBar: true, selectedUser: user, selectedRowId: user.id });   
  };  

  //private callbackLockAndUnLockSuccess = (row: IUserList): void => {    
  //  console.log(row);
  //};

  private load_users = () => {
    const client: UserAdminService = new UserAdminService();  
    const defaultBody: IListUsersRequest = { name: null, email: null, role: null, status: -1 }; 
    let body: IListUsersRequest = this.props.searchCriteria != null ? this.props.searchCriteria : defaultBody;   

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
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ paddingLeft: '20px'}}>Name</TableCell>                    
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Status</TableCell>
                    <TableCell align="left">Last Login Attempt</TableCell>
                    <TableCell align="center">&nbsp;</TableCell> 
                    <TableCell align="center">&nbsp;</TableCell>                                       
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.filter((x) => x.rowNumber >= this.state.paging.spanStart && x.rowNumber <= this.state.paging.spanEnd).map((row) => (                    
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: row.isDirtyDeleted === true ? 'rgb(22, 11, 11)' : '' }}
                      hover
                      onMouseEnter={(e: any) => this.handleMouseEnter(e, row.id) }
                      onMouseLeave={(e: any) => this.handleMouseLeave(e, row.id) }
                      selected={this.state.selectedRowId === row.id && row.isDirtyDeleted !== true ? true : false}                                      
                    >
                      <TableCell component="th" scope="row" sx={{ paddingLeft: '20px'}}>
                        <Avatar name={row.name} role={row.role} ></Avatar>
                      </TableCell>                                        
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.statusText}</TableCell>     
                      <TableCell align="left">{formatDate(row.dateLastAttempt)}</TableCell>                  
                      <TableCell align="center" sx={{ width: '130px'}}>
                        <div style={{ display: this.state.rowId === row.id && row.isDirtyDeleted !== true ? 'flex' : 'none'}}>
                          <IconButton aria-label="edit user" onClick={(e:any) => this.handleSidebarOpen(row)}>
                            <EditRowIcon />
                          </IconButton>                       
                          <LockAndUnlock user={row} />
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div style={{ display: row.isDirtyDeleted !== true ? 'flex' : 'none'}}>
                          <StatusIcon status={row.status} isLocked={row.isLocked} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box>
            <Stack spacing={2} sx={this.state.pageCount > 1 ? { display: 'flex' } : { display: 'none' }} alignItems={'center'}>
              <Pagination count={this.state.pageCount} page={this.state.paging.currentPage} variant="outlined" onChange={(e: any) => this.handlePageChange(e, e.target.innerText)} hidePrevButton hideNextButton />
            </Stack>
          </Box>
        </Box>
        <Box>
          <TableSkeleton rows={10} columns={5} display={this.state.action === 'loading' ? true : false}></TableSkeleton>                 
        </Box>
        <Edit theme={this.props.theme} open={this.state.openSideBar} user={this.state.selectedUser} onClose={this.handleSidebarClose}></Edit>
      </Box>
    );
  }
}

export default List;

interface IProps {
  callback: () => void;
  theme: Theme;
  searchCriteria: any;
}

interface IList {
  action: string,
  errorMsg: string;
  data: IUserList[]; 
  pageCount: number;
  paging: IPaging;
  rowId: string;
  selectedRowId:string,
  openSideBar: boolean;
  selectedUser: IUserList | null;
}

interface IPaging {
  currentPage: number;
  spanStart: number;
  spanEnd: number;
}
