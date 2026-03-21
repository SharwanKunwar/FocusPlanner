import React, { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";

function GithubHeatmap({ username }) {
  const [sizes, setSizes] = useState({
    blockSize: 15,
    blockMargin: 5,
    fontSize: 12,
  });

  useEffect(() => {
    function updateSizes() {
      const vh = window.innerHeight;

      setSizes({
        blockSize: vh * 0.02,     // 2% of screen height
        blockMargin: vh * 0.005,  // 0.5%
        fontSize: vh * 0.015,     // 1.5%
      });
    }

    updateSizes();
    window.addEventListener("resize", updateSizes);

    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  if (!username) return null;

  return (
    <div className="flex justify-center p-3 overflow-x-auto">
      <GitHubCalendar
        username={username}
        year={new Date().getFullYear()}
        colorScheme="light"
        blockSize={sizes.blockSize}
        blockMargin={sizes.blockMargin}
        fontSize={sizes.fontSize}
      />
    </div>
  );
}

export default GithubHeatmap;