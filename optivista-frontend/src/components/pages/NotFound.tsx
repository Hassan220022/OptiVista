import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        
        <Link to="/">
          <Button>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 