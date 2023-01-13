import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import UploadIcon from "@mui/icons-material/Upload";
import {
  Button,
  DialogContent,
  DialogContentText,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import type { Coin } from "@terran-one/cw-simulate";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../atoms/snackbarNotificationState";
import { drawerSubMenuState } from "../../atoms/uiState";
import T1Container from "../grid/T1Container";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import UploadModal from "../upload/UploadModal";
import SubMenuHeader from "./SubMenuHeader";
import T1MenuItem from "./T1MenuItem";
import useSimulation from "../../hooks/useSimulation";
import {
  AccountEx,
  useAccounts,
  useCode,
  useCodes,
} from "../../CWSimulationBridge";
import { downloadWasm } from "../../utils/fileUtils";
import Funds from "../Funds";
import SchemaIcon from "@mui/icons-material/Schema";
import useDebounce from "../../hooks/useDebounce";
import { useBind } from "../../utils/reactUtils";
import Accounts from "../Accounts";
import { BeautifyJSON } from "../simulation/tabs/Common";
import useMuiTheme from "@mui/material/styles/useTheme";
import DialogButton from "../DialogButton";
import ConfirmDialog, {
  ConfirmDeleteDialog,
  ConfirmDialogProps,
} from "../dialogs/ConfirmDialog";
import T1Dialog, { T1DialogAPI } from "../dialogs/T1Dialog";
import { SchemaForm } from "../simulation/SchemaForm";

export interface IContractsSubMenuProps {}

export default function ContractsSubMenu(props: IContractsSubMenuProps) {
  const sim = useSimulation();

  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const codes = Object.entries(useCodes(sim)).filter(([, c]) => !c.hidden);

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
            <ListItemText>Upload new contract</ListItemText>
          </MenuItem>,
        ]}
        optionsExtras={({ close }) => (
          <>
            <UploadModal
              variant="contract"
              open={openUploadDialog}
              onClose={() => {
                setOpenUploadDialog(false);
                close();
              }}
            />
          </>
        )}
      />

      {codes.map(([codeId]) => (
        <CodeMenuItem key={codeId} codeId={parseInt(codeId)} />
      ))}
    </>
  );
}

interface ICodeMenuItemProps {
  codeId: number;
}

function CodeMenuItem({ codeId }: ICodeMenuItemProps) {
  const sim = useSimulation();
  const setNotification = useNotification();
  const code = useCode(sim, codeId)!;

  const [openInstantiate, setOpenInstantiate] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const download = useCallback(() => {
    downloadWasm(code.wasmCode, code.name ?? "<unnamed code>");
  }, [code]);

  const handleDelete = useCallback(() => {
    sim.hideCode(code.codeId);
    setNotification("Successfully deleted contract");
  }, [code]);

  const MyInstantiateDialog = useBind(InstantiateDialog, { codeId });
  const MyConfirmDeleteDialog = useBind(ConfirmDeleteDialog, {
    noun: "contract",
    onConfirm: handleDelete,
  });

  return (
    <T1MenuItem
      label={`${code.codeId}: ${code.name}`}
      textEllipsis
      options={({ close }) => [
        <DialogButton
          key="instantiate"
          Component={MenuItem}
          DialogComponent={MyInstantiateDialog}
          onClose={() => {
            close();
          }}
        >
          <ListItemIcon>
            <RocketLaunchIcon />
          </ListItemIcon>
          <ListItemText>Instantiate</ListItemText>
        </DialogButton>,
        <MenuItem key="download" onClick={download}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText>Download Source</ListItemText>
        </MenuItem>,
        <DialogButton
          key="delete"
          Component={MenuItem}
          DialogComponent={MyConfirmDeleteDialog}
          onClose={() => {
            close();
          }}
        >
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </DialogButton>,
        <MenuItem key="schema" onClick={() => setOpenUploadDialog(true)}>
          <ListItemIcon>
            <SchemaIcon />
          </ListItemIcon>
          <ListItemText>Upload schema</ListItemText>
        </MenuItem>,
      ]}
      optionsExtras={({ close }) => (
        <>
          <UploadModal
            variant="schema"
            codeId={codeId}
            open={openUploadDialog}
            onClose={() => {
              setOpenUploadDialog(false);
              close();
            }}
            dropTitle="Upload Schema"
            dropzoneText="Upload or drop a schema file here"
          />
        </>
      )}
    />
  );
}

