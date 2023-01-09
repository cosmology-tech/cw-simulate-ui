import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTheme } from '../../configs/theme';

export default function LoadingScreen() {
  const theme = useTheme();
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      gap: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }}>
      <Typography
        component='h2'
        variant='h2'
        color={theme.palette.primary.main}
      >
        Loading
      </Typography>
      <Typography variant='subtitle1'>Attempting to restore previous session...</Typography>
      <CircularProgress
        disableShrink
        thickness={4}
        sx={{
          animationDuration: '550ms',
        }}
      />
    </Box>
  )
}
