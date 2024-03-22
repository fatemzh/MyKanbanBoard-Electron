import { Column, Id, Task } from "../types";
import TrashIcon from "../Icons/TrashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../Icons/PlusIcon";
import TaskCard from "../components/TaskCard";

// Définition des props attendues par le composant ColumnContainer
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

// Composant ColumnContainer qui affiche une colonne et ses tâches
function ColumnContainer(props: Props) {
  // Destructuration des props pour un accès facile
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  // État local pour gérer le mode d'édition du titre de la colonne
  const [editMode, setEditMode] = useState(false);

  // Enregistre les IDs des tâches 
  const tasksIds = useMemo(()=>{
    return tasks.map((task) => task.id)
  }, [tasks])
  
  // Configuration du glisser-déposer pour la colonne
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  // Style dynamique pour la colonne pendant le glisser-déposer
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Affichage temporaire de la colonne pendant le glisser-déposer
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
            bg-blue-400
            opacity-30
            border-2
            border-rose-500
            w-[350px]
            h-[500px]
            max-h-[500px]
            rounded-md
            flex
            flex-col
        "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="        
        bg-blue-50
        rounded-xl 
        bg-opacity-60 
        backdrop-filter 
        backdrop-blur-lg
        w-[350px]
        h-[500px]
        max-h-[500px]
        flex
        flex-col
    "
    >
      {/* En-tête de la colonne avec gestion du mode d'édition */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="
            bg-sky-200
            text-md
            h-[60px]
            cursor-grab
            rounded-md
            rounded-b-none
            p-3
            font-bold
            flex
            items-center
            justify-between
        "
      >
        <div
          className="
                flex
                gap-2
            "
        >
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-white opacity-70 focus:border-white border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
                stroke-gray-900
                hover:stroke-white
                hover:bg-sky-400
                rounded
                px-1
                py-2
            "
        >
          <TrashIcon />
        </button>
      </div>
      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
            {tasks.map((task) => (
            <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
            />
            ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="
                flex
                gap-2
                items-center
                bg-sky-300 rounded-md p-4
                border-x-columnBackgroundColor hover:text-white font-semibold
                active:bg-indigo-300
                hover:bg-indigo-400
                "
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add Task
      </button>
    </div>
  );
}

export default ColumnContainer;
