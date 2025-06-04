import Link from "next/link"

export default function Navbar() {
  return (
    <nav
      className="p-4 fixed top-0 w-full z-50 bg-white"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.09) 0px 2px 24px 0px",
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-black text-2xl font-bold">
          Strella
        </Link>
        <div className="flex space-x-4">
          <Link
            href="/questionnaire-prompt-builder"
            className="text-black hover:text-gray-600"
          >
            Prompt Builder
          </Link>
          <Link href="/logs" className="text-black hover:text-gray-600">
            Logs
          </Link>
        </div>
      </div>
    </nav>
  )
}
