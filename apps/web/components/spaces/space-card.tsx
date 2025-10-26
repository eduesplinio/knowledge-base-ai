import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

interface SpaceCardProps {
  space: {
    _id: string;
    name: string;
    description?: string;
  };
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Link href={`/spaces/${space._id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle>{space.name}</CardTitle>
          {space.description && <CardDescription>{space.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Clique para ver os artigos</p>
        </CardContent>
      </Card>
    </Link>
  );
}
