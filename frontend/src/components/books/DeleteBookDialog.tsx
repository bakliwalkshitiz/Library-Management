import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";

interface Props {

    open: boolean;

    onClose: () => void;

    onConfirm: () => void;

}

export default function DeleteBookDialog({
    open,
    onClose,
    onConfirm
}: Props) {

    return (

        <Dialog open={open} onClose={onClose}>

            <DialogTitle>

                Delete Book

            </DialogTitle>

            <DialogContent>

                <Typography>

                    Are you sure you want to delete this book?

                </Typography>

            </DialogContent>

            <DialogActions>

                <Button onClick={onClose}>

                    Cancel

                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                >

                    Delete

                </Button>

            </DialogActions>

        </Dialog>

    );

}