import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface IProps {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function InstantiateModal({open, setOpen}: IProps) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <JsonCodeMirrorEditor jsonValue={""}/>
            <Button variant="contained" sx={{mt: 4, borderRadius: 2}}>
              Run
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
