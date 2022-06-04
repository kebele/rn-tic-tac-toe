import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Cross from "./Cross";

const Cell = (props) => {
  const { cell, onPress } = props;
  return (
    <Pressable onPress={() => onPress()} style={styles.cell}>
      {cell == "o" && <View style={styles.circle} />}
      {cell == "x" && <Cross />}
    </Pressable>
  );
};

export default Cell;

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    flex: 1,
    // borderColor: "white",
    // borderWidth: 1,
  },
  circle: {
    // width: 75,
    // height: 75,
    flex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    borderWidth: 10,
    borderColor: "white",
  },
});
