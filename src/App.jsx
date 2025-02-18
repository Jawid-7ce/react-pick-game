import { useState } from "react";
import styled, { css, keyframes } from "styled-components";

// 🎲 Dice Shake Animation (When Rolling)
const shake = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  50% { transform: rotate(-10deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

// 🏆 Winner Glow Effect (For Winning Player)
const winnerGlow = keyframes`
  0% { box-shadow: 0 0 10px gold; }
  50% { box-shadow: 0 0 30px gold; }
  100% { box-shadow: 0 0 10px gold; }
`;

const glow = keyframes`
0% { text-shadow: 0 0 5px black; }
50% { text-shadow: 0 0 15px black; }
100% { text-shadow: 0 0 5px black; }
`;

const PlayerSection = styled.section`
  flex: 1;
  padding: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.5s ease-in-out;
  background: ${({ isActive }) => (isActive ? "rgba(255, 255, 255, 0.2)" : "none")};
  animation: ${({ isActive }) => (isActive ? fadeIn : fadeOut)} 0.5s ease-in-out;

  ${({ isWinner }) =>
    isWinner &&
    css`
      animation: ${winnerGlow} 1.5s infinite alternate;
      background: gold !important;
    `}
`;
// 🔄 Fade In/Out Transition for Player Turn
const fadeOut = keyframes`
  0% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const fadeIn = keyframes`
  0% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1d2671 0%, #c33764 100%);
  font-family: "Nunito", sans-serif;
`;

const GameContainer = styled.div`
  position: relative;
  width: 90rem;
  height: 58rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  box-shadow: 0 4rem 6rem rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  display: flex;
  overflow: hidden;
`;


const PlayerName = styled.h2`
  font-size: 4rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: ${(props) => (props.active ? "600" : "300")};
  margin-bottom: 1rem;
  color: ${(props) => (props.active ? "#ffda79" : "#fefefe")};
`;

const PlayerScore = styled.p`
  font-size: 7rem;
  font-weight: 400;
  color: ${(props) => (props.active ? "#f4d03f" : "#ff5f6d")};
  margin-bottom: auto;
`;

const CurrentBox = styled.div`
  background: #ff5f6d;
  opacity: 0.85;
  border-radius: 12px;
  color: white;
  width: 70%;
  padding: 2.5rem;
  text-align: center;
`;

const CurrentLabel = styled.p`
  text-transform: uppercase;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  color: #f8d7da;
`;

const CurrentScore = styled.p`
  font-size: 4rem;
`;

const DiceContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 18rem;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
`;

const Dice = styled.img`
  height: 10rem;
  width: auto;
  box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.2);
  animation: ${(props) => (props.shaking ? shake : "none")} 0.5s ease-in-out;
`;

const Button = styled.button`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  font-size: 1.8rem;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 400;
  padding: 1rem 3rem;
  border-radius: 50rem;
  box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

const WinnerMessage = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  font-weight: bold;
  color: #f4d03f;
  animation: ${glow} 1.5s infinite alternate ease-in-out;
`;

function App() {
  const [scores, setScores] = useState([0, 0]); // Total scores
  const [currentScore, setCurrentScore] = useState(0); // Current score
  const [activePlayer, setActivePlayer] = useState(0); // Player 0 or 1
  const [dice1, setDice1] = useState(null);
  const [dice2, setDice2] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [shaking, setShaking] = useState(false);

  const rollDice = () => {
    if (!playing) return;
  
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      
      const rolled1 = Math.floor(Math.random() * 6) + 1;
      const rolled2 = Math.floor(Math.random() * 6) + 1;
      setDice1(rolled1);
      setDice2(rolled2);
      
      if (rolled1 === 1 && rolled2 === 1) {
        setScores([0, 0]);
        switchPlayer();
      } else if (rolled1 === 1 || rolled2 === 1) {
        switchPlayer();
      } else {
        setCurrentScore((prev) => prev + rolled1 + rolled2);
      }
    }, 500);
  };

  const switchPlayer = () => {
    setCurrentScore(0);
    setActivePlayer((prev) => (prev === 0 ? 1 : 0));
  };

  const holdScore = () => {
    if (!playing) return;
    const newScores = [...scores];
    newScores[activePlayer] += currentScore;
    setScores(newScores);
    if (newScores[activePlayer] >= 100) {
      setPlaying(false);
    } else {
      switchPlayer();
    }
  };

  const resetGame = () => {
    setScores([0, 0]);
    setCurrentScore(0);
    setActivePlayer(0);
    setPlaying(true);
    setDice1(null);
    setDice2(null);
  };

  return (
    <Main>
  <GameContainer>
    {/* Player 1 */}
    <PlayerSection isActive={activePlayer === 0} isWinner={scores[0] >= 100}>
  <PlayerName isActive={activePlayer === 0}>Player 1</PlayerName>
  <PlayerScore isActive={activePlayer === 0}>{scores[0]}</PlayerScore>
  <CurrentBox>
    <CurrentLabel>Current</CurrentLabel>
    <CurrentScore>{activePlayer === 0 ? currentScore : 0}</CurrentScore>
  </CurrentBox>
</PlayerSection>

{/* Player 2 */}
<PlayerSection isActive={activePlayer === 1} isWinner={scores[1] >= 100}>
  <PlayerName isActive={activePlayer === 1}>Player 2</PlayerName>
  <PlayerScore isActive={activePlayer === 1}>{scores[1]}</PlayerScore>
  <CurrentBox>
    <CurrentLabel>Current</CurrentLabel>
    <CurrentScore>{activePlayer === 1 ? currentScore : 0}</CurrentScore>
  </CurrentBox>
</PlayerSection>


    {/* Dice */}
    {(dice1 || dice2) && (
      <DiceContainer>
        <Dice src={`/dice-${dice1}.png`} alt="Dice 1" shaking={shaking} />
        <Dice src={`/dice-${dice2}.png`} alt="Dice 2" shaking={shaking} />
      </DiceContainer>
    )}

    {/* Buttons */}
    <Button style={{ top: "4rem" }} onClick={resetGame}>
      🔄 New Game
    </Button>
    <Button style={{ top: "38rem" }} onClick={rollDice} disabled={scores[activePlayer] >= 100}>
      🎲 Roll Dice
    </Button>
    <Button style={{ top: "45rem" }} onClick={holdScore} disabled={scores[activePlayer] >= 100}>
      📥 Hold
    </Button>

    {/* Winner Message - Overlayed */}
    {scores[activePlayer] >= 100 && (
      <WinnerMessage>🎉 Player {activePlayer + 1} Wins!</WinnerMessage>
    )}
  </GameContainer>
</Main>

  );
}

export default App;
