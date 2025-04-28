
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Eye } from "lucide-react";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  deleteDialogTitle?: string;
  deleteDialogDescription?: string;
  compact?: boolean;
  hideView?: boolean;
  hideEdit?: boolean;
  hideDelete?: boolean;
  itemName?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onView,
  onEdit,
  onDelete,
  viewLabel = "Ver",
  editLabel = "Editar",
  deleteLabel = "Eliminar",
  deleteDialogTitle = "¿Estás seguro?",
  deleteDialogDescription = "Esta acción no se puede deshacer.",
  compact = false,
  hideView = false,
  hideEdit = false,
  hideDelete = false,
  itemName = "elemento",
}) => {
  const size = compact ? "sm" : "default";
  
  return (
    <div className="flex justify-end gap-2">
      {!hideView && onView && (
        <Button 
          variant="ghost" 
          size={size} 
          onClick={onView}
        >
          {compact ? <Eye className="h-4 w-4" /> : (
            <>
              <Eye className="mr-1 h-4 w-4" />
              {viewLabel}
            </>
          )}
        </Button>
      )}
      
      {!hideEdit && onEdit && (
        <Button 
          variant="outline" 
          size={size} 
          onClick={onEdit}
        >
          {compact ? <Edit className="h-4 w-4" /> : (
            <>
              <Edit className="mr-1 h-4 w-4" />
              {editLabel}
            </>
          )}
        </Button>
      )}
      
      {!hideDelete && onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size={size}
            >
              {compact ? <Trash2 className="h-4 w-4" /> : (
                <>
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deleteLabel}
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{deleteDialogTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {`¿Estás seguro de que deseas eliminar este ${itemName}? ${deleteDialogDescription}`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ActionButtons;
