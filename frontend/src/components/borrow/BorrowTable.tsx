import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, IconButton, Tooltip, Chip,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Borrow } from "../../types/borrow";

interface Props {
  borrows: Borrow[];
  onReturn: (borrow: Borrow) => void;
  onDelete: (borrow: Borrow) => void;
}

export default function BorrowTable({ borrows, onReturn, onDelete }: Props) {
  const isOverdue = (returnDate: string | null) =>
    returnDate ? new Date(returnDate) < new Date() : false;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Borrower</TableCell>
            <TableCell>Book</TableCell>
            <TableCell>Borrow Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {borrows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                No borrow records found
              </TableCell>
            </TableRow>
          ) : (
            borrows.map((borrow) => {
              const overdue = isOverdue(borrow.returnDate);
              return (
                <TableRow key={borrow.id}>
                  <TableCell>#{borrow.id}</TableCell>
                  <TableCell>{borrow.borrowerName}</TableCell>
                  <TableCell>{borrow.bookTitle}</TableCell>
                  <TableCell>
                    {borrow.borrowDate
                      ? new Date(borrow.borrowDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {borrow.returnDate
                      ? new Date(borrow.returnDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={borrow.returned ? "Returned" : overdue ? "Overdue" : "Active"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: borrow.returned ? "rgba(148,163,184,0.2)" : overdue ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)",
                        color: borrow.returned ? "#64748b" : overdue ? "#ef4444" : "#22c55e",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {!borrow.returned && (
                      <Tooltip title="Return Book">
                        <IconButton onClick={() => onReturn(borrow)} color="primary">
                          <UndoIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete Record">
                      <IconButton onClick={() => onDelete(borrow)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
