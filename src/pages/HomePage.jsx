import { useEffect, useState } from "react";
import { getBooks } from "../services/bookService";
import { getCategories } from "../services/categoryService";
import BookList from "../components/BookList";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";

function HomePage() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [searchName, setSearchName] = useState("");
    const [searchCategory, setSearchCategory] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const b = await getBooks();
        const c = await getCategories();
        setBooks(b.data);
        setCategories(c.data);
    };

    const filtered = books.filter(book =>
        (searchName === "" || book.name.toLowerCase().includes(searchName.toLowerCase())) &&
        (searchCategory === "" || book.categoryId === searchCategory)
    );

    return (
        <>
            <SearchBar
                categories={categories}
                searchName={searchName}
                setSearchName={setSearchName}
                searchCategory={searchCategory}
                setSearchCategory={setSearchCategory}
            />

            <div className="text-end mb-3">
                <Link to="/add" className="btn btn-primary">+ Thêm sách</Link>
            </div>

            <BookList books={filtered} categories={categories} />
        </>
    );
}

export default HomePage;
