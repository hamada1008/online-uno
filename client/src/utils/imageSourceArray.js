const backgroundSrc = ["red", "blue", "yellow", "green"].map(
  (el) => `/assets/Backgrounds/game-bg-${el}.svg`
);
const cardImage = [
  "/assets/Misc/back.png",
  "/assets/WILD/wild.png",
  "/assets/WILD_FOUR/wild4.png",
];

for (let i = 0; i < 10; i++) {
  cardImage.push(`/assets/NORMAL/blue/blue${i}.png`);
  cardImage.push(`/assets/NORMAL/green/green${i}.png`);
  cardImage.push(`/assets/NORMAL/red/red${i}.png`);
  cardImage.push(`/assets/NORMAL/yellow/yellow${i}.png`);
}

for (let i = 10; i < 13; i++) {
  cardImage.push(`/assets/SPECIAL/blue/blue${i}.png`);
  cardImage.push(`/assets/SPECIAL/green/green${i}.png`);
  cardImage.push(`/assets/SPECIAL/red/red${i}.png`);
  cardImage.push(`/assets/SPECIAL/yellow/yellow${i}.png`);
}
const srcArr = backgroundSrc.concat(cardImage);

export default srcArr;
