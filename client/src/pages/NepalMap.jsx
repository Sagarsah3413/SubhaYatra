import React from "react";

export default function NepalMap() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex-1 flex justify-center items-center p-6">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d353942.1499881535!2d83.91290000000002!3d28.230100000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1f2b0d28c1d7%3A0xe4c1aa4234c6f84!2sNepal!5e0!3m2!1sen!2sus!4v1699274399145!5m2!1sen!2sus"
          width="100%"
          height="600"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Nepal Map"
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  );
}
