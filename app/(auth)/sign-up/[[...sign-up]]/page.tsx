import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp  appearance={{
          elements: {
            // Customize button styles
            button: {
              backgroundColor: 'peru', // Customize background color
              color: 'white', // Customize text color
              borderRadius: '8px', // Customize border radius
            },
            // You can customize other elements here as well
          },
        }} />
    </main>
  );
}