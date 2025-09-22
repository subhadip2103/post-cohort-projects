import { Link, useLocation } from 'react-router-dom';

export function Header() {
    const location = useLocation();
    
    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    💰 ExpenseTracker
                </Link>
                <nav>
                    <ul className="nav-links">
                        <li>
                            <Link 
                                to="/" 
                                className={location.pathname === '/' ? 'active' : ''}
                            >
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/add" 
                                className={location.pathname === '/add' ? 'active' : ''}
                            >
                                Add Transaction
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}