const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#179150]">
    <div className="text-center">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      </div>
      <br />
      <h5 className="mt-4 text-lg font-semibold text-[#179150] dark:text-[#179150]">
        Portail RH
      </h5>
      <p className="text-gray-[#179150] dark:text-gray-[#179150]">
        Vérification de votre session...
      </p>
    </div>
  </div>
);

export default LoadingSpinner;
