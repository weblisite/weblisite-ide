import React from "react";
import { Link } from "react-router-dom";

function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "General Dentistry",
      description: "Our general dentistry services focus on the prevention, diagnosis, and treatment of common dental issues. We provide comprehensive exams, professional cleanings, fillings, root canals, and more to maintain your oral health.",
      image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Cosmetic Dentistry",
      description: "Transform your smile with our cosmetic dentistry services. We offer teeth whitening, porcelain veneers, dental bonding, and smile makeovers to help you achieve the smile you've always wanted.",
      image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Orthodontics",
      description: "Straighten your teeth and correct your bite with our orthodontic treatments. We offer traditional braces, clear aligners, and other orthodontic solutions for patients of all ages.",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Pediatric Dentistry",
      description: "We provide specialized dental care for children in a friendly and comfortable environment. Our pediatric services include preventive care, fluoride treatments, sealants, and education on proper oral hygiene.",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "Oral Surgery",
      description: "Our oral surgery services include tooth extractions, wisdom teeth removal, dental implant placement, and treatment of oral pathologies. We ensure your comfort throughout any surgical procedure.",
      image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "Emergency Dental Care",
      description: "We understand that dental emergencies can happen at any time. Our emergency dental services are available to provide prompt relief from pain and address urgent dental issues.",
      image: "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div></div></div></div></div>
      {/* Hero Section */}</div>
      <div className="bg-blue-600 text-white py-16"></div>
        <div className="container mx-auto px-4 text-center"></div>
          <h1 className="text-4xl font-bold mb-4">Our Dental Services</h1><p className="text-xl max-w-3xl mx-auto"></p>
            We offer a comprehensive range of dental services to meet all your oral health needs and help you achieve a beautiful, healthy smile.</p>
          </p>
        </div>
      </div>
      
      {/* Services List */}
      <section className="section"></section>
        <div className="container mx-auto px-4"></div></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12"></div>
            {services.map((service) => (</div>
              <div key={service.id} className="flex flex-col md:flex-row gap-6 service-card p-0 overflow-hidden"></div>
                <div className="md:w-1/3"></div>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6"></div>
                  <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors"></button>
                    Learn more →</button>
                  </button>
                </div>
              </div>}
          </div>
        </div>
      </section>
      
      {/* Insurance Section */}
      <section className="section bg-gray-50"></section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12"></div>
            <h2 className="text-3xl font-bold mb-4">Insurance & Payment Options</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto"></p>
              We accept most major insurance plans and offer flexible payment options to make dental care accessible to everyone.</p>
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"></div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Accepted Insurance Plans</h3>
                <ul className="space-y-2 text-gray-600"></ul></ul></ul>
                  <li className="flex items-center"></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li></li>
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg></svg>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Delta Dental
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Cigna
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Aetna
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    MetLife
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Guardian
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    And many more...
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-4">Payment Options</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Cash
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Credit Cards (Visa, MasterCard, Amex)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Flexible Spending Accounts (FSA)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    Health Savings Accounts (HSA)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    CareCredit Financing
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    In-house Payment Plans
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center"></div>
              <p className="mb-4 text-gray-600"></p>
                Not sure if your insurance is covered? Have questions about payment options? Contact our office for assistance.</p>
              </p>
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16"></section>
        <div className="container mx-auto text-center px-4"></div>
          <h2 className="text-3xl font-bold mb-4">Ready to Schedule Your Visit?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto"></p>
            Contact us today to book your appointment. New patients are always welcome!</p>
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"></div>
            <Link to="/contact" className="btn bg-white text-blue-600 hover:bg-blue-50">
              Book Appointment
            </Link>
            <a href="tel:+1234567890" className="btn bg-transparent border border-white hover:bg-blue-700"></a>
              Call Us: (123) 456-7890</a>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;
