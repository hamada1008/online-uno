import "./UnoGame.scss";
const CardImage = ({ card }) => {
  const { type, number, color } = card;
  const source = require(`../../assets/${type}/${
    !type.startsWith("WILD")
      ? color + `/${color + number}`
      : type === "WILD"
      ? "wild"
      : "wild4"
  }.png`);

  return (
    <img
      className="uno-card"
      src={source.default}
      alt={type + number + color}
    />
  );
};

export default CardImage;
