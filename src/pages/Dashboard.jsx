import React, { useState } from "react";
import useTaskStore from "../data/taskStore";
import {
  FiDownload,
  FiCheckCircle,
  FiLayers,
  FiPlus,
  FiChevronDown,
  FiChevronRight,
  FiChevronLeft,
} from "react-icons/fi";
import GithubHeatmap from "../components/GithubHeatmap";
import useGithubStore from "../data/githubStore";
import { Button } from "antd";

function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateStatus = useTaskStore((state) => state.updateStatus);
  const [newTaskInput, setNewTaskInput] = useState("");

  const { username, setUsername } = useGithubStore();
  const safeUsername = username || "SharwanKunwar";
  const [input, setInput] = React.useState(safeUsername);

  // GitHub data
  const [githubData, setGithubData] = React.useState(null);

  React.useEffect(() => {
    fetch(`https://api.github.com/users/${safeUsername}`)
      .then((res) => res.json())
      .then((res) => setGithubData(res))
      .catch((err) => console.log(err));
  }, [safeUsername]);

  const handleAddTask = (e) => {
    if (e.key === "Enter" && newTaskInput.trim() !== "") {
      addTask({
        title: newTaskInput,
        description: "",
        priority: "normal",
      });
      setNewTaskInput("");
    }
  };

  const unplannedTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="w-full h-full p-6 md:p-8 lg:p-10 flex flex-col gap-10 overflow-y-auto hide-scrollbar">
      
      {/* Top Layout */}
      <div className="flex flex-col xl:flex-row gap-10">
        
        {/* Left Column: Planner */}
        <div className="flex-1 flex flex-col gap-6 max-w-md">
          
          <div className="flex items-center gap-4 text-slate-500 text-sm font-medium mb-2">
            <span>
              Floor <strong className="text-slate-700">Main</strong>
            </span>

            {/* Microphone */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>

            {/* Camera */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect
                x="1"
                y="5"
                width="15"
                height="14"
                rx="2"
                ry="2"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-slate-700">
            Planner
          </h2>

          {/* Planner Nav */}
          <div className="flex flex-col gap-2">
            
            <div
              className="
                flex justify-between items-center
                bg-white/70
                rounded-2xl
                p-4
                shadow-[inset_3px_3px_7px_rgba(200,210,225,0.45),inset_-3px_-3px_7px_rgba(255,255,255,0.9)]
                cursor-pointer
              "
            >
              <div className="flex items-center gap-3 text-slate-700">
                <FiDownload className="text-xl" />
                <span className="font-medium">Unplanned</span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className="
                    bg-[#e4ebf5]
                    px-2 py-0.5
                    rounded-md
                    text-sm
                    font-bold
                    text-slate-600
                    shadow-[inset_2px_2px_4px_#c9d1d9,inset_-2px_-2px_4px_#ffffff]
                  "
                >
                  {unplannedTasks.length}
                </span>

                <FiChevronRight className="text-slate-400" />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 text-slate-500 hover:text-slate-700 cursor-pointer">
              <FiCheckCircle className="text-xl" />
              <span className="font-medium">Planned</span>
            </div>

            <div className="flex items-center gap-3 p-4 text-slate-500 hover:text-slate-700 cursor-pointer">
              <FiLayers className="text-xl" />
              <span className="font-medium">All</span>
            </div>
          </div>

          {/* Clock Card */}
          <div
            className="
              bg-white/70
              rounded-[2rem]
              p-6
              shadow-[inset_5px_5px_12px_rgba(200,210,225,0.45),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]
              flex items-center gap-8
              mt-4
            "
          >
            {/* Analog Clock */}
            <div
              className="
                w-28 h-28
                rounded-full
                shadow-[inset_4px_4px_8px_rgba(200,210,225,0.3),inset_-4px_-4px_8px_rgba(255,255,255,1)]
                border border-white
                relative
                flex justify-center items-center
              "
            >
              <div className="w-0.5 h-10 bg-slate-300 origin-bottom absolute top-4 rounded-full transform rotate-[45deg]" />

              <div className="w-1 h-9 bg-slate-700 origin-bottom absolute top-5 rounded-full transform rotate-[0deg]" />

              <div className="w-1 h-12 bg-slate-700 origin-top absolute top-14 left-13 rounded-full transform rotate-[110deg]" />

              <div className="w-2 h-2 bg-slate-700 rounded-full absolute z-10" />

              {/* Clock dots */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full h-full p-2"
                  style={{
                    transform: `rotate(${i * 30}deg)`,
                  }}
                >
                  <div
                    className={`mx-auto ${
                      i % 3 === 0
                        ? "w-1 h-1.5 bg-slate-400"
                        : "w-0.5 h-1 bg-slate-300"
                    } rounded-full`}
                  />
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-3xl font-bold text-slate-800">
                4pm
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Wed, 17th July
              </p>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4 px-2">
              <span className="text-slate-600 font-medium">
                July 2024
              </span>

              <div className="flex gap-4 text-slate-400">
                <FiChevronLeft className="cursor-pointer hover:text-slate-600" />
                <FiChevronRight className="cursor-pointer hover:text-slate-600" />
              </div>
            </div>

            <div
              className="
                bg-white/70
                rounded-[2rem]
                p-6
                shadow-[inset_5px_5px_12px_rgba(200,210,225,0.45),inset_-5px_-5px_12px_rgba(255,255,255,0.9)]
              "
            >
              <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-400 font-medium mb-4">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>

              <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-sm text-slate-600 font-medium">
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 17;
                  const isSelected = day === 19;

                  return (
                    <div
                      key={day}
                      className={`
                        w-8 h-8
                        flex items-center justify-center
                        rounded-lg
                        mx-auto
                        cursor-pointer

                        ${
                          isToday
                            ? "bg-slate-800 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]"
                            : ""
                        }

                        ${
                          isSelected
                            ? "bg-slate-200 shadow-[inset_2px_2px_4px_#c9d1d9,inset_-2px_-2px_4px_#ffffff]"
                            : ""
                        }

                        ${
                          !isToday && !isSelected
                            ? "hover:bg-slate-100"
                            : ""
                        }
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Todos */}
        <div
          className="
            flex-1
            flex flex-col
            gap-6
            bg-[#d9e3ed]/40
            rounded-[2rem]
            p-6 md:p-8
            border border-white/50
            shadow-[inset_4px_4px_10px_rgba(200,210,225,0.4),inset_-4px_-4px_10px_rgba(255,255,255,0.7)]
          "
        >
          <h2 className="text-xl font-semibold text-slate-700">
            Todo's
          </h2>

          <div className="flex items-center gap-3 text-slate-700 font-medium px-2 mt-2">
            <FiCheckCircle className="text-lg" />

            <span>
              ToDo{" "}
              <span className="font-semibold text-slate-800">
                Unplanned
              </span>
            </span>
          </div>

          {/* Add Todo Input */}
          <div
            className="
              bg-[#e4ebf5]
              rounded-xl
              shadow-[inset_4px_4px_8px_#c9d1d9,inset_-4px_-4px_8px_#ffffff]
              flex items-center
              px-4 py-3.5
              mt-2
            "
          >
            <FiPlus className="text-slate-400 mr-3 text-lg" />

            <input
              type="text"
              placeholder="Add todo, press ↵ ENTER to save"
              className="
                bg-transparent
                border-none
                outline-none
                w-full
                text-slate-600
                placeholder-slate-400
                font-medium
                text-sm
              "
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={handleAddTask}
            />
          </div>

          {/* Unplanned Accordion */}
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-3 cursor-pointer text-slate-600 font-medium">
              <FiChevronDown />

              <span>Unplanned</span>

              <span
                className="
                  bg-[#e4ebf5]
                  px-2 py-0.5
                  rounded-md
                  text-sm
                  font-bold
                  text-slate-500
                  shadow-[inset_2px_2px_4px_#c9d1d9,inset_-2px_-2px_4px_#ffffff]
                "
              >
                {unplannedTasks.length}
              </span>
            </div>

            <div className="pl-6 flex flex-col gap-3">
              <span className="text-sm text-slate-400 mb-1 font-medium">
                Without Project
              </span>

              {unplannedTasks.map((task) => (
                <div
                  key={task.id}
                  className="
                    bg-white/60
                    rounded-xl
                    p-3
                    shadow-[inset_2px_2px_5px_rgba(200,210,225,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]
                    flex items-center gap-3
                    border border-white/80
                    cursor-pointer
                    hover:bg-white
                    transition
                  "
                  onClick={() =>
                    updateStatus(task.id, "completed")
                  }
                >
                  <div className="w-5 h-5 rounded border-2 border-slate-300 flex items-center justify-center text-slate-500 hover:border-slate-500">
                    <FiCheckCircle
                      size={14}
                      className="opacity-0 hover:opacity-100"
                    />
                  </div>

                  <div className="flex-1 text-slate-700 font-medium text-sm">
                    {task.title}
                  </div>

                  <div className="flex gap-2">
                    <span
                      className="
                        text-xs
                        bg-slate-100
                        px-2.5 py-1
                        rounded-md
                        text-slate-600
                        font-medium
                        shadow-[inset_2px_2px_4px_rgba(180,190,205,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]
                        border border-slate-200
                        flex items-center gap-1
                      "
                    >
                      <FiCheckCircle size={10} />
                      HI-1
                    </span>

                    <span className="text-xs px-2 py-1 text-slate-400 font-medium">
                      HI-1
                    </span>
                  </div>
                </div>
              ))}

              {unplannedTasks.length === 0 && (
                <div className="text-sm text-slate-400 italic">
                  No unplanned tasks. Type above to add one.
                </div>
              )}
            </div>
          </div>

          {/* Other Accordions */}
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex items-center gap-3 cursor-pointer text-slate-500 font-medium">
              <FiChevronRight className="text-slate-400" />

              <span>Todo's</span>

              <span
                className="
                  bg-[#e4ebf5]
                  px-2 py-0.5
                  rounded-md
                  text-sm
                  font-bold
                  shadow-[inset_2px_2px_4px_#c9d1d9,inset_-2px_-2px_4px_#ffffff]
                "
              >
                0
              </span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer text-slate-500 font-medium">
              <FiChevronRight className="text-slate-400" />

              <span>Scheduled</span>

              <span
                className="
                  bg-[#e4ebf5]
                  px-2 py-0.5
                  rounded-md
                  text-sm
                  font-bold
                  shadow-[inset_2px_2px_4px_#c9d1d9,inset_-2px_-2px_4px_#ffffff]
                "
              >
                0
              </span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer text-slate-500 font-medium">
              <FiChevronRight className="text-slate-400" />

              <span>Done</span>

              <span
                className="
                  bg-[#e4ebf5]
                  px-2 py-0.5
                  rounded-md
                  text-sm
                  font-bold
                  shadow-[inset_2px_2px_4px_#c9d1d9,inset_-2px_-2px_4px_#ffffff]
                "
              >
                {completedTasks.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Section */}
      <div
        className="
          mt-10
          bg-[#e4ebf5]
          shadow-[inset_5px_5px_12px_#c9d1d9,inset_-5px_-5px_12px_#ffffff]
          rounded-[2rem]
          flex flex-col
          overflow-hidden
          border border-white/50
        "
      >
        <div className="text-slate-600 font-semibold p-6 border-b border-white flex justify-between items-center bg-white/30">
          <p>GitHub Contributions</p>

          <section className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="
                p-2
                rounded-xl
                text-slate-700
                text-sm
                shadow-[inset_2px_2px_5px_#c9d1d9,inset_-2px_-2px_5px_#ffffff]
                bg-transparent
                border-none
                focus:outline-none
                placeholder-slate-400
              "
              placeholder="Enter username"
            />

            <Button
              size="middle"
              onClick={() => {
                if (input.trim() !== "") {
                  setUsername(input.trim());
                }
              }}
              className="
                bg-slate-700
                text-white
                rounded-lg
                border-none
                shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]
                hover:bg-slate-800
              "
            >
              Save
            </Button>
          </section>
        </div>

        <div className="p-6">
          <GithubHeatmap username={safeUsername} />

          {/* Stats Grid */}
          <div className="flex justify-between items-center gap-5 mt-6">
            
            <div
              className="
                bg-[#e4ebf5]
                shadow-[inset_4px_4px_8px_#c9d1d9,inset_-4px_-4px_8px_#ffffff]
                rounded-xl
                p-4
                flex flex-col
                justify-center
                h-[90px]
                w-full
                text-slate-700
              "
            >
              <p className="text-sm font-medium text-slate-500">
                Repos
              </p>

              <h2 className="text-2xl font-bold">
                {githubData ? githubData.public_repos : "..."}
              </h2>
            </div>

            <div
              className="
                bg-[#e4ebf5]
                shadow-[inset_4px_4px_8px_#c9d1d9,inset_-4px_-4px_8px_#ffffff]
                rounded-xl
                p-4
                flex flex-col
                justify-center
                h-[90px]
                w-full
                text-slate-700
              "
            >
              <p className="text-sm font-medium text-slate-500">
                Followers
              </p>

              <h2 className="text-2xl font-bold">
                {githubData ? githubData.followers : "..."}
              </h2>
            </div>

            <div
              className="
                bg-[#e4ebf5]
                shadow-[inset_4px_4px_8px_#c9d1d9,inset_-4px_-4px_8px_#ffffff]
                rounded-xl
                p-4
                flex flex-col
                justify-center
                h-[90px]
                w-full
                text-slate-700
              "
            >
              <p className="text-sm font-medium text-slate-500">
                Following
              </p>

              <h2 className="text-2xl font-bold">
                {githubData ? githubData.following : "..."}
              </h2>
            </div>

            <div
              className="
                bg-[#e4ebf5]
                shadow-[inset_4px_4px_8px_#c9d1d9,inset_-4px_-4px_8px_#ffffff]
                rounded-xl
                p-4
                flex flex-col
                justify-center
                h-[90px]
                w-full
                text-slate-700
              "
            >
              <p className="text-sm font-medium text-slate-500">
                Current User
              </p>

              <h2 className="text-xl font-bold truncate">
                {safeUsername}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;