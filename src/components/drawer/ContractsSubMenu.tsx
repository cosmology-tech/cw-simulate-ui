import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import UploadIcon from "@mui/icons-material/Upload";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
import simulationMetadataState, { Code, Codes } from "../../atoms/simulationMetadataState";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { DEFAULT_CHAIN, SENDER_ADDRESS } from "../../configs/variables";
import { useInstantiateContract } from "../../utils/simulationUtils";
import T1Container from "../grid/T1Container";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import UploadModal from "../upload/UploadModal";
import SubMenuHeader from "./SubMenuHeader";
import T1MenuItem from "./T1MenuItem";

export interface IContractsSubMenuProps {}

export default function ContractsSubMenu(props: IContractsSubMenuProps) {
  const chainId = DEFAULT_CHAIN;
  const {app} = useAtomValue(cwSimulateAppState);
  const {metadata} = useAtomValue(simulationMetadataState);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  //@ts-ignore
  const codesFromStore = app.store.getIn(["wasm", "codes"]).toObject();
  const codes = {} as Codes;
  for (const key of Object.keys(codesFromStore)) {
    const fileName = metadata.codes[parseInt(key)].name;
    codes[parseInt(key)] = {codeId: parseInt(key), name: fileName};
  }
  
  return (
    <>
      <SubMenuHeader
        title="Contracts"
        options={[
          <MenuItem
            key="upload-contract"
            onClick={() => setOpenUploadDialog(true)}
          >
            <ListItemIcon>
              <UploadIcon />
            </ListItemIcon>
            <ListItemText>
              Upload new contract
            </ListItemText>
          </MenuItem>
        ]}
      />
      
      {Object.values(codes).map((code) => (
        <CodeMenuItem key={code?.codeId} chainId={chainId} code={code}/>
      ))}
      
      <UploadModal
        chainId={DEFAULT_CHAIN}
        variant="contract"
        open={openUploadDialog}
        onClose={() => {
          setOpenUploadDialog(false);
        }}
      />
    </>
  );
}

interface ICodeMenuItemProps {
  chainId: string;
  code: Code;
}

function CodeMenuItem({ chainId, code }: ICodeMenuItemProps) {
  const [openInstantiate, setOpenInstantiate] = useState(false);
  
  return (
    <T1MenuItem
      label={code.name}
      textEllipsis
      options={({close}) => [
        <MenuItem
          key="instantiate"
          onClick={() => setOpenInstantiate(true)}
        >
          <ListItemIcon>
            <RocketLaunchIcon />
          </ListItemIcon>
          <ListItemText>
            Instantiate
          </ListItemText>
          <InstantiateDialog
            code={code}
            open={openInstantiate}
            onClose={() => {
              setOpenInstantiate(false);
              close();
            }}
          />
        </MenuItem>
      ]}
    />
  )
}

interface IInstantiateDialogProps {
  code: Code;
  open: boolean;
  onClose(): void;
}

function InstantiateDialog(props: IInstantiateDialogProps) {
  const {code, open, onClose} = props;
  const navigate = useNavigate();
  const [payload, setPayload] = useState<string>("");
  const placeholder = {
    "count": 0
  }
  const contractName = code.name;
  const setNotification = useNotification();
  const createContractInstance = useInstantiateContract();
  const [{app}, setSimulateApp] = useAtom(cwSimulateAppState);
  const handleInstantiate = useCallback(async () => {
    if (!code) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      console.error(`No contract found with name ${contractName}`);
      return;
    }

    const instantiateMsg = payload.length === 0 ? placeholder : JSON.parse(payload);

    try {
      const instance = await createContractInstance(SENDER_ADDRESS, [], app.wasm.lastCodeId, instantiateMsg);
      const contractAddress: string = instance?.unwrap().events[0].attributes[0].value;
      setNotification(`Successfully instantiated ${contractName} with address ${contractAddress}`);
      onClose();
      navigate(`/instances/${contractAddress}`);
    }
    catch (e: any) {
      setNotification(`Unable to instantiate with error: ${e.message}`, {severity: "error"});
    }
  }, [payload, onClose]);
  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Enter Instantiate Message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the instantiate message for the contract.
        </DialogContentText>
        <T1Container sx={{width: 400, height: 220}}>
          <JsonCodeMirrorEditor
            jsonValue={""}
            placeholder={placeholder}
            setPayload={(val) => setPayload(val)}
          />
        </T1Container>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!payload}
          onClick={handleInstantiate}
        >
          Instantiate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
