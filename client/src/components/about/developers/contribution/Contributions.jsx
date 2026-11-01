import React from 'react'
const Contributions = ({icon: Icon,point}) => {
  return (
    <div className="flex items-center gap-3 text-sm">
                     <div className="w-8 h-8 bg-[#E8EFF8] dark:bg-[#E8EFF8] rounded-lg flex items-center justify-center shrink-0">
                       <Icon className="text-[#2356A0] dark:text-[#D97706]" />
                     </div>
                     <span className="text-gray-700 dark:text-gray-300 font-medium">{point}</span>
                   </div>
  )
}

export default Contributions;