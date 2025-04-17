export function AlbionLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M256 32L32 144v224l224 112 224-112V144L256 32zm0 32l176 88-176 88-176-88 176-88zm-192 112l192 96v192L64 368V176zm384 0v192l-192 96V272l192-96z"
        fill="currentColor"
        className="text-amber-500"
      />
    </svg>
  )
}
