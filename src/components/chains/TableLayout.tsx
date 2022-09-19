import { ReactNode, useMemo } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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

export type ITableLayoutProps<T extends DataSet> =
  {
    rowMenu?: ReactNode;
  } & (
  | {
      rows: T[];
      columns: ColumnMap<T>;
      keyField: keyof T;
    }
  | {
      rows: (T & {id: string})[];
      columns: ColumnMap<T & {id: string}>;
    }
  )

type DataSet = {
  [key: string]: string;
}

/** Mapping from keys of T to display values/labels. */
type ColumnMap<T extends DataSet> = {
  [column in keyof T]?: string;
}

export default function TableLayout<T extends DataSet>(props: ITableLayoutProps<T>) {
  const {
    rows,
    columns,
  } = props;
  const keyField = 'keyField' in props ? props.keyField : 'id' as keyof T;
  
  const keys   = useMemo(() => Object.keys(columns) as (keyof T & string)[], [columns]);
  const labels = useMemo(() => Object.values(columns) as string[], [columns]);
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{width: "100%"}} aria-label="customized table">
        <TableHead>
          <TableRow>
            {labels.map((label, idx) => (
              <StyledTableCell key={keys[idx]} align="center">{label}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: T) => (
            <StyledTableRow key={row[keyField]}>
              {keys.map(key => (
                <StyledTableCell align="center" component="th" scope="row">
                  {row[key]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
