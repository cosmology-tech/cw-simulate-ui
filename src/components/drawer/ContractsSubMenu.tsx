import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
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
  TextField,
  Typography
} from "@mui/material";
import type { CodeInfo, Coin } from "@terran-one/cw-simulate";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../atoms/snackbarNotificationState";
import T1Container from "../grid/T1Container";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import UploadModal from "../upload/UploadModal";
import SubMenuHeader from "./SubMenuHeader";
import T1MenuItem from "./T1MenuItem";
import useSimulation from "../../hooks/useSimulation";
import { useAccounts, useCodes } from "../../CWSimulationBridge";

export interface IContractsSubMenuProps {
}

export default function ContractsSubMenu(props: IContractsSubMenuProps) {
  const sim = useSimulation();

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const codes = Object.values(useCodes(sim)).filter(c => !c.hidden);

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
        optionsExtras={({close}) => <>
          <UploadModal
            variant="contract"
            open={openUploadDialog}
            onClose={() => {
              setOpenUploadDialog(false);
              close();
            }}
          />
        </>}
      />

      {Object.entries(codes).map(([codeId, info]) => (
        <CodeMenuItem key={codeId} code={info}/>
      ))}
    </>
  );
}

interface ICodeMenuItemProps {
  code: CodeInfo;
}

function CodeMenuItem({code}: ICodeMenuItemProps) {
  const [openInstantiate, setOpenInstantiate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <T1MenuItem
      label={code.name}
      textEllipsis
      tooltip={
        <Typography variant="body2">{code.name} ({code.codeId})</Typography>
      }
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
        </MenuItem>,
        <MenuItem key="delete" onClick={() => setOpenDelete(true)}>
          <ListItemIcon>
            <DeleteForeverIcon/>
          </ListItemIcon>
          <ListItemText>
            Delete
          </ListItemText>
          <DeleteDialog
            code={code}
            open={openDelete}
            onClose={() => {
              setOpenDelete(false);
              close();
            }}
          />
        </MenuItem>
      ]}
      optionsExtras={({close}) => <>
        <InstantiateDialog
          code={code}
          open={openInstantiate}
          onClose={() => {
            setOpenInstantiate(false);
            close();
          }}
        />
        <DeleteDialog
          code={code}
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
            close();
          }}
        />
      </>}
    />
  );
}

interface IDeleteDialogProps {
  code: CodeInfo;
  open: boolean;
  onClose: () => void;
}

function DeleteDialog(props: IDeleteDialogProps) {
  const {code, open, onClose} = props;
  const sim = useSimulation();
  const setNotification = useNotification();

  const handleDeleteContract = () => {
    sim.hideCode(code.codeId);
    setNotification("Successfully deleted contract");
    onClose?.();
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        Delete contract
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this contract?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleDeleteContract}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

interface IInstantiateDialogProps {
  code: CodeInfo;
  open: boolean;

  onClose(): void;
}

function InstantiateDialog(props: IInstantiateDialogProps) {
  const {code, open, onClose} = props;
  const sim = useSimulation();
  const navigate = useNavigate();
  const setNotification = useNotification();
  const [instantiateFunds, setInstantiateFunds] = useState<Coin[]>([]);
  const [payload, setPayload] = useState("");
  const placeholder = {
    "count": 0
  }

  const handleSetInstantiateFunds = useCallback((e: any) => {
    const funds = e.target.value.split(",").map((f: string) => {
      const [denom, amount] = f.trim().split(" ");
      return {denom, amount};
    }).filter((f: Coin) => f.denom && f.amount);
    setInstantiateFunds(funds);
  }, [instantiateFunds]);

  const accounts = useAccounts(sim);
  const [account, setAccount] = useState(Object.keys(accounts)[0]);

  const handleInstantiate = useCallback(async () => {
    const instantiateMsg = payload.length === 0 ? placeholder : JSON.parse(payload);
    if (instantiateFunds.length === 0) {
      setNotification("Invalid funds.", {severity: "error"});
      return;
    }

    try {
      const [sender, funds] = Object.entries(accounts).find(([addr, funds]) => addr === account) ?? [undefined, []];
      if (!sender) {
        setNotification("Please select an account", {severity: "error"});
        return;
      }

      const contract = await sim.instantiate(sender, code.codeId, instantiateMsg, funds);
      navigate(`/instances/${contract.address}`);
      onClose();
    } catch (e: any) {
      setNotification(`Unable to instantiate with error: ${e.message}`, {severity: "error"});
      console.error(e);
    }
  }, [account, payload, onClose]);

  return (
    <Dialog open={open} onClose={() => onClose()}>
      <DialogTitle>Instantiate Contract</DialogTitle>
      <DialogContent sx={{pt: '5px !important'}}>
        <Autocomplete
          onInputChange={(_, value) => setAccount(value)}
          sx={{width: "100%"}}
          defaultValue={Object.keys(accounts)[0]}
          renderInput={(params: AutocompleteRenderInputParams) =>
            <TextField {...params} label="Sender"/>
          }
          options={Object.keys(accounts)}
        />
      </DialogContent>
      <DialogContent>
        <TextField label={"Funds"} sx={{width: '100%'}}
                   onChange={(e) => handleSetInstantiateFunds(e)}/>
      </DialogContent>
      <DialogContent>
        <DialogContentText>
          InstantiateMsg
        </DialogContentText>
        <T1Container sx={{width: 400, height: 220}}>
          <JsonCodeMirrorEditor
            jsonValue={""}
            placeholder={placeholder}
            onChange={setPayload}
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
