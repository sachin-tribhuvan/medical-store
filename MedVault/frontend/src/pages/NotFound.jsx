import { Link } from 'react-router-dom';
import { Empty } from '../components/States.jsx';

export default function NotFound() {
  return <Empty title="Page not found" text="The page you are looking for does not exist."><Link className="btn primary" to="/dashboard">Go to dashboard</Link></Empty>;
}
