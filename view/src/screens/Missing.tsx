import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>Oops!</h1>
            <p>Nie znaleliśmy takiej strony.</p>
            <div className="flexGrow">
                <Link to="/login">Przejd do strony logowania</Link>
            </div>
        </article>
    )
}

export default Missing
