import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import generateRandomKey from "../../utils/generateRandomKey";

import classes from "./table.module.css";

const MyTable = (props) => {
  return (
    <TableContainer>
      <Table
        key={generateRandomKey()}
        sx={{ minWidth: props.small ? 0 : 650, width: "90%", margin: "0 5% 0 5%" }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow key={"#key-head"}>
            {props.columns.map((c) => {
              return (
                <TableCell
                  key={generateRandomKey()}
                  align="left"
                  style={{ fontWeight: "bold" }}
                >
                  {c}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow
              onClick={() => {
                if(props.redirect) window.location = `/curated-list/${row["id"]}`;
                if(props.newTab) {
                  window.umami.track(`user-${row["platform"]}-problem-link`);
                  window.open(row["link"], '_blank');
                }
              }}
              key={generateRandomKey()}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className={(props.redirect || props.newTab) ? classes.row : null}
            >
              {Object.keys(row).map((r) => {
                if (props.dontShow && props.dontShow.includes(r)) {
                  return null;
                }
                return (
                  <TableCell key={generateRandomKey()} align="left">
                    {row[r]}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTable;
