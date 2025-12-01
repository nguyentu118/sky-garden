import { Link, NavLink } from "react-router-dom";

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
            <Link className="navbar-brand fw-bold" to="/">
                📚 SkyGarden Library
            </Link>

            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">

                    <li className="nav-item">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                "nav-link" + (isActive ? " active fw-bold" : "")
                            }
                        >
                            Trang chủ
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink
                            to="/add"
                            className={({ isActive }) =>
                                "nav-link" + (isActive ? " active fw-bold" : "")
                            }
                        >
                            + Thêm sách
                        </NavLink>
                    </li>

                </ul>
            </div>
        </nav>
    );
}

export default Header;
