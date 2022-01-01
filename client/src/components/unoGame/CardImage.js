import "./UnoGame.scss";
const CardImage = ({ card }) => {
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
  return (
    <img
      className="uno-card"
      src={source.default}
      alt={card === "back" ? "back" : type + number + color}
    />
  );
};

export default CardImage;
