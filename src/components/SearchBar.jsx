function SearchBar({ categories, searchName, setSearchName, searchCategory, setSearchCategory }) {
    return (
        <div className="row mb-4">
            <div className="col-md-6">
                <input
                    className="form-control"
                    placeholder="Tìm theo tên..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />
            </div>

            <div className="col-md-6">
                <select
                    className="form-select"
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                >
                    <option value="">-- Tất cả --</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default SearchBar;
