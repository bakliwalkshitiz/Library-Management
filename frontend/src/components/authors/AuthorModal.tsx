import { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { Author, AuthorRequest } from "../../types/author";
import { addAuthor, updateAuthor } from "../../services/authorService";

interface Props {
    open: boolean;
    onClose: () => void;
    onAuthorAdded: () => void;
    author?: Author | null;
}

export default function AuthorModal({ open, onClose, onAuthorAdded, author }: Props) {
    const { control, handleSubmit, reset } = useForm<AuthorRequest>({
        defaultValues: {
            name: "",
            email: "",
        },
    });

    const onSubmit = async (data: AuthorRequest) => {
        try {
            if (author) {
                await updateAuthor(author.id, data);
                toast.success("Author Updated Successfully");
            } else {
                await addAuthor(data);
                toast.success("Author Added Successfully");
            }

            reset();
            onAuthorAdded();
            onClose();
        } catch {
            toast.error(author ? "Failed to Update Author" : "Failed to Add Author");
        }
    };

    useEffect(() => {
        if (author) {
            reset({ name: author.name, email: author.email });
        } else {
            reset({ name: "", email: "" });
        }
    }, [author, open, reset]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{author ? "Edit Author" : "Add Author"}</DialogTitle>
            <DialogContent>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Name"
                            fullWidth
                            margin="normal"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email",
                        },
                    }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Email"
                            fullWidth
                            margin="normal"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
