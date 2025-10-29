interface TabItem {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = ''
}: TabNavigationProps) {
  return (
    <div className={`flex items-center bg-gray-100 rounded-full ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-colors font-bold ${
            activeTab === tab.id
              ? 'bg-yellow-400 text-black'
              : 'bg-transparent text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
