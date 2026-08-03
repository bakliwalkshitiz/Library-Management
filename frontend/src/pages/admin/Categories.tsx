import { useEffect, useState } from "react";
import {
    Button,
    Paper,
    Typography,
    Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-hot-toast";
import type { Category } from "../../types/category";
import type { Book } from "../../types/book";
import { getCategories, deleteCategory } from "../../services/categoryService";
import { getMyBooks } from "../../services/bookService";
import { useAuth } from "../../context/AuthContext";
import CategoryModal from "../../components/categories/CategoryModal";
import CategoryTable from "../../components/categories/CategoryTable";
import DeleteCategoryDialog from "../../components/categories/DeleteCategoryDialog";

export default function Categories() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [publisherBooks, setPublisherBooks] = useState<Book[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const isPublisher = user?.role === "PUBLISHER";

    const loadData = async () => {
        try {
            const catRes = await getCategories();
            setCategories(catRes.data || []);

            if (isPublisher) {
                const bookRes = await getMyBooks();
                setPublisherBooks(bookRes.data || []);
            }
        } catch {
            toast.error("Failed to load categories");
        }
    };

    const handleDeleteClick = (category: Category) => {
        setSelectedCategory(category);
        setDeleteOpen(true);
    };

    const handleEditClick = (category: Category) => {
        setEditingCategory(category);
        setOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCategory) return;

        try {
            await deleteCategory(selectedCategory.id);
            toast.success("Category Deleted Successfully");
            loadData();
        } catch {
            toast.error("Delete Failed");
        }

        setDeleteOpen(false);
    };

    useEffect(() => {
        loadData();
    }, [user?.role]);

    const localSavedCategories: string[] = isPublisher && user?.id
        ? JSON.parse(localStorage.getItem(`publisher_categories_${user.id}`) || "[]")
        : [];
    const localSavedCatIds: number[] = isPublisher && user?.id
        ? JSON.parse(localStorage.getItem(`publisher_category_ids_${user.id}`) || "[]")
        : [];

    const displayedCategories = isPublisher
        ? categories.filter((category) =>
            localSavedCategories.includes(category.name) ||
            localSavedCatIds.includes(category.id) ||
            publisherBooks.some((b) =>
                b.categories?.some((cName) => cName === category.name)
            )
        )
        : categories;

    return (
        <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">Categories</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpen(true)}
                >
                    Add Category
                </Button>
            </Box>

            <CategoryTable
                categories={displayedCategories}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            <CategoryModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditingCategory(null);
                }}
                onCategoryAdded={loadData}
                category={editingCategory}
            />

            <DeleteCategoryDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </Paper>
    );
}
