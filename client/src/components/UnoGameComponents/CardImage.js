import "./styles/CardImage.sass";
const CardImage = ({ card, origin }) => {
  let source = `/assets/Misc/empty.png`;
  const { type, number, color } = card;
  if (card === "back") {
    source = `/assets/Misc/back.png`;
  } else {
    source = `/assets/${type}/${
      !type.startsWith("WILD")
        ? color + `/${color + number}`
        : type === "WILD"
        ? "wild"
        : "wild4"
    }.png`;
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
      src={source}
      alt={card === "back" ? "back" : type + number + color}
      onClick={animateCard}
    />
  );
};

export default CardImage;
