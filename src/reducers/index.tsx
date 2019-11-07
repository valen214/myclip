

import { combineReducers } from "redux";

import UIReducers from "./UIReducers";
import DataReducers from "./DataReducers";

export default combineReducers({
  ui: UIReducers,
  data: DataReducers,
});
