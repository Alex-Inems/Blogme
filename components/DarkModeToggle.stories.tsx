import { Meta, StoryFn } from '@storybook/react';
import DarkModeToggle from './DarkModeToggle'; // Adjust the import based on your file structure

export default {
  title: 'Components/DarkModeToggle',
  component: DarkModeToggle,
  argTypes: {
    // Optional: You can control the `isDarkMode` if you'd like to pass it as a prop for stories.
    // Here it's controlled inside the component itself, so you might not need this.
  },
  parameters: {
    docs: {
      description: {
        component:
          'A button component that toggles between dark and light mode based on user preference.',
      },
    },
  },
} as Meta<typeof DarkModeToggle>;

// Default Story
const Template: StoryFn<typeof DarkModeToggle> = (args) => <DarkModeToggle {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Here you could pass args if needed, but this component manages its state internally
};
