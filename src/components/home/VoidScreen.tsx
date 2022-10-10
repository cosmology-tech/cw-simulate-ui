import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface IVoidScreenProps {}

export default function VoidScreen(props: IVoidScreenProps) {
  return (
    <Box component="main" sx={{p: 3}}>
      <Typography
        textAlign="center"
        fontStyle="italic"
        variant="h5"
      >
        There's nothing here!
      </Typography>
    </Box>
  )
}
