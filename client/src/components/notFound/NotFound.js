import { Link } from "react-router-dom";
import skipGif from "../../assets/Misc/404.gif";
import "./NotFound.sass";
const NotFound = () => {
  return (
    <section className="not-found">
      <div>
        <h1>Oops</h1>
        <h4>We can't seem to find the page you were looking for</h4>
        <h5>error code: 404</h5>
        <p>
          Click{" "}
          <Link to="/" className="not-found-link">
            here
          </Link>{" "}
          to go back home
        </p>
      </div>
      <div>
        <img src={skipGif} alt="error" />
      </div>
    </section>
  );
};

export default NotFound;
