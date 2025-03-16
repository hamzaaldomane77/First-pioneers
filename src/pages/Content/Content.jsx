import React, { useState } from 'react'
import Contact from "../../assets/images/Contact.png"

const Content = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen flex flex-col">
   
      <div 
        className="w-full h-[70vh] md:h-[100vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${Contact})` }}
      ></div>
      
      <div className="w-full bg-white flex-grow"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 -mt-[30vh] md:-mt-[40vh] relative z-40">
        <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
       
            <div className="w-full md:w-2/5 bg-opacity-100 p-6 md:p-10 flex flex-col justify-stretch">
              <h2 className="text-2xl md:text-3xl font-bold text-red-800">Get In Touch</h2>
              <p className="text-gray-700 py-4 md:py-6 text-sm md:text-base">
              We'd love to hear from you! Whether you have a question about our services, need assistance with a project, or just want to learn more about how we can help your business, our team is here to support you.
              </p>
              <p className='py-3 md:py-5 text-[13px] md:text-[15px]'>
                Working Hours
                <br />
                - Sunday to Thursday: 9:00 AM – 6:00 PM (GMT+3)
              </p>
              <p className='text-[12px] md:text-[13px] text-gray-800 py-2 md:py-3 w-full md:w-[450px]'>
                We strive to respond to all inquiries within 24 hours during working days. If you reach out outside of these hours, we'll get back to you as soon as we're back in the office.
              </p>

              <div className="space-y-3 md:space-y-4 text-gray-700 mt-2">
                <div className="flex items-start">
                  <svg className="h-5 w-5 md:h-6 md:w-6 text-red-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm md:text-base">8819 Ohio St. South Gate, CA 90280</p>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 md:h-6 md:w-6 text-red-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm md:text-base">Ourstudio@hello.com</p>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 md:h-6 md:w-6 text-red-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p className="text-sm md:text-base">+1 386-688-3295</p>
                </div>
              </div>
              
              {/* إضافة قسم وسائل التواصل الاجتماعي */}
              <div className="mt-6 md:mt-8">
                <h3 className="text-lg md:text-xl font-semibold text-red-800 mb-3">Social Media</h3>
                <div className="flex space-x-4">
                  {/* أيقونة Facebook */}
                  <a href="#" className="text-gray-600 hover:text-red-800 transition-colors">
                    <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                  {/* أيقونة Instagram */}
                  <a href="#" className="text-gray-600 hover:text-red-800 transition-colors">
                    <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.055-.059 1.37-.059 4.04 0 2.67.01 2.986.059 4.04.045.975.207 1.504.344 1.857.181.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.046 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.352.3-.882.344-1.857.047-1.054.059-1.37.059-4.04 0-2.67-.01-2.986-.059-4.04-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.047-1.37-.059-4.04-.059zm0 3.063a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 8.468a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm6.538-8.469a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
                    </svg>
                  </a>
                  {/* أيقونة YouTube */}
                  <a href="#" className="text-gray-600 hover:text-red-800 transition-colors">
                    <svg className="h-6 w-6 md:h-7 md:w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* القسم الأيمن - النموذج */}
            <div className="w-full md:w-3/5 p-4 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 bg-white p-5 md:p-10 border-52 rounded-2xl ">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    name="fullName"
                    placeholder='Your Full Name'
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-white bg-opacity-75"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder='Your Email'
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-white bg-opacity-75"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className='text-[10px]'>(optional)</span></label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    placeholder='e.g: +963*********(optional)'
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-white bg-opacity-75"
                  />
                  <p className='text-[10px] pt-2 leading-4'>Please add country code to your phone number.</p>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder='Your message'
                    rows="5" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 bg-white bg-opacity-70"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button 
                    type="submit" 
                    className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-red-800 text-white font-medium rounded-md hover:bg-red-900 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16"></div>
    </div>
  )
}

export default Content