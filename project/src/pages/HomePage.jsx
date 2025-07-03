import React from "react";
import HeroSection from "../components/HeroSection";
import ServiceCard from "../components/ServiceCard";
import TestimonialCard from "../components/TestimonialCard";
import { Link } from "react-router-dom";

function HomePage() {
  const services = [
    {
      title: "General Dentistry",
      description: "Comprehensive care for your dental health including cleanings, fillings, and preventive treatments.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"></svg></svg></svg></svg></svg>
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1h6v4H7V6zm6 6H7v2h6v-2z" clipRule="evenodd"></path>
          <path d="M6 3a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H6z"></path>
        </svg>
    },
    {
      title: "Cosmetic Dentistry",
      description: "Enhance your smile with our cosmetic procedures including whitening, veneers, and bonding.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
        </svg>
    },
    {
      title: "Orthodontics",
      description: "Straighten your teeth with our modern orthodontic treatments including braces and clear aligners.",
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
        </svg>
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "I've been coming to BrightSmile Dental for years. The staff is always friendly and professional. Dr. Smith is the best dentist I've ever had!",
      rating: 5
    },
    {
      name: "Michael Brown",
      text: "I was always afraid of going to the dentist until I found BrightSmile. They make me feel comfortable and explain everything they're doing.",
      rating: 5
    },
    {
      name: "Emily Davis",
      text: "The entire team is amazing! My kids love coming here, which says a lot about a dental office. Highly recommend for families.",
      rating: 4
    }
  ];

  return (
    <div></div><HeroSection />
      </HeroSection>
      {/* Why Choose Us Section */}</HeroSection>
      <section className="section bg-gray-50"></section>
        <div className="container mx-auto"></div></div></div></div></div>
          <div className="text-center mb-12"></div></div></div></div></div>
            <h2 className="text-3xl font-bold mb-4">Why Choose BrightSmile Dental?</h2><p className="text-xl text-gray-600 max-w-3xl mx-auto"></p></p></p>
              We combine advanced technology with compassionate care to provide you with the best dental experience.</p>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8"></div></div></div>
            <div className="text-center"></div></div></div></div></div>
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"></div></div></div></div></div>
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"></svg></svg></svg></svg></svg>
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Experienced Team</h3>
              <p className="text-gray-600">Our doctors have over 15 years of experience in various dental specialties.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Technology</h3>
              <p className="text-gray-600">We use the latest dental technology to provide efficient and comfortable treatments.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Patient-Centered Care</h3>
              <p className="text-gray-600">We focus on your comfort and satisfaction throughout your dental experience.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="section"></section>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a comprehensive range of dental services to meet all your oral health needs.</p>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (</div>
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
              />}
          </div>
          
          <div className="text-center mt-10"></div>
            <Link to="/services" className="btn btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="section bg-blue-50"></section>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Patients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our patients have to say about their experience.</p>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (</div>
              <TestimonialCard
                key={index}
                name={testimonial.name}
                text={testimonial.text}
                rating={testimonial.rating}
              />}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16"></section>
        <div className="container mx-auto text-center"></div>
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

export default HomePage;
