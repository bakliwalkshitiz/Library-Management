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
import type { Category, CategoryRequest } from "../../types/category";
import { addCategory, updateCategory, getCategories } from "../../services/categoryService";

import { useAuth } from "../../context/AuthContext";

interface Props {
    open: boolean;
    onClose: () => void;
    onCategoryAdded: () => void;
    category?: Category | null;
}

export default function CategoryModal({ open, onClose, onCategoryAdded, category }: Props) {
    const { user } = useAuth();
    const { control, handleSubmit, reset } = useForm<CategoryRequest>({
        defaultValues: { name: "" },
    });

    const onSubmit = async (data: CategoryRequest) => {
        try {
            if (category) {
                await updateCategory(category.id, data);
                if (user?.id) {
                    const localSaved: string[] = JSON.parse(localStorage.getItem(`publisher_categories_${user.id}`) || "[]");
                    const idx = localSaved.indexOf(category.name);
                    if (idx !== -1) {
                        localSaved[idx] = data.name.trim();
                    } else {
                        localSaved.push(data.name.trim());
                    }
                    localStorage.setItem(`publisher_categories_${user.id}`, JSON.stringify(localSaved));

                    const localIds: number[] = JSON.parse(localStorage.getItem(`publisher_category_ids_${user.id}`) || "[]");
                    if (!localIds.includes(category.id)) {
                        localIds.push(category.id);
                        localStorage.setItem(`publisher_category_ids_${user.id}`, JSON.stringify(localIds));
                    }
                }
                toast.success("Category Updated Successfully");
            } else {
                await addCategory(data);
                if (user?.id) {
                    const localSaved: string[] = JSON.parse(localStorage.getItem(`publisher_categories_${user.id}`) || "[]");
                    if (!localSaved.includes(data.name.trim())) {
                        localSaved.push(data.name.trim());
                        localStorage.setItem(`publisher_categories_${user.id}`, JSON.stringify(localSaved));
                    }
                    try {
                        const catRes = await getCategories();
                        const created = (catRes.data || []).find((c: Category) => c.name === data.name.trim());
                        if (created) {
                            const localIds: number[] = JSON.parse(localStorage.getItem(`publisher_category_ids_${user.id}`) || "[]");
                            if (!localIds.includes(created.id)) {
                                localIds.push(created.id);
                                localStorage.setItem(`publisher_category_ids_${user.id}`, JSON.stringify(localIds));
                            }
                        }
                    } catch {}
                }
                toast.success("Category Added Successfully");
            }

            reset();
            onCategoryAdded();
            onClose();
        } catch {
            toast.error(category ? "Failed to Update Category" : "Failed to Add Category");
        }
    };

    useEffect(() => {
        if (category) {
            reset({ name: category.name });
        } else {
            reset({ name: "" });
        }
    }, [category, open, reset]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogContent>
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Category name is required" }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Category Name"
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
