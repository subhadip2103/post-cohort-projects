import { Link } from "react-router-dom"

export function ErrorPage() {
    return (
        <div className="error-page">
            <div className="error-code">404</div>
            <h1 className="error-title">Page Not Found</h1>
            <p className="error-message">
                Oops! The page you're looking for doesn't exist. 
                It might have been moved, deleted, or you entered the wrong URL.
            </p>
            <Link to="/" className="back-home">
                Back to Dashboard
            </Link>
        </div>
    )
}