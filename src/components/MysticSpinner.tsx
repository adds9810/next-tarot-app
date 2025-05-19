export default function MysticSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"
        role="presentation"
        aria-hidden="true"
      />
      {/* 스크린 리더 전용 로딩 텍스트 */}
      <span className="sr-only">로딩 중...</span>
    </div>
  );
}
