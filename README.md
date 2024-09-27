# My Blog Application

A blogging platform built with Next.js, Tailwind CSS, and TypeScript, featuring user authentication, image uploads, and a responsive design. Users can create, edit, and comment on posts while enjoying a clean and modern user interface.

## Features

- **User Authentication:** Secure user sign-in using Clerk.
- **Post Management:** Create, edit, and delete blog posts.
- **Responsive Design:** Optimized for various screen sizes, including mobile and tablet.
- **Image Uploads:** Users can upload images for their posts.
- **Search Functionality:** Search posts by title, content, or author.
- **Comments and Likes:** Engage with posts through comments and likes.
- **Author Profile Modal:** Hovering over the author's image shows a modal with their details.
- **Firestore Integration:** Data is stored and retrieved from Firebase Firestore.

## Technologies Used

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Firebase Firestore
- **Authentication:** Clerk
- **Deployment:** Vercel

## Installation

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/my-blog.git
   cd my-blog
Install dependencies:

bash
Copy code
npm install
Set up environment variables: Create a .env.local file in the root directory and add your Firebase and Clerk configurations:

env
Copy code
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

CLERK_FRONTEND_API=your_clerk_frontend_api
Run the development server:

bash
Copy code
npm run dev
Your application should now be running at http://localhost:3000.

Usage
Sign In: Users can sign in using Clerk's authentication.
Create Posts: Users can create posts by filling out the form on the Create Post page.
Edit Posts: Users can edit their posts on the Edit Post page.
View Posts: All posts are displayed on the homepage with an option to view the full post.
Comment and Like: Engage with posts through comments and likes.
Deployment
To deploy the application, you can follow these steps:

Create an account on Vercel: Go to Vercel's website and sign up.

Install Vercel CLI (optional):

bash
Copy code
npm install -g vercel
Link your project:

bash
Copy code
vercel
Deploy your project:

bash
Copy code
vercel --prod
Add environment variables on Vercel: Go to your project settings and add the same environment variables as in your .env.local file.

Contributing
Contributions are welcome! If you find any issues or would like to suggest improvements, please feel free to create an issue or submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

