import Contributions from './contribution/Contributions'
import Contact from './contact/contact'

const Developers = ({ name, image, intro, position, description, contribution, contact }) => {
  return (
    <div className="group bg-linear-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-4 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-slate-700/50 hover:scale-105 flex flex-col items-center md:block ">

      {/* Profile Image */}
      <div className="relative mb-2 md:mb-4 w-full flex justify-center">
        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-300 bg-linear-to-br from-teal-500 to-cyan-500">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-linear-to-br from-teal-500 to-cyan-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold shadow-lg whitespace-nowrap">
          {position}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white mt-2 md:mt-0 mb-2 text-center">    {name}
      </h3>

      {/* Hidden on mobile */}
      <div className="hidden md:block w-full">
        <p className="text-teal-600 dark:text-teal-400 font-semibold mb-4 text-center">{intro}</p>
        <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6">{description}</p>

        <div className="space-y-3 mb-6">
          {contribution.map((item, index) => (
            <Contributions key={index} {...item} />
          ))}
        </div>

        <div className="flex justify-center gap-3">
          {contact.map((item, index) => (
            <Contact key={index} {...item} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Developers