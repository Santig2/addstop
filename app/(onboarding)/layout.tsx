import { Logo } from '@/components/logo'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Background patterns */}
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-cyan-50 pointer-events-none" />
      <div className="fixed inset-0 z-[-1] opacity-[0.4] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #5B7FFF 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {/* Decorative Blur Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="fixed bottom-20 right-[-10%] w-[250px] h-[250px] bg-cyan-500/20 rounded-full blur-[80px] pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-40 bg-white/20 backdrop-blur-3xl border-b border-white/40 px-6 py-4 flex items-center justify-between shadow-[0_10px_30px_rgba(91,127,255,0.05)] rounded-b-[2rem]">
        <Logo size="sm" />
      </header>
      <main className="max-w-2xl mx-auto px-4 pt-28 pb-10 relative z-10 min-h-[100dvh] flex flex-col">
        {children}
      </main>
    </div>
  )
}
