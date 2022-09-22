import { Box, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import T1Link from "./T1Link";

interface IProps {
  children?: any[];
  items?: any[];
  rightButton?: React.ReactNode;
  hasRightDeleteButton?: boolean;
  handleDeleteItem: () => void;
  childRef?: any;
  useLinks?: boolean | undefined;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  marginRight: 0,
  marginLeft: 0,
  color: theme.palette.text.secondary,
}));

const T1Grid = ({
  children,
  items,
  rightButton,
  hasRightDeleteButton,
  handleDeleteItem,
  childRef,
  useLinks
}: IProps) => {
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
        item
        xs={12}
        md={12}
        lg={12}
      >
        {items?.map((item) => {
          const itemText =
            <Typography variant="h6" sx={{ paddingLeft: 3 }} ref={childRef}>
              {item}
            </Typography>;

          return (
            <>
              <Grid item xs={12} md={12} lg={12}>
                <Item key={item + "item"}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {useLinks === undefined || useLinks
                      ?
                        <T1Link to={item} sx={{ flexGrow: 1 }}>
                          {itemText}
                        </T1Link>
                      :
                        <div style={{ flexGrow: 1 }}>
                          {itemText}
                        </div>}
                    {rightButton}
                    {hasRightDeleteButton && (
                      <IconButton
                        aria-label="delete"
                        onClick={handleDeleteItem}
                      >
                        <DeleteForeverIcon />
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
                    <Grid
                      item
                      xs={11}
                      md={10}
                      lg={11}
                      sx={{ width: "100%" }}
                      key={instance + "item"}
                    >
                      <Item
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        key={instance}
                      >
                        <Typography
                          variant="h6"
                          align="center"
                          sx={{
                            paddingLeft: 3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                          key={instance + "h6"}
                        >
                          {instance}
                        </Typography>
                        <IconButton
                          aria-label="delete"
                          onClick={handleDeleteItem}
                          key={instance + "icon"}
                        >
                          <DeleteForeverIcon key={instance + "deleteIcon"} />
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
