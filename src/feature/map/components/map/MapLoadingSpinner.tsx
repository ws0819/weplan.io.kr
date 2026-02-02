function MapLoadingSpinner() {
  return (
    <div className="w-full h-full bg-gray-100 flex-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-gray-600">지도를 불러오는 중...</p>
      </div>
    </div>
  );
}
export default MapLoadingSpinner