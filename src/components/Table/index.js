import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const MyTable = (props) => {
  return (
    <TableContainer>
      <Table
        sx={{ minWidth: 650, width: "90%", margin: "0 5% 0 5%" }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow key={"#key-head"}>
            {props.columns.map((c) => {
              return (
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  {c}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {Object.keys(row).map((r) => (
                <TableCell align="left">{row[r]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTable;
