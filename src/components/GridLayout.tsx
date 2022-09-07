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
import FileUpload from "./FileUpload";
import { Instantiate } from "./Instantiate";
import { fileUploadedAtom } from "../atoms/fileUploadedAtom";
import { instantiatedAtom } from "../atoms/instantiatedAtom";
import { snackbarNotificationAtom } from "../atoms/snackbarNotificationAtom";
import consoleLogsAtom from "../atoms/consoleLogsAtom";
import { Config } from "../configs/config";
import { StateRenderer } from "./StateRenderer";
import { ConsoleRenderer } from "./ConsoleRenderer";
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
  setWasmBuffer: (fileBuffer: ArrayBuffer | null) => void;
  setAllStates: (val: IState[]) => void;
}

export default function GridLayout({
  response,
  setResponse,
  allStates,
  currentState,
  setCurrentState,
  setWasmBuffer,
  setAllStates,
}: IProps) {
  const [executeQueryTab, setExecuteQueryTab] =
    useRecoilState(executeQueryTabAtom);
  const isFileUploaded = useRecoilValue(fileUploadedAtom);
  const [isInstantiated, setIsInstantiated] = useRecoilState(instantiatedAtom);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationAtom
  );
  const [consoleLogs, setConsoleLogs] = useRecoilState(consoleLogsAtom);
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
      setConsoleLogs([...consoleLogs, res]);
    } catch (err) {
      setSnackbarNotification({
        ...snackbarNotification,
        severity: "error",
        open: true,
        message:
          "CosmWasm VM was not able to instantiate. Please check console for errors.",
      });
      setConsoleLogs([...consoleLogs, "Instantiate failed: " + err]);
    }
  };

  return (
    <Box sx={{maxWidth: "92vw"}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {allStates.length > 0 && <Item
            sx={{overflowX: "scroll", display: "flex", height: "10vh"}}>
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
          </Item>}
        </Grid>
        <Grid item xs={12}>
          <Item sx={{height: "40vh"}}>
            <div
              style={{
                padding: 10,
                height: "100%",
              }}
            >
              {!isFileUploaded ? (
                <FileUpload setWasmBuffer={setWasmBuffer}/>
              ) : isInstantiated ? (
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
        <Grid item xs={12}>
          <Item
            sx={{
              height: "20vh",
              background: "rgb(16 15 15)",
              color: "white",
              overflowY: "scroll",
              textAlign: "left",
            }}
          >
            <ConsoleRenderer logs={consoleLogs}></ConsoleRenderer>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
