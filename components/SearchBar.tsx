'use client';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearch: () => void;
}

export default function SearchBar({ searchQuery, onSearchChange, onSearch }: SearchBarProps) {
    return (
        <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="搜索知识内容..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={onSearch}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        搜索
                    </button>
                </div>
            </div>
        </div>
    );
}
