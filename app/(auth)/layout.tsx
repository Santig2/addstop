export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Edge screen glow */}
      <div className="fixed inset-0 pointer-events-none z-0 border-[2px] border-secondary/20" style={{ boxShadow: 'inset 0 0 100px rgba(97, 192, 191, 0.4), inset 0 0 250px rgba(91, 127, 255, 0.2)' }}></div>
      
      {/* Glassy overlay container */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-4 min-h-[100dvh] overflow-y-auto">
        <div className="w-full flex justify-center py-10">
          {children}
        </div>
      </div>
    </div>
  )
}
