
import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" }
});

export function App() {
  return (
    <View style={styles.container}>
      <Text>react native with web and typescript</Text>
    </View>
  );
}

export default memo(App);