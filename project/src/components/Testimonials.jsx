import React from 'react';

const testimonials = [
  {
    content: "This platform has transformed our business operations completely. The intuitive interface and powerful features have saved us countless hours of work.",
    author: "Sarah Williams",
    role: "CEO, TechForward"
  },
  {
    content: "The customer support team is exceptional. They've been with us every step of the way, ensuring our implementation was smooth and successful.",
    author: "David Chen",
    role: "CTO, Innovate Inc"
  },
  {
    content: "We've tried many similar solutions, but nothing compares to the reliability and performance we've experienced with this product.",
    author: "Rebecca Martin",
    role: "Operations Director, Global Enterprises"
  }
];

const Testimonials = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            What our customers say
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Don't just take our word for it, see what our customers have to say about us.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="text-gray-600 italic mb-4">"{testimonial.content}"</div>
                <div className="font-medium text-gray-900">{testimonial.author}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;