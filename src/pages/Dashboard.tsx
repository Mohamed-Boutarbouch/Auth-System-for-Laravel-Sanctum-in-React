import { Link } from 'react-router-dom';
import AppLayout from '../components/Layouts/AppLayout';

const Dashboard = () => (
  <AppLayout
    header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
  >
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">You&apos;re logged in!</div>
          <Link to={'/verify-email'}>Verify You&apos;re Email If You Haven&apos;t Already</Link>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default Dashboard;
