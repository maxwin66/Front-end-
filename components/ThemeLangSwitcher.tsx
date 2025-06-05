import React from "react";

const ThemeLangSwitcher = () => {
  return (
    <div className="fixed top-4 left-4 flex gap-2 z-10">
      <button className="px-3 py-1 rounded-md bg-white/80 text-blue-900 text-sm font-medium">
        Biru Langit
      </button>
      <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/80 text-blue-900 text-sm font-medium">
        <img
          src="https://raw.githubusercontent.com/Minatoz997/myImages/main/id.png"
          alt="Indonesia"
          className="w-4 h-4"
        />
        Indonesia
      </div>
    </div>
  );
};

export default ThemeLangSwitcher;
