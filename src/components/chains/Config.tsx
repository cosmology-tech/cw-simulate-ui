import { Button, Grid, Typography } from "@mui/material";
import { JsonCodeMirrorEditor } from "../JsonCodeMirrorEditor";
import { useRecoilValue, useRecoilState } from "recoil";
import filteredChainsFromSimulationState from "../../selectors/filteredConfigsFromSimulationState";
import { useNavigate, useParams } from "react-router-dom";
import { payloadState } from "../../atoms/payloadState";
import simulationState from "../../atoms/simulationState";

const Config = () => {
  const param = useParams();

  const [simulation, setSimulation] = useRecoilState(simulationState);
  const payload = useRecoilValue(payloadState);

  const configValue = useRecoilValue(filteredChainsFromSimulationState);
  const currentConfig = configValue.find((config: any) => config.chainId === param.id);
  const jsonValue = JSON.stringify(currentConfig, null, 2);

  const navigate = useNavigate();

  const handleOnClick = () => {
    const currentChain = simulation.simulation.chains.find((c: any) => c.chainId === param.id);
    const currentIndex = simulation.simulation.chains.indexOf(currentChain);

    const newChain = JSON.parse(payload);
    const newSimulation = {
      simulation: {
        chains: [...simulation.simulation.chains.filter((c: any) => c.chainId !== param.id)]
      }
    };

    for (const key of Object.keys(currentChain)) {
      if (key !== 'chainId' && key !== 'bech32Prefix') {
        newChain[key] = currentChain[key];
      }
    }

    newSimulation.simulation.chains.splice(currentIndex, 0, newChain);
    setSimulation(newSimulation);

    if (newChain.chainId !== currentChain.chainId) {
      navigate(`/chains/${newChain.chainId}`);
    }
  }

  return (
    <>
      <Typography variant="h6">Configuration</Typography>
      <JsonCodeMirrorEditor jsonValue={jsonValue}/>
      <Grid
        item
        xs={12}
        sx={{display: "flex", justifyContent: "end", marginTop: 2}}
      >
        <Button variant="contained" sx={{borderRadius: 2}} onClick={handleOnClick}>
          <Typography variant="button">Update Configuration</Typography>
        </Button>
      </Grid>
    </>
  );
};

export default Config;
