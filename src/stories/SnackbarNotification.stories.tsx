import SnackbarNotification from "../components/notification/SnackbarNotification";
import { ComponentMeta } from "@storybook/react";

export default {
  title: "SnackbarNotification",
  component: SnackbarNotification,
  argTypes: {
    open: {
      control: {
        type: "boolean",
      }
    },
    severity: {
      control: {
        type: "select",
        options: ["error", "warning", "info", "success"],
      }
    },
    message: {
      control: {
        type: "text",
      }
    }
  }
} as ComponentMeta<typeof SnackbarNotification>;

const Template = (args: any) => <SnackbarNotification {...args} />;
export const Default = Template.bind({});

