'use client';

const values = [
  { keyword: 'Discipline', definition: "Do what's planned, regardless of feelings" },
  { keyword: 'Consistency', definition: 'Do daily, even small, better than big then stop' },
  { keyword: 'Make the shit done', definition: 'Everything to conclusion (GO or KILL)' },
];

export default function CoreValues() {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
      {values.map((value) => (
        <div key={value.keyword} className="group relative">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 cursor-default tracking-wide uppercase">
            {value.keyword}
          </span>
          <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
            {value.definition}
            <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
          </div>
        </div>
      ))}
    </div>
  );
}
