'use client';

interface NavigationProps {
    activeTab: string;
    tabs: Array<{ key: string; label: string }>;
    onTabClick: (tabKey: string) => void;
}

export default function Navigation({ activeTab, tabs, onTabClick }: NavigationProps) {
    return (
        <nav className="bg-blue-600 text-white">
            <div className="container mx-auto px-4">
                <div className="flex space-x-8 h-[40px]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => onTabClick(tab.key)}
                            className={`py-3 px-2 border-b-2 transition-colors ${
                                activeTab === tab.key
                                    ? 'border-white bg-blue-700'
                                    : 'border-transparent hover:bg-blue-700'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
