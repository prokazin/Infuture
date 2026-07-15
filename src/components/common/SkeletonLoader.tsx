import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  count?: number;
  type?: 'card' | 'product';
}

const SkeletonLoader = ({ count = 4, type = 'card' }: SkeletonLoaderProps) => {
  if (type === 'product') {
    return (
      <div className="space-y-4">
        <div className="aspect-square bg-gray-800 rounded-2xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 bg-gray-800 rounded-lg animate-pulse w-3/4" />
          <div className="h-4 bg-gray-800 rounded-lg animate-pulse w-1/2" />
          <div className="h-6 bg-gray-800 rounded-lg animate-pulse w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="aspect-square bg-gray-800 animate-pulse" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-800 rounded animate-pulse w-1/2" />
            <div className="h-6 bg-gray-800 rounded animate-pulse w-1/3" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
