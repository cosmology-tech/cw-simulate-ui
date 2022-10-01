import DiffSwitch from "../components/simulation/DiffSwitch";

export default {
  title: "DiffSwitch",
  component: DiffSwitch,
  argTypes: {
    isChecked: {
      control: {
        type: "boolean",
      }
    },
    setIsChecked: {
      control: {
        type: "function",
      }
    }
  }
}

export const Default = (args: any) => <DiffSwitch {...args} />
