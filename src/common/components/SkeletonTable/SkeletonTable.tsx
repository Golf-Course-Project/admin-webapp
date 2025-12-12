import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton, Box, } from '@material-ui/core';

class SkeletonTable extends React.Component<IProps, {}> {
  static defaultProps: Partial<IProps> = {
    columnWidths: [],
    minWidth: 650
  };

  state: IComponent = {
    row_array: Array.from(Array(this.props.rows), (_, i) => i + 1),
    column_array: Array.from(Array(this.props.columns), (_, i) => i + 1),
  }

  render() {
    return (
      <Box marginBottom={2} sx={this.props.display ? { display: 'flex' } : { display: 'none' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: this.props.minWidth || 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {this.state.column_array.map((i) => (
                  <TableCell key={i} sx={this.props.columnWidths && this.props.columnWidths[i - 1] ? { width: this.props.columnWidths[i - 1] } : {}}><Skeleton animation="wave" /></TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.row_array.map((i) => (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  {this.state.column_array.map((x) => (
                    <TableCell key={x} sx={this.props.columnWidths && this.props.columnWidths[x - 1] ? { width: this.props.columnWidths[x - 1] } : {}}><Skeleton animation="wave" /></TableCell>
                  ))}                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}

interface IProps {
  rows: number;
  columns: number;
  display: boolean;
  columnWidths?: string[];
  minWidth?: number;
}

interface IComponent {
  row_array: number[];
  column_array: number[];
}

export default SkeletonTable;
