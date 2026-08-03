import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    TableContainer,
} from "@mui/material";

import type { Book } from "../../types/book";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface Props {
    books: Book[];
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
}

export default function BookTable({ books, onEdit, onDelete }: Props) {

    return (

        <TableContainer component={Paper}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Categories</TableCell>
                        <TableCell align="center">Actions</TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {books.map((book) => (

                        <TableRow key={book.id}>

                            <TableCell>{book.id}</TableCell>

                            <TableCell>{book.title}</TableCell>

                            <TableCell>{book.authorName}</TableCell>

                            <TableCell>

                                {book.categories.join(", ")}

                            </TableCell>

                            <TableCell align="center">

                                <Tooltip title="Edit">
                                    <IconButton onClick={() => onEdit(book)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Delete">
                                    <IconButton onClick={() => onDelete(book)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Tooltip>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </TableContainer>

    );
}