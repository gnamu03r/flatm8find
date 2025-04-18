const Layout = ({ children }) => {
    return (
      <div className="bg-dusk-900 text-white flex flex-col">
        {/* <header className="p-4 border-b border-dusk-700">
          <h1 className="text-xl font-bold">flatm8find</h1>
        </header> */}
        <main className="main_window">{children}</main>
        <footer className="footer">
          © 2025 flatm8find. All rights reserved.
        </footer>
      </div>
    );
  };
  export default Layout;
  