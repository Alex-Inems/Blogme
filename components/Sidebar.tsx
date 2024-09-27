// components/Sidebar.tsx
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-full lg:w-1/4 p-4 bg-gray-100">
      <h3 className="font-bold mb-4">Categories</h3>
      <ul>
        <li><Link href="/category/javascript">JavaScript</Link></li>
        <li><Link href="/category/react">React</Link></li>
        <li><Link href="/category/nextjs">Next.js</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
