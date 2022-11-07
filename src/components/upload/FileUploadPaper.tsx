import { styled, Paper } from "@mui/material";
import { GREY_5 } from "../../configs/variables";

/** Stylized container for FileUpload component */
const FileUploadPaper = styled(Paper)(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  p: 0,
  textAlign: "center",
  color: theme.palette.text.secondary,
  border: `1px solid ${GREY_5}`,
}));

export default FileUploadPaper;
