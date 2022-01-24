import React from "react";
import AuthForm from "../AuthForm/AuthForm";
import unoLogo from "../../assets/Misc/uno.png";
import "./HomePage.scss";

const HomePage = () => {
  return (
    <section className="homepage">
      <div className="welcome">
        <img src={unoLogo} alt="Uno Logo" className="welcome-logo" />
        <h1>Bored?</h1>
        <h5>Challenge your friends to a One vs One Uno game</h5>
        <span>or</span>
        <h5>Play a fast game vs the CPU</h5>
      </div>
      <AuthForm />
    </section>
  );
};

export default HomePage;
