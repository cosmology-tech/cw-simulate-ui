import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField
} from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import cwSimulateAppState from "../../atoms/cwSimulateAppState";
import simulationMetadataState, { Code, Codes } from "../../atoms/simulationMetadataState";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { DEFAULT_CHAIN } from "../../configs/variables";
import { useInstantiateContract } from "../../utils/simulationUtils";
import T1Container from "../grid/T1Container";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import UploadModal from "../upload/UploadModal";
import SubMenuHeader from "./SubMenuHeader";
import T1MenuItem from "./T1MenuItem";
import { Coin } from "@terran-one/cw-simulate/dist/types";

export interface IContractsSubMenuProps {
}

export default function ContractsSubMenu(props: IContractsSubMenuProps) {
  const chainId = DEFAULT_CHAIN;
  const {app} = useAtomValue(cwSimulateAppState);
  const {metadata} = useAtomValue(simulationMetadataState);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  //@ts-ignore
  const codesFromStore = app.store.getIn(["wasm", "codes"])?.toObject() ?? {};
  const codes = {} as Codes;
  for (const key of Object.keys(codesFromStore)) {
    const fileName = metadata.codes[parseInt(key)]?.name;
    if (fileName) {
      codes[parseInt(key)] = {codeId: parseInt(key), name: fileName};
    }
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
              <UploadIcon/>
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

function CodeMenuItem({chainId, code}: ICodeMenuItemProps) {
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
            <RocketLaunchIcon/>
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
  const accounts = app.bank.getBalances().toArray();
  const accountList = accounts.map((balance: [string, Coin[]]) => balance[0]);
  const [account, setAccount] = useState<string>("");
  const handleInstantiate = useCallback(async () => {
    if (!code) {
      setNotification("Internal error. Please check logs.", {severity: "error"});
      console.error(`No contract found with name ${contractName}`);
      return;
    }

    const instantiateMsg = payload.length === 0 ? placeholder : JSON.parse(payload);

    try {
      // @ts-ignore
      const [sender, funds] = accounts.find((balance: [string, Coin[]]) => balance[0] === account);
      if (!sender) {
        setNotification("Please select an account", {severity: "error"});
        return;
      }
      const instance = await createContractInstance(sender, funds, app.wasm.lastCodeId, instantiateMsg);
      // @ts-ignore
      const contractAddress: string = instance?.unwrap().events[0].attributes[0].value;
      setNotification(`Successfully instantiated ${contractName} with address ${contractAddress}`);
      onClose();
      navigate(`/instances/${contractAddress}`);
    } catch (e: any) {
      setNotification(`Unable to instantiate with error: ${e.message}`, {severity: "error"});
    }
  }, [payload, onClose]);

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Instantiate Message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pick an account to instantiate the contract with.
        </DialogContentText>
        <Autocomplete
          onInputChange={(event, value) => setAccount(value)}
          sx={{width: "100%"}}
          renderInput={(params: AutocompleteRenderInputParams) =>
            <TextField {...params} label={"Account"}/>}
          options={accountList}/>
      </DialogContent>
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
