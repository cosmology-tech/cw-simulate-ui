import Paper from "@mui/material/Paper";
import styled from "@mui/material/styles/styled";

/** Stylized container for FileUpload component */
const FileUploadPaper = styled(Paper)(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...theme.typography.body2,
  p: 0,
  textAlign: "center",
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.grey}`,
}));

export default FileUploadPaper;
