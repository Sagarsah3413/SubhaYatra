import React from 'react'
const Contributions = ({icon: Icon,point}) => {
  return (
    <div className="flex items-center gap-3 text-sm">
                     <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center shrink-0">
                       <Icon className="text-teal-600 dark:text-teal-400" />
                     </div>
                     <span className="text-gray-700 dark:text-gray-300 font-medium">{point}</span>
                   </div>
  )
}

export default Contributions;