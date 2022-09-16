import { Box, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useRecoilState } from "recoil";
import chainNamesTextFieldState from "../atoms/chainNamesTextFieldState";
import T1Link from "./T1Link";
import { snackbarNotificationState } from "../atoms/snackbarNotificationState";

interface IProps {
  children?: any[];
  items?: any[];
  rightButton?: React.ReactNode;
  hasRightDeleteButton?: boolean;
  handleDeleteItem?: (e: any) => void;
}

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  marginRight: 0,
  marginLeft: 0,
  color: theme.palette.text.secondary,
}));

const T1Grid = ({
  items,
  rightButton,
  hasRightDeleteButton,
  children,
}: IProps) => {
  const [chainNamesTextField, setChainNamesTextField] = useRecoilState<string[]>(chainNamesTextFieldState);
  const [snackbarNotification, setSnackbarNotification] = useRecoilState(
    snackbarNotificationState
  );
  const handleDelete = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const item = e.currentTarget.parentElement;
    item.remove();
    // Remove the item from the chainNamesTextFieldState
    const newChainNames = chainNamesTextField.filter(
      (el) => el !== item.innerText
    );
    setChainNamesTextField(newChainNames);
    setSnackbarNotification({
      ...snackbarNotification,
      open: true,
      message: `Chain ${item.innerText} deleted`,
      severity: "success",
    });
  };
  return (
    <Box
      sx={{
        width: "100%",
        typography: "body1",
        marginTop: 4,
        marginBottom: 4,
        display: "flex",
        justifyContent: "center",
        flexGrow: 1,
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <Grid
        spacing={2}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          placeItems: "center",
        }}
        container
        xs={12}
        md={12}
        lg={12}
      >
        {items?.map((item) => {
          return (
            <>
              <Grid item xs={12} md={12} lg={12}>
                <Item key={item + "item"}>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <T1Link to={item} sx={{flexGrow: 1}}>
                      <Typography variant="h6" sx={{paddingLeft: 3}}>
                        {item}
                      </Typography>
                    </T1Link>
                    {rightButton}
                    {hasRightDeleteButton && (
                      <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteForeverIcon/>
                      </IconButton>
                    )}
                  </div>
                </Item>
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    flexDirection: "column",
                  }}
                >
                  {children?.map((instance) => (
                    <Grid item xs={11} md={10} lg={11} sx={{width: "100%"}}>
                      <Item
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h6" sx={{paddingLeft: 3}}>
                          {instance}
                        </Typography>
                        <IconButton aria-label="delete" onClick={handleDelete}>
                          <DeleteForeverIcon/>
                        </IconButton>
                      </Item>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          );
        })}
      </Grid>
    </Box>
  );
};

export default T1Grid;
