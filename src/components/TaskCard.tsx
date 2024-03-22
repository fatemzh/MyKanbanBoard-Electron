// Importation des hooks et composants nécessaires
import { useState } from "react";
import TrashIcon from "../Icons/TrashIcon";
import { Id, Task } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

// Définition des props attendues par le composant TaskCard
interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content:string) => void;
}

// Affiche une tâche individuelle
function TaskCard({ task, deleteTask, updateTask}: Props) {
  // Gère le survol de la souris et le mode d'édition
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Configuration du glisser-déposer pour la tâche
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  // Style dynamique pour la tâche pendant le glisser-déposer
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Fonction pour basculer le mode d'édition
  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };
  
  // Affichage temporaire de la tâche pendant le glisser-déposer
  if(isDragging) {
    return(
      <div ref={setNodeRef} style={style} 
      className="opacity-30
       bg-mainBackgroundColor 
       p-2.5 
       h-[100px]
        min-h-[100px] 
        items-center 
        flex 
        text-left 
        rounded-xl 
        border-2
        cursor-grab 
        relative"/>
    )
  }

  // Rendu de la tâche en mode d'édition
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="
        bg-blue-500
        border:none
        rounded-xl 
        bg-opacity-60 
        backdrop-filter 
        backdrop-blur-lg
        2.5 h-[100px]
        min-h-[100px] 
        items-center 
        flex 
        text-left 
        cursor-grab 
        relative
        p-3
        text-content:empty
        "
      >
        <textarea 
          className="
            h-[90%]
            w-full resize-none border-none rounded bg-transparent
            text-white focus:outline-none
          "
            value={task.content}
            autoFocus
            placeholder="Task content here"
            onBlur={toggleEditMode}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
                toggleEditMode();
              }
            }}
            onChange={(e) => 
              updateTask(task.id, e.target.value)
            }
        ></textarea>
      </div>
    );
  }
  
  // Rendu principal de la tâche (mode lecture)
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="
      bg-white
      rounded-xl 
      bg-opacity-40 
      backdrop-filter 
      backdrop-blur-lg
      p-2.5 h-[100px]
      min-h-[100px] 
      items-center 
      flex 
      text-left
      cursor-grab 
      relative"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <p className="
      my-auto 
      h-[90%] 
      w-full 
      overflow-y-auto 
      overflow-x-hidden 
      whitespace-pre-wrap
      hover:cursor-grab">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-indigo-600 p-2 rounded
      opacity-60 hover:opacity-100"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
