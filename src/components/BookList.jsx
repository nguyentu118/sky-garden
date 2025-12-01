function BookList({ books, categories }) {
    const getCategoryName = (id) => {
        const c = categories.find(cat => cat.id === id);
        return c ? c.name : "N/A";
    };

    const sorted = [...books].sort((a, b) => a.quantity - b.quantity);

    return (
        <table className="table table-striped">
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
            {sorted.map((b, i) => (
                <tr key={b.id}>
                    <td>{i + 1}</td>
                    <td>{b.code}</td>
                    <td>{b.name}</td>
                    <td>{getCategoryName(b.categoryId)}</td>
                    <td>{b.importDate}</td>
                    <td>{b.quantity}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default BookList;
