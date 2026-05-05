import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import capsuleReducer from "../features/capsule/capsuleSlice";
import graphReducer from "../features/graph/graphSlice";
import institutionReducer from "../features/institution/institutionSlice";
import trustReducer from "../features/trust/trustSlice";
import accessReducer from "../features/access/accessSlice";
import logsReducer from "../features/logs/logsSlice";
import statsReducer from "../features/stats/statsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    capsule: capsuleReducer,
    graph: graphReducer,
    institution: institutionReducer,
    trust: trustReducer,
    access: accessReducer,
    logs: logsReducer,
    stats: statsReducer,
  },
});