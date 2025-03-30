import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Youtube, FileText, FileQuestion } from "lucide-react"

export const CustomNode = memo(({ data, isConnectable }: NodeProps) => {
  const getResourceIcon = () => {
    switch (data.resourceType) {
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />
      case "article":
        return <FileText className="h-4 w-4 text-blue-500" />
      default:
        return <FileQuestion className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="group relative px-4 py-2 rounded-lg shadow-md border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 min-w-[150px] transition-all duration-300 hover:shadow-lg hover:border-purple-400 dark:hover:border-purple-600">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500 border-2 border-white dark:border-gray-800"
      />

      <div className="flex items-center justify-between mb-1">
        <div className="font-medium text-purple-800 dark:text-purple-300 truncate mr-2">{data.label}</div>
        {getResourceIcon()}
      </div>

      {data.description && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{data.description}</div>}

      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-purple-200 dark:border-t-purple-800 group-hover:border-t-purple-400 dark:group-hover:border-t-purple-600 transition-colors duration-300"></div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-indigo-500 border-2 border-white dark:border-gray-800"
      />
    </div>
  )
})

CustomNode.displayName = "CustomNode"

