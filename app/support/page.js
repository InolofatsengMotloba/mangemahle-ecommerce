import React from "react";
import {
  FiHelpCircle,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiClock,
  FiTruck,
} from "react-icons/fi";

const SupportPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#385941] mb-4">
          Customer Support
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We&apos;re here to help you with any questions about our products,
          orders, or services.
        </p>
        <div className="w-24 h-1 bg-[#94bb9f] mx-auto mt-4"></div>
      </header>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Contact Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
              <FiHelpCircle className="text-[#385941]" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Contact Support
            </h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start">
              <FiMail className="text-[#94bb9f] mr-3 mt-1" size={18} />
              <div>
                <h3 className="font-medium text-gray-700">Email Us</h3>
                <p>support@mangemahle.com</p>
                <p className="text-sm text-gray-500">
                  Typically responds within 24 hours
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FiPhone className="text-[#94bb9f] mr-3 mt-1" size={18} />
              <div>
                <h3 className="font-medium text-gray-700">Call Us</h3>
                <p>+27 78 244 418</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9am-5pm SAST</p>
              </div>
            </div>
            <div className="flex items-start">
              <FiMessageSquare className="text-[#94bb9f] mr-3 mt-1" size={18} />
              <div>
                <h3 className="font-medium text-gray-700">Live Chat</h3>
                <p>Available during business hours</p>
                <button className="mt-2 text-sm text-[#385941] hover:underline">
                  Start Chat →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
              <FiHelpCircle className="text-[#385941]" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">FAQs</h2>
          </div>
          <div className="space-y-4 text-gray-600">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-700">
                How do I track my order?
              </h3>
              <p className="text-sm mt-1">
                Once shipped, you&apos;ll receive a tracking number via email to
                monitor your package&apos;s journey.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-700">
                What&apos;s your return policy?
              </h3>
              <p className="text-sm mt-1">
                We accept returns within 30 days of purchase. Items must be
                unused and in original packaging.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <h3 className="font-medium text-gray-700">
                What payment methods do you accept?
              </h3>
              <p className="text-sm mt-1">
                We accept all major credit cards, PayPal, and bank transfers.
              </p>
            </div>
            <button className="text-sm text-[#385941] hover:underline mt-2">
              View all FAQs →
            </button>
          </div>
        </div>
      </div>

      {/* Order Support */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
            <FiTruck className="text-[#385941]" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Order Support</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Shipping Information
            </h3>
            <p className="text-sm">
              We ship nationwide with delivery times ranging from 3-7 business
              days.
            </p>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Returns & Exchanges
            </h3>
            <p className="text-sm">
              Easy 30-day return policy. Contact us to initiate a return.
            </p>
          </div>
          <div className="border border-gray-100 rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">Order Status</h3>
            <p className="text-sm">
              Check your order status by logging into your account or contacting
              us.
            </p>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center mb-4">
          <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
            <FiClock className="text-[#385941]" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Business Hours
          </h2>
        </div>
        <div className="text-gray-600">
          <div className="grid grid-cols-2 gap-4 max-w-xs">
            <div>Monday - Friday:</div>
            <div className="font-medium">9:00 AM - 5:00 PM</div>
            <div>Saturday:</div>
            <div className="font-medium">9:00 AM - 1:00 PM</div>
            <div>Sunday:</div>
            <div className="font-medium">Closed</div>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            *Closed on South African public holidays
          </p>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
