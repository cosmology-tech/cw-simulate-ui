import { Box, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

interface IProps {
  items?: any[],
  rightButton?: React.ReactNode,
  hasRightDeleteButton?: boolean,
  handleDeleteItem?: (e: any) => void,
}

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const T1Grid = ({items, rightButton, hasRightDeleteButton, handleDeleteItem}: IProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        marginTop: 4,
        marginBottom: 4,
        display: "flex",
        justifyContent: "center",
        flexGrow: 1, padding: "2rem"
      }}
    >
      <Grid spacing={2} sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        placeItems: "center",
        padding: "10px",
      }} container xs={11} md={11} lg={10}>
        {items?.map((item) => {
          return (
            <>
              <Grid item xs={11} md={11} lg={10}>
                <Item key={item + "item"}>
                  <div style={{display: 'flex'}}>
                    <Link to={item} style={{flexGrow: 1, textDecoration: 'none', color: "unset"}}>
                      <Typography variant="h6">{item}</Typography>
                    </Link>
                    {rightButton}
                    {hasRightDeleteButton && (
                      <IconButton aria-label="delete">
                        <DeleteForeverIcon/>
                      </IconButton>
                    )}
                  </div>
                </Item>
              </Grid>
            </>
          );
        })}
      </Grid>
    </Box>
  )
}

export default T1Grid;
