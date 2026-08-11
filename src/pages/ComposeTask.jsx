
import TaskPage from './TaskPage'

function ComposeTask() {
  return (
    <>
        <div className='w-full h-full relative'>
            <div className=' h-full w-full overflow-y-auto overflow-x-hidden hide-scrollbar '>
              <TaskPage/>
            </div>
        </div>
    </>
  )
}

export default ComposeTask
