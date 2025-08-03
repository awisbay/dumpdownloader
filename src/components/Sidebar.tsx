import React from 'react';
import { 
  Download, 
  ChevronRight,
  Server
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  children?: SidebarItem[];
}

interface SidebarProps {
  selectedItem: string;
  onItemSelect: (itemId: string) => void;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'downloader',
    label: 'Downloader',
    icon: Download,
    children: [
      { id: 'allip-bsc', label: 'Allip BSC', icon: Server },
      { id: 'migration-modump', label: 'Migration Modump', icon: Server },
      { id: 'rnc-modump-sunset', label: 'RNC Modump Sunset', icon: Server },
      { id: 'rbs-modump-sunset', label: 'RBS Modump Sunset', icon: Server },
      { id: 'lte-to-utran', label: 'LTE to UTRAN', icon: Server }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ selectedItem, onItemSelect }) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['downloader']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isSelected = selectedItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            }
            onItemSelect(item.id);
          }}
          className={`
            w-full flex items-center px-3 py-2.5 text-left rounded-lg transition-all duration-200
            ${isSelected ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'}
            ${level > 0 ? 'ml-4 text-sm' : 'font-medium'}
          `}
        >
          <item.icon className={`h-4 w-4 mr-3 ${level > 0 ? 'opacity-70' : ''}`} />
          <span className="flex-1">{item.label}</span>
          {hasChildren && (
            <ChevronRight 
              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
            />
          )}
        </button>
        
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700 p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Server className="h-6 w-6 mr-2 text-blue-500" />
          IRS Dump Downloader
        </h2>
      </div>
      
      <nav className="space-y-2">
        {sidebarItems.map(item => renderItem(item))}
      </nav>
    </div>
  );
};