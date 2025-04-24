function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Cozy Corner</h3>
              <p className="text-sm">Your trusted real estate platform for finding the perfect home in India.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-blue-400">Home</a></li>
                <li><a href="/contact" className="hover:text-blue-400">Contact Us</a></li>
                <li><a href="/tenant" className="hover:text-blue-400">Find a Property</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <p className="text-sm">Email: support@cozycorner.in</p>
              <p className="text-sm">Phone: +91 123 456 7890</p>
              <p className="text-sm">Address: 123, MG Road, Bangalore, India</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400">Facebook</a>
                <a href="#" className="hover:text-blue-400">Twitter</a>
                <a href="#" className="hover:text-blue-400">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p className="text-sm">© 2025 Cozy Corner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;