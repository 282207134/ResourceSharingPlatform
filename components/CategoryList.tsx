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
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b w-[1008px] h-[130px]">
                <h2 className="text-xl font-bold text-gray-800">资源分类导航</h2>
                <p className="text-gray-600 text-sm mt-1 h-[12px]">选择您感兴趣的资源分类</p>
            </div>

            <div className="divide-y">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors rounded-[41px] h-[85px] w-[843px]"
                        onClick={() => onCategoryClick(category)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div
                                    className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-xl`}
                                >
                                    {category.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm">{category.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-lg font-bold text-blue-600">
                                            {category.count}
                                        </div>
                                        {category.newCount > 0 && (
                                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                {category.newCount} 新
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">个资源</div>
                                </div>
                                <div className="text-gray-400">
                                    <svg
                                        className="w-6 h-6"
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
