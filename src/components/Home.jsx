import React from "react";
import "./Home.css";
import style from "../assets/styles.png";

function Home() {
  return (
    <div>
      <nav className="navBar">
        <ul className="ulStyle">
          <li className="liStyle">
            <a href="/login" className="linkStyle">
              Login
            </a>
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
