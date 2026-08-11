import React, { useState } from 'react';
import TaskCard from '../components/TaskCard';
import useTaskStore from '../data/taskStore';
import { Empty, Badge } from 'antd';
import Navbar from '../components/Navbar';

function TaskPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const [filterPriority, setFilterPriority] = useState(null); // { value, name, color }
  const [filterDate, setFilterDate] = useState(null); // "YYYY-MM-DD"

  // Filter tasks by priority and date
  const filteredTasks = tasks.filter(task => {
    let matchesPriority = filterPriority ? task.priority === filterPriority.value : true;
    let matchesDate = filterDate
      ? task.createdAt.slice(0, 10) === filterDate
      : true;
    return matchesPriority && matchesDate;
  });

  return (
    <>
      <div className='sticky top-0 w-full z-50'>
        <Navbar onPriorityChange={setFilterPriority} onDateChange={setFilterDate} />
      </div>

      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:p-8 mt-4'>
        {filteredTasks.length === 0 ? (
          <div className='absolute w-full left-0 h-full top-0 flex justify-center items-center'>
            <div className=' w-[90%] h-[60%] flex justify-center items-center'>
              <Empty
                style={{ fontSize: '18px' }}
                imageStyle={{ height: 200, width: 350 }}
                description="No Data select priority or Add task"
              />
            </div>
          </div>
        ) : (
          filteredTasks.map(task => (
            <Badge.Ribbon
              key={task.id}
              text={task.priority?.toUpperCase() || "NO PRIORITY"}
              color={
                filterPriority?.value === task.priority
                  ? filterPriority.color
                  : task.priority === "high"
                    ? "red"
                    : task.priority === "medium"
                      ? "orange"
                      : "green"
              }
            >
              <TaskCard task={task} />
            </Badge.Ribbon>
          ))
        )}
      </div>
    </>
  );
}

export default TaskPage;
