import { SignIn } from '@clerk/nextjs';

export default function SiginInPage() {
  return (
    <main className="  flex  w-full items-center justify-center">
      <SignIn  appearance={{
          elements: {
            // Customize button styles
            button: {
              backgroundColor: '#D2691E', // Customize background color
              color: 'white', // Customize text color
              borderRadius: '8px', // Customize border radius
              padding: '12px 20px', // Customize button padding
              fontWeight: 'bold', // Customize font weight
              fontSize: '16px', // Customize font size
            },
            // You can customize other elements here as well
          },
        }} />
    </main>
  );
}