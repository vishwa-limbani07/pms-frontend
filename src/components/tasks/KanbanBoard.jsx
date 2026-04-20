import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus } from 'lucide-react'
import { useTasks, useUpdateTaskStatus } from '../../hooks/useTasks'
import TaskCard from './TaskCard'
import CreateTaskModal from './CreateTaskModal'

const COLUMNS = [
  { id: 'TODO',        label: 'To Do',      color: 'bg-gray-400' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'REVIEW',      label: 'Review',      color: 'bg-amber-500' },
  { id: 'DONE',        label: 'Done',        color: 'bg-green-500' },
]

export default function KanbanBoard({ projectId, hideAddButton }) {
  const [showModal, setShowModal] = useState(false)
  const { data: tasks = [], isLoading } = useTasks(projectId)
  const { mutate: updateStatus } = useUpdateTaskStatus(projectId)

  const getColumnTasks = (status) => tasks.filter(t => t.status === status)

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return
    updateStatus({ id: draggableId, status: destination.droppableId })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      {!hideAddButton && (
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">{tasks.length} tasks total</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium rounded-lg transition cursor-pointer"
          >
            <Plus size={15} /> Add task
          </button>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4
  overflow-x-auto pb-2">
          {COLUMNS.map(col => {
            const colTasks = getColumnTasks(col.id)
            return (
              <div key={col.id} className="flex flex-col">

                {/* Column header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${col.color}`} />
                  <span className="text-sm font-medium text-gray-700">{col.label}</span>
                  <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>

                {/* Droppable column */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[200px] rounded-xl p-2 space-y-2 transition-colors
                        ${snapshot.isDraggingOver
                          ? 'bg-blue-50 border-2 border-dashed border-blue-200'
                          : 'bg-gray-50'
                        }`}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                opacity: snapshot.isDragging ? 0.85 : 1,
                              }}
                            >
                              <TaskCard task={task} projectId={projectId} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {/* Empty column hint */}
                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-24">
                          <p className="text-xs text-gray-400">Drop tasks here</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {showModal && (
        <CreateTaskModal
          projectId={projectId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}