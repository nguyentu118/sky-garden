import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center"
             style={{ minHeight: "70vh", textAlign: "center" }}>

            <h1 className="display-3 fw-bold text-danger">404</h1>
            <p className="lead mb-4">Trang bạn tìm không tồn tại.</p>

            <Link to="/" className="btn btn-primary px-4">
                ⬅ Về trang chủ
            </Link>
        </div>
    );
}

export default NotFound;
