import { useState } from 'react';
import { resourceCategories, initialCategoryResources } from '../data/mockData';

export function useAppState() {
    const [activeTab, setActiveTab] = useState('home');
    const [currentView, setCurrentView] = useState('categories');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const [userPoints, setUserPoints] = useState(1650);
    const [searchQuery, setSearchQuery] = useState('');
    const [purchasedResources, setPurchasedResources] = useState<Set<number>>(new Set());
    const [categories, setCategories] = useState(resourceCategories);
    const [categoryResources, setCategoryResources] = useState(initialCategoryResources);

    return {
        activeTab,
        setActiveTab,
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        selectedResource,
        setSelectedResource,
        userPoints,
        setUserPoints,
        searchQuery,
        setSearchQuery,
        purchasedResources,
        setPurchasedResources,
        categories,
        setCategories,
        categoryResources,
        setCategoryResources,
    };
}
