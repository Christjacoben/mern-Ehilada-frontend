import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import style from "../assets/styles.png";

function Home() {
  return (
    <div>
      <nav className="navBar">
        <ul className="ulStyle">
          <li className="liStyle">
            <Link to="/login" className="linkStyle">
              Login
            </Link>
          </li>
        </ul>
      </nav>
      <div className="e-hilada">
        <h2>Welcome to E-Hilada</h2>
        <p>An Alternative Learning Management of</p>

        <p> Dinapigue National High School</p>
      </div>

      <img src={style} alt="style" className="Styles" />
    </div>
  );
}

export default Home;
