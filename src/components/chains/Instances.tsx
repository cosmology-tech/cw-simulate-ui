import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import StateTable from "./StateTable";

function createData(val1: any, val2: any, val3: any) {
  return { val1, val2 };
}

const rows = [
  createData("Testvalue1", "Testvalue2", "TestValue3"),
  createData("Testvalue4", "Testvalue5", "TestValue6"),
];
const columnNames = ["ID", "Account Address", "Balance"];
const Instances = () => {
  return <>Instances</>;
};

export default Instances;
