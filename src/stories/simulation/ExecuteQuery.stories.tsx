import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ExecuteQuery } from "../../components/simulation/ExecuteQuery";
import FullSizeStory from "../FullSizeStory";

const meta: ComponentMeta<typeof ExecuteQuery> = {
  title: "Simulation/Execute & Query Component",
  component: ExecuteQuery,
};

export default meta;

export const Default: ComponentStory<typeof ExecuteQuery> = args => (
  <FullSizeStory>
    <ExecuteQuery {...args} />
  </FullSizeStory>
);
