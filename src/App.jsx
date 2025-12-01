import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        categoryId: '',
        importDate: '',
        quantity: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        console.log('Component mounted, fetching data...');
        fetchBooks();
        fetchCategories();
    }, []);

    const fetchBooks = async () => {
        try {
            console.log('Fetching books from:', `${API_URL}/books`);
            const response = await axios.get(`${API_URL}/books`);
            console.log('Books data:', response.data);
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi tải danh sách sách:', error);
            setError('Không thể tải danh sách sách. Vui lòng kiểm tra JSON Server đã chạy chưa!');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            console.log('Fetching categories from:', `${API_URL}/categories`);
            const response = await axios.get(`${API_URL}/categories`);
            console.log('Categories data:', response.data);
            setCategories(response.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách thể loại:', error);
            setError('Không thể tải danh sách thể loại.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'N/A';
    };

    const sortedBooks = [...books].sort((a, b) => a.quantity - b.quantity);

    const validateForm = () => {
        const newErrors = {};

        const codePattern = /^BO-\d{4}$/;
        if (!codePattern.test(formData.code)) {
            newErrors.code = 'Mã sách phải đúng định dạng BO-XXXX (VD: BO-0001)';
        } else {
            const existingBook = books.find(book => book.code === formData.code);
            if (existingBook) {
                newErrors.code = 'Mã sách đã tồn tại trong hệ thống!';
            }
        }

        if (formData.name.length > 100) {
            newErrors.name = 'Tên sách không được dài quá 100 ký tự';
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Tên sách không được để trống';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Vui lòng chọn thể loại sách';
        }

        if (!formData.importDate) {
            newErrors.importDate = 'Vui lòng chọn ngày nhập sách';
        } else {
            const selectedDate = new Date(formData.importDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                newErrors.importDate = 'Ngày nhập sách không được lớn hơn ngày hiện tại';
            }
        }

        const quantity = parseInt(formData.quantity);
        if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
            newErrors.quantity = 'Số lượng sách phải là số nguyên lớn hơn 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setMessage('');
            return;
        }

        try {
            const maxId = books.length > 0
                ? Math.max(...books.map(book => parseInt(book.id)))
                : 0;
            const newId = (maxId + 1).toString();

            await axios.post(`${API_URL}/books`, {
                id: newId,
                ...formData,
                quantity: parseInt(formData.quantity)
            });

            setMessage('✅ Thêm sách thành công!');
            setTimeout(() => {
                setMessage('');
                setShowAddForm(false);
                setFormData({
                    code: '',
                    name: '',
                    categoryId: '',
                    importDate: '',
                    quantity: ''
                });
                setErrors({});
                fetchBooks();
            }, 2000);
        } catch (error) {
            console.error('Lỗi khi thêm sách:', error);
            setMessage('❌ Có lỗi xảy ra khi thêm sách!');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredBooks = sortedBooks.filter(book => {
        const matchName = searchName === '' ||
            book.name.toLowerCase().includes(searchName.toLowerCase());
        const matchCategory = searchCategory === '' ||
            book.categoryId === searchCategory;
        return matchName && matchCategory;
    });

    return (
        <div className="App">
            <header className="app-header">
                <h1>📚 Hệ thống quản lý thư viện SkyGarden</h1>
            </header>

            <div className="container">
                <div className="search-section">
                    <h2>Tìm kiếm sách</h2>
                    <div className="search-form">
                        <input
                            type="text"
                            placeholder="Tìm theo tên sách..."
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            className="search-select"
                        >
                            <option value="">-- Tất cả thể loại --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="action-section">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="btn-primary"
                    >
                        {showAddForm ? 'Hủy' : '+ Thêm sách mới'}
                    </button>
                </div>
                {showAddForm && (
                    <div className="form-section">
                        <h2>Thêm sách mới</h2>
                        {message && (
                            <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Mã sách *</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleInputChange}
                                    placeholder="VD: BO-0001"
                                    className={errors.code ? 'error' : ''}
                                />
                                {errors.code && <span className="error-text">{errors.code}</span>}
                            </div>

                            <div className="form-group">
                                <label>Tên sách *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên sách"
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <span className="error-text">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label>Thể loại *</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className={errors.categoryId ? 'error' : ''}
                                >
                                    <option value="">-- Chọn thể loại --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
                            </div>

                            <div className="form-group">
                                <label>Ngày nhập sách *</label>
                                <input
                                    type="date"
                                    name="importDate"
                                    value={formData.importDate}
                                    onChange={handleInputChange}
                                    className={errors.importDate ? 'error' : ''}
                                />
                                {errors.importDate && <span className="error-text">{errors.importDate}</span>}
                            </div>

                            <div className="form-group">
                                <label>Số lượng *</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số lượng"
                                    className={errors.quantity ? 'error' : ''}
                                />
                                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                            </div>

                            <button type="submit" className="btn-submit">Thêm sách</button>
                        </form>
                    </div>
                )}
                <div className="list-section">
                    <h2>Danh sách sách (Sắp xếp tăng dần theo số lượng)</h2>

                    {!loading && !error && filteredBooks.length === 0 && (
                        <div className="no-data">Không có thông tin sách này</div>
                    )}

                    {!loading && !error && filteredBooks.length > 0 && (
                        <table className="books-table">
                            <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã sách</th>
                                <th>Tên sách</th>
                                <th>Thể loại</th>
                                <th>Ngày nhập</th>
                                <th>Số lượng</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredBooks.map((book, index) => (
                                <tr key={book.id}>
                                    <td>{index + 1}</td>
                                    <td>{book.code}</td>
                                    <td>{book.name}</td>
                                    <td>{getCategoryName(book.categoryId)}</td>
                                    <td>{formatDate(book.importDate)}</td>
                                    <td>{book.quantity}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;