declare module 'emoji-mart' {
    import { Component } from 'react';
  
    export interface Emoji {
      id: string;
      native: string;
    }
  
    export interface PickerProps {
      onSelect: (emoji: Emoji) => void;
      style?: React.CSSProperties;
      set?: 'apple' | 'google' | 'twitter' | 'facebook' | 'messenger';
      // Add more props as needed
    }
  
    export class Picker extends Component<PickerProps> {}
  }
  