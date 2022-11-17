import styled from "@mui/material/styles/styled";

const BlockQuote = styled('blockquote')(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  borderLeft: `2px solid ${theme.palette.common.black}`,
  background: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.08)',
  margin: 0,
}));

export default BlockQuote;
