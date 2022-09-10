import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { StateTraversal } from "./StateTraversal";
import { useRecoilState, useRecoilValue } from "recoil";
import { payloadAtom } from "../atoms/payloadAtom";
import { executeQueryTabAtom } from "../atoms/executeQueryTabAtom";
import { ExecuteQuery, IState } from "./ExecuteQuery";
import { Instantiate } from "./Instantiate";
import { fileUploadedAtom } from "../atoms/fileUploadedAtom";
import { instantiatedAtom } from "../atoms/instantiatedAtom";
import { snackbarNotificationAtom } from "../atoms/snackbarNotificationAtom";
import { Config } from "../configs/config";
import { StateRenderer } from "./StateRenderer";
import "../index.css";

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface IProps {
  response: JSON | undefined;
  setResponse: (val: JSON | undefined) => void;
  allStates: IState[];
  currentState: number;
  setCurrentState: (val: number) => void;
  setWasmBuffers: (fileBuffer: ArrayBuffer[]) => void;
  wasmBuffers: ArrayBuffer[];
  setAllStates: (val: IState[]) => void;
}

export default function GridLayout({
  response,
  setResponse,
  allStates,
  currentState,
  setCurrentState,
  setWasmBuffers,
  wasmBuffers,
  setAllStates,
}: IProps) {
  const [executeQueryTab, setExecuteQueryTab] =
    useRecoilState(executeQueryTabAtom);
  const isFileUploaded = useRecoilValue(fileUploadedAtom);
  const [isInstantiated, setIsInstantiated] = useRecoilState(instantiatedAtom);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationAtom
  );
  const [payload, setPayload] = useRecoilState(payloadAtom);
  const {MOCK_ENV, MOCK_INFO} = Config;
  const addState = (stateBefore: any, res: any) => {
    const stateObj: IState = {
      chainStateBefore: stateBefore,
      payload: payload,
      currentTab: executeQueryTab,
      chainStateAfter: window.VM?.backend?.storage.dict["c3RhdGU="],
      res: res,
    };
    setAllStates([...allStates, stateObj]);
    setCurrentState(allStates.length);
  };

  const onInstantiateClickHandler = () => {
    try {
      const res = window.VM.instantiate(MOCK_ENV, MOCK_INFO, {count: 20});
      addState("", "");
      setIsInstantiated(true);
      setSnackbarNotification({
        ...snackbarNotification,
        severity: "success",
        open: true,
        message: "CosmWasm VM successfully instantiated!",
      });
    } catch (err) {
      setSnackbarNotification({
        ...snackbarNotification,
        severity: "error",
        open: true,
        message:
          "CosmWasm VM was not able to instantiate. Please check console for errors.",
      });
    }
  };

  return (
    <Box sx={{maxWidth: "92vw"}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {allStates.length > 0 && (
            <Item sx={{overflowX: "scroll", display: "flex", height: "10vh"}}>
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  marginLeft: "10px",
                  alignItems: "center",
                  padding: "10px",
                  overflowX: "scroll",
                }}
              >
                <StateTraversal
                  allStates={allStates}
                  currentState={currentState}
                  setCurrentState={setCurrentState}
                  setPayload={setPayload}
                  setResponse={setResponse}
                  setCurrentTab={setExecuteQueryTab}
                />
              </div>
            </Item>
          )}
        </Grid>
        <Grid item xs={12}>
          <Item sx={{height: "40vh"}}>
            <div
              style={{
                padding: 10,
                height: "100%",
              }}
            >
              {isInstantiated ? (
                <ExecuteQuery
                  response={response}
                  setResponse={setResponse}
                  setAllStates={setAllStates}
                  allStates={allStates}
                  setCurrentState={setCurrentState}
                  currentState={currentState}
                />
              ) : (
                <Instantiate
                  onInstantiateClickHandler={onInstantiateClickHandler}
                />
              )}
            </div>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item sx={{textAlign: "left", height: "30vh"}}>
            <StateRenderer
              isFileUploaded={isFileUploaded}
              allStates={allStates}
              currentState={currentState}
            />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
