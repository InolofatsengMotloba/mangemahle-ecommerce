import React from "react";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiAward,
  FiTarget,
  FiEye,
} from "react-icons/fi";

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#385941] mb-4">
          About Mangemahle Trading (PTY) LTD
        </h1>
        <div className="w-24 h-1 bg-[#94bb9f] mx-auto"></div>
      </header>

      {/* Mission Section */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex items-center mb-4">
          <FiTarget className="text-[#94bb9f] mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Our Mission</h2>
        </div>
        <div className="space-y-4 text-gray-600">
          <p>
            To actively contribute to the economies of South Africa and all of
            Africa by offering top-notch professional products and services. By
            fostering economic growth and job creation, we aim to reduce
            poverty.
          </p>
          <p>
            Our focus is on providing both the public and private sectors with
            exceptional quality and customer service, while employing young
            unemployed people in the area as unskilled and semi-skilled
            laborers.
          </p>
          <p>
            We are committed to meeting all requirements for the implementation
            of the affirmative action policy by providing skill transfers to
            locals and utilizing the local labor force.
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex items-center mb-4">
          <FiEye className="text-[#94bb9f] mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Our Vision</h2>
        </div>
        <p className="text-gray-600">
          To expand the nation&apos;s economy with a greater emphasis on the ICT
          sector by providing high-quality goods and services that address
          domestic and international challenges. Our priorities include
          alleviating poverty, enhancing infrastructure, fostering positive
          reliance within South Africa, raising living standards, helping
          community development, and ensuring successful program implementation.
        </p>
      </section>

      {/* Company Info */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Company Background
        </h2>
        <div className="space-y-4 text-gray-600">
          <p>
            Mangemahle Trading Pty Ltd is a 100% South African black women-owned
            business dedicated to building the economy of South Africa and
            creating job opportunities across Africa.
          </p>
          <p>
            Founded in 2014 by Vuyelwa Hesewu and Bongelwa Patricia Ntsonge with
            six additional employees, we currently have offices in Mthatha and
            East London.
          </p>
          <p>
            We specialize in ICT solutions with a focus on digital branding and
            printing. As we grow, we are committed to providing our customers
            with the best possible service and satisfaction, expanding our reach
            from province to province and nation to nation.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Our Innovative Solution
        </h2>
        <p className="text-gray-600 mb-4">
          We&apos;ve developed smart shopping carts equipped with cutting-edge
          technology to transform the retail sector:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>Track items as customers add them to their cart</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>Calculate totals in real-time</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>Help customers manage time and spending</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>Provide inventory management updates</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>Enable quick payment through built-in scanners</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>Offer indoor navigation in large stores</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>Enhance security against shoplifting</span>
          </li>
        </ul>
      </section>

      {/* Achievements */}
      <section className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex items-center mb-4">
          <FiAward className="text-[#94bb9f] mr-3" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            Our Recognition
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          We&apos;ve been selected by DTIC through organizations like SEDA,
          ECDC, and the South African Electrotechnical Export Council to exhibit
          our solutions internationally:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>Global Tech Exhibition in UAE (2022, 2023)</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#94bb9f] mr-2">•</span>
            <span>GITEX Africa in Morocco (2024)</span>
          </li>
        </ul>
      </section>

      {/* Contact Info */}
      <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
          <div>
            <div className="flex items-start mb-4">
              <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
                <FiPhone className="text-[#385941]" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Phone</h3>
                <p>078244418 / 0815094582</p>
              </div>
            </div>

            <div className="flex items-start mb-4">
              <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
                <FiMail className="text-[#385941]" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Email</h3>
                <p>vuvuheswu2@gmail.com</p>
                <p>mmttrading8@gmail.com</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-start mb-4">
              <div className="bg-[#f0f7f2] p-2 rounded-lg mr-3">
                <FiMapPin className="text-[#385941]" size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Offices</h3>
                <p>No 77 John Beer Drive, Northcrest, Mthatha 5100</p>
                <p>No 24 Mhlontlo Avenue, Sunny Ridge, East London 5200</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            <strong>Entity Name:</strong> Mangemahle Trading Pty Ltd
          </p>
          <p className="text-sm text-gray-500">
            <strong>Registration:</strong> 2014/050808/07
          </p>
          <p className="text-sm text-gray-500">
            <strong>Contact Person:</strong> Ms Vuyelwa Hesewu
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
