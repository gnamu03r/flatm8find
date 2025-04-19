import '../components/layout.css'
const Layout = ({ children }) => {
    return (
      <div className="">
        <main className="main_window">{children}</main>
        <footer className="footer">
          © 2025 flatm8find. All rights reserved.
        </footer>
      </div>
    );
  };
  export default Layout;
  