'use client';

interface Category {
    id: number;
    name: string;
    description: string;
    count: number;
    newCount: number;
    icon: string;
    color: string;
}

interface CategoryListProps {
    categories: Category[];
    onCategoryClick: (category: Category) => void;
}

export default function CategoryList({ categories, onCategoryClick }: CategoryListProps) {
    return (
        <div className="bg-white rounded-lg shadow w-full">
            <div className="p-4 md:p-6 border-b">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">资源分类导航</h2>
                <p className="text-gray-600 text-sm mt-1">选择您感兴趣的资源分类</p>
            </div>

            <div className="divide-y">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="p-4 md:p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onCategoryClick(category)}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                                <div
                                    className={`w-10 h-10 md:w-12 md:h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0`}
                                >
                                    {category.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 truncate">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-600 text-xs md:text-sm line-clamp-1">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-base md:text-lg font-bold text-blue-600">
                                            {category.count}
                                        </div>
                                        {category.newCount > 0 && (
                                            <div className="bg-red-500 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap">
                                                {category.newCount} 新
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500">个资源</div>
                                </div>
                                <div className="text-gray-400 hidden sm:block">
                                    <svg
                                        className="w-5 h-5 md:w-6 md:h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
