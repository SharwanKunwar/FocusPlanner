import React from "react";
import {GitHubCalendar} from "react-github-calendar";

function GithubHeatmap({ username }) {
  if (!username) return null; // prevent crash

  return (
    <div className="flex justify-center p-3 overflow-x-auto">
      <GitHubCalendar
        username={username}
        colorScheme="light"
        blockSize={14}
        blockMargin={4}
        fontSize={13}
      />
    </div>
  );
}

export default GithubHeatmap;