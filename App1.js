import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import bg from "./assets/bg.jpeg";
import Cell from "./src/components/Cell";

const emptyMap = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

// AI bot'un kullanacağı array
const copyArray = (original) => {
  console.log("ghe");
  console.log(original);
  const copy = original.map((arr) => {
    return arr.slice();
  });
  console.log(copy);
  return copy;
};

export default function App() {
  // board'un durumu
  const [map, setMap] = useState(emptyMap);
  // sıra kimde x/o ?
  const [currentTurn, setCurrentTurn] = useState("x");
  // bot'un zorluk seviyesi
  const [gameMode, setGameMode] = useState("BOT_MEDIUM"); // LOCAL, BOT_MEDIUM, BOT_EASY

  // BOT için ne zaman hamle botta olacak
  useEffect(() => {
    if (currentTurn === "o" && gameMode !== "LOCAL") {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }, [map]);

  const onPress = (rowIndex, columnIndex) => {
    // console.warn("pressed!", rowIndex, columnIndex);
    //eğer tıkladığımız alan o veya x ise yani dolu ise dolu diyecek duracak
    if (map[rowIndex][columnIndex] !== "") {
      Alert.alert("occupied!");
      return; // daha devam etme
    }
    //eğer tıkladığımız alan boş ise o koyacak (currentTurn koyacak, sıra kimdeyse) ve map state'ini güncelleyecek, sonrada currentTurn'u değiştirecek, çünkü kendi işaretini koyunca işaret koyma sırası diğer oyuncuya geçecek,
    setMap((existingMap) => {
      const updatedMap = [...existingMap];
      // updatedMap[rowIndex][columnIndex] = "o";
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });
    setCurrentTurn(currentTurn === "x" ? "o" : "x");

    // checkWinningState();
    //   const winner = getWinner();
    //   if (winner) {
    //     gameWon(winner);
    //   } else {
    //     checkTieState();
    //   }
  };

  // kazanma durumu
  // oyunu kuralı 3 işaret yanyana veya çapraz aynı olacak
  // const checkWinningState = () => {
  const getWinner = (winnerMap) => {
    // check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = map[i].every((cell) => cell === "x");
      const isRowOWinning = map[i].every((cell) => cell === "o");

      if (isRowXWinning) {
        // Alert.alert(`X won, Row: ${i}`);
        // gameWon("x");
        return "x";
      }
      if (isRowOWinning) {
        // Alert.alert(`O won, Row: ${i}`);
        // gameWon("o");
        return "o";
      }
    }
    // check columns
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnOWinner = true;

      for (let row = 0; row < 3; row++) {
        if (map[row][col] !== "x") {
          isColumnXWinner = false;
        }
        if (map[row][col] !== "o") {
          isColumnOWinner = false;
        }
      }
      if (isColumnXWinner) {
        // Alert.alert(`x won. Col: ${col}`);
        // gameWon("x");
        return "x";
      }
      if (isColumnOWinner) {
        // Alert.alert(`O won. Col: ${col}`);
        // gameWon("o");
        return "o";
      }
    }
    // check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;

    for (let i = 0; i < 3; i++) {
      if (map[i][i] !== "o") {
        isDiagonal1OWinning = false;
      }
      if (map[i][i] !== "x") {
        isDiagonal1XWinning = false;
      }
      if (map[i][2 - i] !== "o") {
        isDiagonal2OWinning = false;
      }
      if (map[i][2 - i] !== "x") {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      // Alert.alert(`O won, Diagonal 1`);
      // gameWon("o");
      return "0";
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      // Alert.alert(`X won, Diagonal 1`);
      // gameWon("x");
      return "x";
    }
  };

  const checkTieState = () => {
    if (!map.some((row) => row.some((cell) => cell === ""))) {
      Alert.alert(`It's a tie`, `tie`, [
        {
          text: "restart",
          onPress: resetGame,
        },
      ]);
    }
  };

  const gameWon = (player) => {
    Alert.alert(`congrats!`, `player ${player} won!`, [
      {
        text: "restart",
        onPress: resetGame,
      },
    ]);
  };

  const resetGame = () => {
    // console.warn("reset game");
    setMap([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setCurrentTurn("x");
  };

  //? BOT
  const botTurn = () => {
    // olası hamle yapılabilecek cell'ler
    // boş olan hücreleri toplasın
    const possiblePositions = [];
    map.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === "") {
          possiblePositions.push({ row: rowIndex, col: columnIndex });
        }
      });
    });

    let chosenOption;
    if (gameMode === "BOT_MEDIUM") {
      // attack
      possiblePositions.forEach((possiblePosition) => {
        const mapCopy = copyArray(map);
        mapCopy[possiblePosition.row][possiblePosition.col] = "o";

        const winner = getWinner(mapCopy);
        if (winner === "o") {
          chosenOption = possiblePosition;
        }
      });

      if (!chosenOption) {
        // defend
        // rakibin kazanabileceği durumları belirleyip engellemesi
        possiblePositions.forEach((possiblePosition) => {
          const mapCopy = copyArray(map);
          mapCopy[possiblePosition.row][possiblePosition.col] = "x";

          const winner = getWinner(mapCopy);
          if (winner === "x") {
            chosenOption = possiblePosition;
          }
        });
      }
    }
    // chosen random
    if (!chosenOption) {
      chosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }
    // en güzel seçenek
    // onPress(0, 0);
    if (chosenOption) {
      onPress(chosenOption.row, chosenOption.col);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={bg} style={styles.bg} resizeMode="contain">
        <Text
          style={{
            color: "white",
            fontSize: 24,
            position: "absolute",
            top: 50,
          }}
        >
          current turn : {currentTurn.toUpperCase()}
        </Text>
        <View style={styles.map}>
          {map.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Cell
                  key={`row-${rowIndex}-col-${columnIndex}`}
                  cell={cell}
                  onPress={() => onPress(rowIndex, columnIndex)}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <Text
            onPress={() => setGameMode("LOCAL")}
            style={[
              styles.button,
              { backgroundColor: gameMode === "LOCAL" ? "#4F5686" : "#191F24" },
            ]}
          >
            local
          </Text>
          <Text
            onPress={() => setGameMode("BOT_EASY")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_EASY" ? "#4F5686" : "#191F24",
              },
            ]}
          >
            easy
          </Text>
          <Text
            onPress={() => setGameMode("BOT_MEDIUM")}
            style={[
              styles.button,
              {
                backgroundColor:
                  gameMode === "BOT_MEDIUM" ? "#4F5686" : "#191F24",
              },
            ]}
          >
            medium
          </Text>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#242D34",
    paddingTop: 15,
  },
  map: {
    // borderWidth: 1,
    // borderColor: "white",
    width: "80%",
    aspectRatio: 1,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    // borderColor: "blue",
    // borderWidth: 2,
  },
  buttons: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
  },
  button: {
    color: "white",
    margin: 10,
    fontSize: 16,
    backgroundColor: "#191F24",
    padding: 10,
    paddingHorizontal: 15,
  },
});
