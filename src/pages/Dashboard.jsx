import React from "react";
import { SparklesPreview } from "../components/ui/SparklesPreview";
import useTaskStore from "../data/taskStore";
import GithubHeatmap from "../components/GithubHeatmap";
import useGithubStore from "../data/githubStore";
import { Button } from "antd";

function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks);

  // Zustand username
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

  return (
    <div className="w-full h-full p-5 flex flex-col gap-5">

      {/* HEADER */}
      <div className="h-[250px]">
        <SparklesPreview />
      </div>

      {/* GITHUB SECTION */}
      <div className="h-full border border-white/30 rounded-md flex flex-col">

        {/* HEADER BAR */}
        <div className="text-white text-sm p-5 border-b border-white/20 flex justify-between items-center">
          <p>GitHub Contributions</p>

          <section className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="p-1.5 rounded text-white text-shadow-sm text-sm border border-white/30 focus:bg-linear-to-br from-slate-400 to-pink-400 focus:outline-none"
              placeholder="Enter username"
            />

            <Button
              size="middle"
              onClick={() => {
                if (input.trim() !== "") {
                  setUsername(input.trim());
                }
              }}
              className="bg-linear-to-bl! from-indigo-400! to-pink-400 px-5!   text-white!"
            >
              Save
            </Button>
          </section>
        </div>

       <section className="flex flex-col justify-evenly pb-5 h-full">
         {/* HEATMAP */}
        <div className="py-5 px-3">
          <GithubHeatmap username={safeUsername} />
        </div>

        {/* STATS GRID */}
        <div className="flex justify-between items-center  px-5 gap-5">

          <div className="bg-linear-to-bl from-indigo-400 to-pink-400 rounded-md p-4 flex flex-col justify-center h-[90px] w-full">
            <p className="text-sm">Repos</p>
            <h2 className="text-2xl font-bold">
              {githubData ? githubData.public_repos : "Loading..."}
            </h2>
          </div>

          <div className="bg-linear-to-bl from-indigo-400 to-pink-400 rounded-md p-4 flex flex-col justify-center h-[90px] w-full">
            <p className="text-sm">Followers</p>
            <h2 className="text-2xl font-bold">
              {githubData ? githubData.followers : "Loading..."}
            </h2>
          </div>

          <div className="bg-linear-to-bl from-indigo-400 to-pink-400 rounded-md p-4 flex flex-col justify-center h-[90px] w-full">
            <p className="text-sm">Following</p>
            <h2 className="text-2xl font-bold">
              {githubData ? githubData.following : "Loading..."}
            </h2>
          </div>

          <div className="bg-linear-to-bl from-indigo-400 to-pink-400 px-5 rounded-md p-4 flex flex-col justify-center h-[90px] w-full">
            <p className="text-sm">Current User</p>
            <h2 className="text-xl text-shadow-sm font-bold">
              {safeUsername}
            </h2>
          </div>

        </div>
       </section>

      </div>

    </div>
  );
}

export default Dashboard;