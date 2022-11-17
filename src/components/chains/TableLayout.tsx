import { ComponentType, ReactNode, useId, useMemo, useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, SxProps } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, Menu } from "@mui/material";
import { Theme } from "@mui/system";

interface IStyledTableCellProps {
  inspectorTable?: boolean;
}

const StyledTableCell = styled(TableCell)<IStyledTableCellProps>(({ theme, inspectorTable }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: inspectorTable ? 'bold' : undefined,
    padding: inspectorTable ? theme.spacing(1) : undefined,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: inspectorTable ? theme.spacing(1) : undefined,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export type ITableLayoutProps<T extends DataSet> = {
  RowMenu?: ComponentType<ITableLayoutRowMenuProps<T>>;
  inspectorTable?: boolean;
  sx?: SxProps<Theme>;
} & (
  | {
      rows: T[];
      columns: ColumnMap<T>;
      keyField: keyof T;
    }
  | {
      rows: (T & { id: string })[];
      columns: ColumnMap<T & { id: string }>;
    }
);

export interface ITableLayoutRowMenuProps<T extends DataSet> {
  row: T;
  data: T[];
  index: number;
}

type DataSet = {
  [key: PropertyKey]: ReactNode;
};

/** Mapping from keys of T to display values/labels. */
type ColumnMap<T extends DataSet> = {
  [column in keyof T]?: string;
};

export default function TableLayout<T extends DataSet>(
  props: ITableLayoutProps<T>
) {
  const { rows, columns, RowMenu, inspectorTable, sx } = props;
  const keyField = "keyField" in props ? props.keyField : ("id" as keyof T);
  
  if (rows.find(row => typeof row[keyField] !== 'string')) {
    console.warn(`TableLayout keyField ${keyField.toString()} is not a string and will likely cause issues. To avoid this warning, extract a string key from the field.`);
  }

  const keys = useMemo(
    () => Object.keys(columns) as (keyof T & string)[],
    [columns]
  );
  const labels = useMemo(() => Object.values(columns) as string[], [columns]);

  return (
    <TableContainer component={Paper} sx={sx}>
      <Table sx={{ width: "100%" }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {[
              ...labels.map((label, idx) => (
                <StyledTableCell
                  key={keys[idx]}
                  align="center"
                  inspectorTable={inspectorTable}
                >
                  {label}
                </StyledTableCell>
              )),
              ...(RowMenu ? [<StyledTableCell key="t1rowmenu" />] : []),
            ]}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <T1TableRow
              {...{
                data: rows,
                row,
                index,
                keys,
                RowMenu,
              }}
              key={`${row[keyField]}`}
              inspectorTable={inspectorTable}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

interface T1TableRowProps<T extends DataSet> {
  data: T[];
  row: T;
  index: number;
  keys: (keyof T & string)[];
  inspectorTable?: boolean;
  RowMenu: ITableLayoutProps<T>["RowMenu"];
}

function T1TableRow<T extends DataSet>(props: T1TableRowProps<T>) {
  const { data, row, index, keys, RowMenu, inspectorTable } = props;

  const ref = useRef<HTMLButtonElement>(null);
  const menuButtonId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <StyledTableRow>
      {keys.map((key) =>
        <StyledTableCell key={key} align="center" component="th" scope="row" inspectorTable>
          {row[key]}
        </StyledTableCell>
      )}
      {RowMenu && (
        <StyledTableCell align="center" component="th" scope="row">
          <IconButton
            ref={ref}
            id={menuButtonId}
            disabled={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <MoreVertIcon fontSize="inherit" />
          </IconButton>
          <Menu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchorEl={ref.current}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            aria-labelledby={menuButtonId}
          >
            <RowMenu {...{ data, row, index }} />
          </Menu>
        </StyledTableCell>
      )}
    </StyledTableRow>
  );
}
