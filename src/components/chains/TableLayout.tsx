import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface IProps {
  rows: any;
  columns: any;
}

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TableLayout({rows, columns}: IProps) {
  const rowKeys = Object.keys(rows[0]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{width: "100%"}} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((col: string) => (
              <StyledTableCell align="center">{col}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => {
            return (
              <StyledTableRow key={Math.random()}>
                {rowKeys.map((rowkey) => {
                  // @ts-ignore
                  return (
                    <StyledTableCell align="center" component="th" scope="row">
                      {
                        //@ts-ignore
                        row[rowkey]
                      }
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