interface IInstantiateDialogProps {
  codeId: number;
  open?: boolean;
  onClose(): void;
}

function InstantiateDialog({ codeId, ...props }: IInstantiateDialogProps) {
  const theme = useMuiTheme();
  const sim = useSimulation();
  const navigate = useNavigate();
  const setNotification = useNotification();
  const code = useCode(sim, codeId)!;
  const accounts = useAccounts(sim);
  const defaultAccount = Object.values(accounts)[0] || "";
  const [isJsonValid, setIsJsonValid] = useState(true);
  const schema = code.schema;
  // @ts-ignore
  const instantiateSchema = schema ? schema.instantiate : {};
  const setDrawerSubMenu = useSetAtom(drawerSubMenuState);

  const [funds, setFunds] = useState<Coin[]>([]);
  const [isFundsValid, setFundsValid] = useState(true);
  const [payload, setPayload] = useState("");
  const [instancelabel, setInstanceLabel] = useState<string>("");
  const [account, setAccount] = useState<AccountEx | null>(defaultAccount);

  const ref = useRef<HTMLInputElement | null>();
  const placeholder = {
    count: 0,
  };
  useEffect(() => {}, []);
  const handleLabelChange = useDebounce(
    () => {
      const val = ref.current?.value.trim();
      setInstanceLabel(val ? val : "");
    },
    200,
    []
  );

  const handleInstantiate = async ({ finish }: T1DialogAPI) => {
    const instantiateMsg =
      payload.length === 0 ? placeholder : JSON.parse(payload);

    try {
      if (!account) {
        setNotification("Please select an account", { severity: "error" });
        return;
      }

      const contract = await sim.instantiate(
        account.address,
        code.codeId,
        instantiateMsg,
        funds,
        instancelabel
      );

      navigate(`/instances/${contract.address}`);
      finish();
      setDrawerSubMenu(undefined);
    } catch (e: any) {
      setNotification(`Unable to instantiate with error: ${e.message}`, {
        severity: "error",
      });
      console.error(e);
    }
  };

  const ConfirmCloseDialog = useCallback(
    (props: ConfirmDialogProps) => (
      <ConfirmDialog
        {...props}
        message="Are you sure you want to cancel contract instantiation?"
      />
    ),
    []
  );

  return (
    <T1Dialog
      {...props}
      confirmClose
      title="Instantiate Contract"
      actions={(api) => (
        <>
          <Button variant="outlined" onClick={() => api.cancel()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!payload || !isFundsValid}
            onClick={() => handleInstantiate(api)}
          >
            Instantiate
          </Button>
        </>
      )}
      ConfirmCloseDialogComponent={ConfirmCloseDialog}
      sx={{
        ".MuiDialogTitle-root+.MuiDialogContent-root": {
          pt: 1,
        },
      }}
    >
      <DialogContent>
        <Accounts
          defaultAccount={defaultAccount.address}
          onChange={setAccount}
        />
        <Funds
          TextComponent={DialogContentText}
          onChange={setFunds}
          onValidate={setFundsValid}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          inputRef={ref}
          defaultValue={instancelabel}
          onChange={handleLabelChange}
          label="Label"
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogContent>
        <Grid
          container
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <DialogContentText>InstantiateMsg</DialogContentText>
          <Grid item>
            <SchemaForm
              schema={instantiateSchema}
              submit={setPayload}
              iconColor={theme.palette.common.black}
            />
            <BeautifyJSON
              onChange={setPayload}
              disabled={!payload.length || !isJsonValid}
              sx={{ color: theme.palette.common.black }}
            />
          </Grid>
        </Grid>
        <T1Container sx={{ width: 400, height: 220 }}>
          <JsonCodeMirrorEditor
            jsonValue={payload}
            placeholder={placeholder}
            onChange={setPayload}
            onValidate={setIsJsonValid}
          />
        </T1Container>
      </DialogContent>
    </T1Dialog>
  );
}
