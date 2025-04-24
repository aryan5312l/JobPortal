export const SkeletonJobCard = () => {
    return (
        <div className="p-5 border rounded-md animate-pulse space-y-4 h-full bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-300 rounded" />
                    <div className="h-3 w-24 bg-gray-300 rounded" />
                </div>
            </div>
            <div className="h-4 w-40 bg-gray-300 rounded" />
            <div className="h-3 w-full bg-gray-300 rounded" />
            <div className="h-3 w-5/6 bg-gray-300 rounded" />
            <div className="flex space-x-2 mt-4">
                <div className="h-6 w-20 bg-gray-300 rounded" />
                <div className="h-6 w-16 bg-gray-300 rounded" />
                <div className="h-6 w-24 bg-gray-300 rounded" />
            </div>
        </div>
    );
};
