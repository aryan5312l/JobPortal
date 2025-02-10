import React from 'react'

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8 w-full mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* About Us Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">About Us</h4>
          <p className="text-sm">
            We are a job portal connecting top talents with the best companies.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul>
            <li className="mb-1">
              <a href="/home" className="hover:underline">
                Home
              </a>
            </li>
            <li className="mb-1">
              <a href="/jobs" className="hover:underline">
                Jobs
              </a>
            </li>
            <li className="mb-1">
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
          <p className="text-sm">Email: support@jobportal.com</p>
          <p className="text-sm">Phone: +1 234 567 890</p>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
