const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-700 p-10 text-white lg:flex">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">
              WorkBridge
            </h1>

            <p className="mt-6 text-lg leading-8">
              Secure workforce management platform connecting workers,
              employers, labour officers, police, insurance providers,
              and administrators.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;