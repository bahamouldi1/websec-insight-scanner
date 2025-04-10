
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, animated = true }) => {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={cn(
          "h-full bg-websec-blue transition-all",
          animated && normalizedProgress > 0 && normalizedProgress < 100 && "animate-progress-bar"
        )}
        style={{ width: `${normalizedProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
