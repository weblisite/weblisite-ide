import React, { useState } from "react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: "general"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    alert("Thank you for your message! We will contact you shortly.");
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
      service: "general"
    });
  };

  return (
    <div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div>
      {/* Hero Section */}</div>
      <div className="bg-blue-600 text-white py-16"></div>
        <div className="container mx-auto px-4 text-center"></div>
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1><p className="text-xl max-w-3xl mx-auto"></p>
            We're here to help with all your dental needs. Reach out to us with any questions or to schedule an appointment.</p>
          </p>
        </div>
      </div>
      
      {/* Contact Information & Form */}
      <section className="section"></section>
        <div className="container mx-auto px-4"></div></div></div>
          <div className="flex flex-col md:flex-row gap-12"></div>
            {/* Contact Information */}</div>
            <div className="md:w-1/3"></div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6"></div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Office Location</h3>
                  <p className="text-gray-600"></p></p></p></p></p>
                    123 Dental Street<br />
                    New York, NY 10001
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Office Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 8am - 6pm<br />
                    Saturday: 9am - 4pm<br />
                    Sunday: Closed
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <p className="text-gray-600 mb-2"></p></p></p>
                    <span className="font-medium">Phone:</span> (123) 456-7890
                  </p>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Email:</span> info@brightsmile.com
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Emergency:</span> (123) 456-7899
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                  <div className="flex space-x-4"></div>
                    <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors"></a></a></a></a></a></a></a>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"></svg></svg></svg></svg></svg></svg></svg>
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm4.957 7.571l-.012.168c0 3.359-2.557 7.230-7.23 7.230-1.436 0-2.77-.421-3.896-1.14.199.023.399.033.599.033 1.176 0 2.259-.4 3.115-1.069-1.099-.021-2.026-.745-2.346-1.741.154.029.312.044.475.044.23 0 .453-.031.664-.086-1.146-.23-2.011-1.244-2.011-2.458v-.032c.337.188.723.302 1.133.315-.673-.449-1.116-1.216-1.116-2.086 0-.459.124-.89.34-1.26 1.236 1.516 3.083 2.512 5.165 2.616-.043-.188-.065-.384-.065-.585 0-1.417 1.149-2.566 2.566-2.566.738 0 1.405.311 1.872.811.584-.115 1.133-.327 1.629-.621-.192.599-.599 1.103-1.129 1.421.518-.062 1.011-.2 1.47-.404-.342.518-.776.969-1.277 1.33z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm-1.2 15.89h-2.48V9.56h2.48v8.33zm-1.24-9.46c-.79 0-1.43-.64-1.43-1.43s.64-1.42 1.43-1.42c.79 0 1.43.64 1.43 1.42s-.64 1.43-1.43 1.43zm10.44 9.46h-2.48v-3.89c0-.92-.02-2.1-1.28-2.1-1.28 0-1.48 1-1.48 2.04v3.95h-2.47V9.56h2.37v1.08h.03c.35-.67 1.2-1.37 2.47-1.37 2.64 0 3.13 1.74 3.13 4v4.62z"></path>
                      </svg>
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:w-2/3"></div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md"></form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"></div></div></div>
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2"></label>
                      Your Name*</label>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2"></label>
                      Email Address*</label>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2"></label>
                      Phone Number</label>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-gray-700 font-medium mb-2"></label>
                      Service of Interest</label>
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></select>
                      <option value="general">General Dentistry</option>
                      <option value="cosmetic">Cosmetic Dentistry</option>
                      <option value="orthodontics">Orthodontics</option>
                      <option value="pediatric">Pediatric Dentistry</option>
                      <option value="surgery">Oral Surgery</option>
                      <option value="emergency">Emergency Care</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-6"></div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2"></label>
                    Your Message*</label>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full md:w-auto"
                ></button>
                  Send Message</button>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="section bg-gray-50"></section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"></div>
            <h2 className="text-3xl font-bold mb-4">Our Location</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto"></p>
              We're conveniently located in downtown with easy access to public transportation and parking.</p>
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md"></div>
            {/* Replace with actual Google Maps embed in a real application */}</div>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"></div>
              <div className="w-full h-96 bg-gray-300 flex items-center justify-center"></div>
                <p className="text-gray-600">Google Maps would be embedded here in a real application</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
