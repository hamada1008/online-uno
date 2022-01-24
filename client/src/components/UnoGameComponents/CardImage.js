import "./styles/CardImage.sass";
const CardImage = ({ card, origin }) => {
  let source;
  const { type, number, color } = card;
  if (card === "back") {
    source = require(`../../assets/Misc/back.png`);
  } else {
    source = require(`../../assets/${type}/${
      !type.startsWith("WILD")
        ? color + `/${color + number}`
        : type === "WILD"
        ? "wild"
        : "wild4"
    }.png`);
  }
  const animateCard = (e) => {
    e.target.className = `uno-card ${origin} animated-card`;
    setTimeout(() => {
      e.target.className = `uno-card ${origin}`;
    }, 1000);
  };

  return (
    <img
      className={`uno-card ${origin}`}
      src={source.default}
      alt={card === "back" ? "back" : type + number + color}
      loading="lazy"
      onClick={animateCard}
    />
  );
};

export default CardImage;
