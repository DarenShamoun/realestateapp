const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; {new Date().getFullYear()} Real Estate Dashboard. All rights reserved.</p>
        {/* You can add additional links or information here */}
      </footer>
    );
};
  
export default Footer;