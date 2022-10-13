import CloseDiff from "../components/simulation/CloseDiff";

export default {
  title: "DiffSwitch",
  component: CloseDiff,
  argTypes: {
    isChecked: {
      control: {
        type: "boolean",
      },
    },
    setIsChecked: {
      control: {
        type: "function",
      },
    },
  },
};

export const Default = (args: any) => <CloseDiff {...args} />;
