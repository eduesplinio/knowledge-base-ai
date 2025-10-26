import { SpaceCard } from './space-card';

interface Space {
  _id: string;
  name: string;
  description?: string;
}

interface SpaceListProps {
  spaces: Space[];
  onDeleteClick?: (space: Space) => void;
}

export function SpaceList({ spaces, onDeleteClick }: SpaceListProps) {
  if (spaces.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum espaço encontrado. Crie seu primeiro espaço!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {spaces.map((space) => (
        <SpaceCard key={space._id} space={space} onDelete={() => onDeleteClick?.(space)} />
      ))}
    </div>
  );
}
