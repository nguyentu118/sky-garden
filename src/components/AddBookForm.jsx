import { useEffect, useState } from "react";
import { getBooks, createBook } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import { useNavigate } from "react-router-dom";

function AddBookForm() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        categoryId: "",
        importDate: "",
        quantity: ""
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const bookRes = await getBooks();
        const categoryRes = await getCategories();
        setBooks(bookRes.data);
        setCategories(categoryRes.data);
    };

    // --------------------------------------------
    // VALIDATE FORM
    // --------------------------------------------
    const validate = () => {
        const newErrors = {};

        // Mã sách
        const codePattern = /^BO-\d{4}$/;
        if (!codePattern.test(formData.code)) {
            newErrors.code = "Mã sách phải theo định dạng BO-XXXX (VD: BO-0001)";
        } else {
            const exists = books.some(b => b.code === formData.code);
            if (exists) newErrors.code = "Mã sách này đã tồn tại!";
        }

        // Tên sách
        if (!formData.name.trim()) {
            newErrors.name = "Tên sách không được để trống";
        } else if (formData.name.length > 100) {
            newErrors.name = "Tên sách tối đa 100 ký tự";
        }

        // Thể loại
        if (!formData.categoryId) {
            newErrors.categoryId = "Vui lòng chọn thể loại";
        }

        // Ngày nhập
        if (!formData.importDate) {
            newErrors.importDate = "Chọn ngày nhập";
        } else {
            const selected = new Date(formData.importDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selected > today) {
                newErrors.importDate = "Ngày nhập không được vượt quá hôm nay";
            }
        }

        // Số lượng
        const qty = parseInt(formData.quantity);
        if (!qty || qty <= 0) {
            newErrors.quantity = "Số lượng phải là số nguyên > 0";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --------------------------------------------
    // HANDLE SUBMIT
    // --------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const maxId = books.length > 0
                ? Math.max(...books.map(b => parseInt(b.id)))
                : 0;

            const newBook = {
                id: (maxId + 1).toString(),
                ...formData,
                quantity: parseInt(formData.quantity)
            };

            await createBook(newBook);

            setMessage("Thêm sách thành công!");
            setTimeout(() => navigate("/"), 1000);
        } catch (e) {
            setMessage("Lỗi khi thêm sách!");
        }
    };

    // --------------------------------------------
    // HANDLE INPUT
    // --------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form className="mt-3" onSubmit={handleSubmit}>
            {message && (
                <div className="alert alert-info text-center">{message}</div>
            )}

            {/* Mã sách */}
            <div className="mb-3">
                <label className="form-label">Mã sách *</label>
                <input
                    type="text"
                    name="code"
                    placeholder="VD: BO-0001"
                    className={`form-control ${errors.code ? "is-invalid" : ""}`}
                    value={formData.code}
                    onChange={handleChange}
                />
                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
            </div>

            {/* Tên sách */}
            <div className="mb-3">
                <label className="form-label">Tên sách *</label>
                <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên sách"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Thể loại */}
            <div className="mb-3">
                <label className="form-label">Thể loại *</label>
                <select
                    name="categoryId"
                    className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                    value={formData.categoryId}
                    onChange={handleChange}
                >
                    <option value="">-- Chọn thể loại --</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
            </div>

            {/* Ngày nhập */}
            <div className="mb-3">
                <label className="form-label">Ngày nhập *</label>
                <input
                    type="date"
                    name="importDate"
                    className={`form-control ${errors.importDate ? "is-invalid" : ""}`}
                    value={formData.importDate}
                    onChange={handleChange}
                />
                {errors.importDate && (
                    <div className="invalid-feedback">{errors.importDate}</div>
                )}
            </div>

            {/* Số lượng */}
            <div className="mb-3">
                <label className="form-label">Số lượng *</label>
                <input
                    type="number"
                    name="quantity"
                    className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Nhập số lượng"
                />
                {errors.quantity && (
                    <div className="invalid-feedback">{errors.quantity}</div>
                )}
            </div>

            <button type="submit" className="btn btn-success w-100">
                Thêm sách
            </button>
        </form>
    );
}

export default AddBookForm;
