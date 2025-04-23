import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-[#0B0C2A]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-3xl font-serif text-[#FFD700]">
              Whispers of the Stars
            </Link>
            <Link
              href="/intro"
              className="text-[#BFA2DB] hover:text-[#FFD700] transition-colors"
            >
              인트로
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              href="/login"
              className="border-2 border-[#BFA2DB] text-[#BFA2DB] hover:bg-[#BFA2DB]/10 px-6 py-2 rounded-full transition-all duration-300"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="bg-[#FFD700] text-[#0B0C2A] hover:bg-[#FFD700]/90 px-6 py-2 rounded-full transition-all duration-300"
            >
              회원가입
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
