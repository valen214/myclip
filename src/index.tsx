
import "react";
import { AppRegistry, Platform } from "react-native";

import App from "./components/App";

const appName = "example";

AppRegistry.registerComponent(appName, () => App);
if (Platform.OS === "web") {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById("root")
  });
}
