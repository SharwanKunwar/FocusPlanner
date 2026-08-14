import { create } from "zustand";
import { persist } from "zustand/middleware";

const toLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [],

      addTask: ({ title, description, priority, forWhen = "today" }) =>
        set((state) => {
          const now = new Date();
          const scheduledDate = new Date(now);
          const normalizedForWhen = forWhen === "tomorrow" ? "tomorrow" : "today";

          if (normalizedForWhen === "tomorrow") {
            scheduledDate.setDate(scheduledDate.getDate() + 1);
          }

          const newTask = {
            id: Date.now(),
            title,
            description,
            status: "pending",
            createdAt: now.toISOString(),
            // Keep the intended task day separate from its creation timestamp.
            forWhen: normalizedForWhen,
            scheduledFor: toLocalDateKey(scheduledDate),
            createdYear: now.getFullYear(),
            priority,
            completedAt: null,
            duration: 0, // milliseconds
            notes: "",   // 👈 NEW FIELD for notes
          };

          return {
            tasks: [...state.tasks, newTask],
          };
        }),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      deleteAllTasks: () => set({ tasks: [] }),

      updateStatus: (id, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                status: newStatus,
                completedAt:
                  newStatus === "completed"
                    ? new Date().toISOString()
                    : task.completedAt,
              };
            }
            return task;
          }),
        })),

      updateDuration: (id, duration) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, duration } : task
          ),
        })),



      // 👈 NEW FUNCTION TO UPDATE NOTES
      updateNotes: (id, notes) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, notes } : task
          ),
        })),
    }),
    {
      name: "task-storage",
      getStorage: () => localStorage,
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState?.tasks) return persistedState;

        return {
          ...persistedState,
          tasks: persistedState.tasks.map((task) => ({
            ...task,
            // Existing tasks were always created for the current day.
            forWhen: task.forWhen || "today",
            scheduledFor: task.scheduledFor || task.createdAt?.slice(0, 10),
          })),
        };
      },
    }
  )
);

export default useTaskStore;
