import React from "react";
import { useParams } from "react-router-dom";
import SendMessage from "./SendMessage";
import History from "./History";
import SplitView from "./SplitView";

const Simulation = () => {
  const { chainId, instanceAddress: contractAddress } = useParams();

  return (
    <SplitView className="T1Simulation-root">
      <SendMessage chainId={chainId!} contractAddress={contractAddress!} />
      <History chainId={chainId!} contractAddress={contractAddress!} />
    </SplitView>
  );
};

export default Simulation;
