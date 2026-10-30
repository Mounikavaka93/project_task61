import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useTitle } from '../hooks/useTitle';

export function NotFoundPage() {
  useTitle('Page not found');
  return (
    <EmptyState
      title="That page is not here"
      text="The link may be mistyped, or the page has moved."
      action={
        <Link to="/">
          <Button>Back to home</Button>
        </Link>
      }
    />
  );
}
