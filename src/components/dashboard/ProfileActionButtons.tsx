
import { Button } from "../ui/button";
import { Trash2, Edit } from "lucide-react";

interface ProfileActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProfileActionButtons({ onEdit, onDelete }: ProfileActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
