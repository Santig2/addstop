'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Key, Clock, DollarSign, Radar, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/store'

const ONBOARDING_STEPS = [
  {
    id: 1,
    icon: Key,
    color: 'text-warning',
    bgColor: 'bg-warning/20',
    borderColor: 'border-warning/30',
    title: 'El Caos de las Llaves',
    description: '¿Alguna vez tu equipo ha perdido las llaves de un cliente o tardado demasiado en encontrarlas en el tablero?',
    options: [
      { id: 'a', label: 'Sí, es un dolor de cabeza constante' },
      { id: 'b', label: 'A veces ocurre' },
      { id: 'c', label: 'Rara vez, pero me preocupa' }
    ],
    solution: '¡Con AddSpot, el Llavero digital rastrea cada gancho en tiempo real. Adiós llaves perdidas!',
    solutionIcon: CheckCircle2,
    solutionColor: 'text-success'
  },
  {
    id: 2,
    icon: Clock,
    color: 'text-destructive',
    bgColor: 'bg-destructive/20',
    borderColor: 'border-destructive/30',
    title: 'Tiempos de Espera',
    description: '¿Cuánto tiempo espera un cliente en promedio desde que pide su auto hasta que se lo entregan?',
    options: [
      { id: 'a', label: 'Más de 15 minutos' },
      { id: 'b', label: 'Entre 5 y 10 minutos' },
      { id: 'c', label: 'Menos de 5 minutos' }
    ],
    solution: 'Al conectar a Cajeros y Runners instantáneamente, AddSpot reduce el tiempo de entrega a la mitad.',
    solutionIcon: Clock,
    solutionColor: 'text-primary'
  },
  {
    id: 3,
    icon: DollarSign,
    color: 'text-success',
    bgColor: 'bg-success/20',
    borderColor: 'border-success/30',
    title: 'Fugas de Dinero',
    description: '¿Tienes control total sobre el efectivo que ingresa en la rampa y los cobros de cada turno?',
    options: [
      { id: 'a', label: 'No, hay descuadres frecuentes' },
      { id: 'b', label: 'Llevo el control en papel/Excel' },
      { id: 'c', label: 'Lo tengo bajo control' }
    ],
    solution: 'El rol de Cajero registra cada centavo. Auditoría perfecta y visibilidad financiera garantizada.',
    solutionIcon: DollarSign,
    solutionColor: 'text-success'
  },
  {
    id: 4,
    icon: Radar,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30',
    title: 'Visibilidad del Personal',
    description: '¿Sabes exactamente qué auto está moviendo cada Valet en este preciso momento?',
    options: [
      { id: 'a', label: 'No tengo idea, es un caos visual' },
      { id: 'b', label: 'Solo si pregunto por radio' },
      { id: 'c', label: 'Sí, tengo control' }
    ],
    solution: 'El mapa de spots y el tracking en vivo te da visión de rayos X sobre toda tu operación.',
    solutionIcon: Radar,
    solutionColor: 'text-cyan-500'
  },
  {
    id: 5,
    icon: Sparkles,
    color: 'text-primary',
    bgColor: 'bg-primary/20',
    borderColor: 'border-primary/30',
    title: 'El Paso al Siguiente Nivel',
    description: '¿Estás listo para transformar tu operación tradicional en una experiencia premium y automatizada?',
    options: [
      { id: 'a', label: '¡Absolutamente, quiero empezar!' },
      { id: 'b', label: 'Llevame al dashboard ahora' }
    ],
    solution: '¡Estás a un paso de revolucionar tu valet parking! Bienvenido a AddSpot.',
    solutionIcon: Sparkles,
    solutionColor: 'text-warning'
  }
]

export default function OnboardingPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const router = useRouter()
  const { currentUser } = useAuth()

  const currentStep = ONBOARDING_STEPS[currentStepIndex]
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1

  const handleOptionSelect = (optionId: string) => {
    if (showSolution) return
    setSelectedOption(optionId)
    setShowSolution(true)
    
    // Minor confetti burst for answering
    if (isLastStep) {
      fireConfetti()
    }
  }

  const fireConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#5B7FFF', '#61c0bf', '#F59E0B']
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#5B7FFF', '#61c0bf', '#F59E0B']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const handleNext = () => {
    if (isLastStep) {
      // Complete onboarding and redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 1500) // Wait a bit for the confetti to be visible
    } else {
      setSelectedOption(null)
      setShowSolution(false)
      setCurrentStepIndex(prev => prev + 1)
    }
  }

  const StepIcon = currentStep.icon
  const SolutionIcon = currentStep.solutionIcon

  return (
    <div className="flex-1 flex flex-col justify-center">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/20 rounded-full mb-10 overflow-hidden shadow-inner">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: `${(currentStepIndex / ONBOARDING_STEPS.length) * 100}%` }}
          animate={{ width: `${((currentStepIndex + (showSolution ? 1 : 0.5)) / ONBOARDING_STEPS.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id + (showSolution ? '-solution' : '-question')}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="clay-card p-8 flex-1 flex flex-col justify-center relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className={`absolute -top-20 -right-20 w-64 h-64 ${currentStep.bgColor} rounded-full blur-[100px] pointer-events-none`} />

          {!showSolution ? (
            // QUESTION STATE
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <div className={`w-16 h-16 rounded-[2rem] ${currentStep.bgColor} border ${currentStep.borderColor} flex items-center justify-center mb-6 shadow-inner`}>
                  <StepIcon className={`h-8 w-8 ${currentStep.color}`} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4 drop-shadow-sm leading-tight">
                  {currentStep.title}
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              <div className="space-y-4 mt-auto">
                {currentStep.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className="w-full text-left clay-input p-5 rounded-2xl transition-all duration-300 hover:scale-[0.98] active:scale-95 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                    <span className="font-bold text-foreground text-lg relative z-10">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // SOLUTION STATE
            <div className="flex flex-col h-full justify-center text-center items-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`w-24 h-24 rounded-full bg-white/40 border-4 border-white/60 flex items-center justify-center mb-8 shadow-[0_10px_30px_rgba(0,0,0,0.1)]`}
              >
                <SolutionIcon className={`h-12 w-12 ${currentStep.solutionColor} drop-shadow-md`} />
              </motion.div>
              
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-serif font-bold text-foreground mb-4 drop-shadow-sm leading-tight"
              >
                {currentStep.solution}
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12 w-full"
              >
                <button
                  onClick={handleNext}
                  className={`w-full h-16 rounded-[2rem] font-bold text-lg flex items-center justify-center transition-all active:scale-95 text-white ${
                    isLastStep 
                      ? 'bg-warning shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:brightness-110' 
                      : 'clay-btn-primary'
                  }`}
                >
                  {isLastStep ? 'Comenzar Ahora' : 'Continuar'} 
                  <ArrowRight className="h-6 w-6 ml-2" />
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="text-center mt-6">
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
          Paso {currentStepIndex + 1} de {ONBOARDING_STEPS.length}
        </span>
      </div>
    </div>
  )
}
