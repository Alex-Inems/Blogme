import { SignUp, useUser } from '@clerk/nextjs';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const createUserDocument = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.id);
        
        // Create a Firestore document for the new user
        await setDoc(userDocRef, {
          username: user.username || '',
          email: user.emailAddresses[0]?.emailAddress || '',
          introduction: '',
          topics: [],
          profileImageUrl: '', // Initial value for profile image
        });

        // Optionally, redirect the user after sign-up
        router.push('/'); // Redirect to home or another page
      }
    };

    createUserDocument();
  }, [user, router]);

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            button: {
              backgroundColor: 'peru',
              color: 'white',
              borderRadius: '8px',
            },
          },
        }}
      />
    </main>
  );
}
