const Contact = ({ icon: IconComponent, link }) => {
  return (
    <a href={link} className="w-10 h-10 bg-linear-to-r from-blue-500 to-[#1A2E4A] rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform">
      <IconComponent />
    </a>
  )
}

export default Contact;