import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react"

const sectorLabels = {
  A: "Podmioty kluczowe",
  B: "Podmioty ważne",
  C: "Inna działalność",
}

const employeeLabels = {
  A: "Mniej niż 50 pracowników",
  B: "50 lub więcej pracowników",
}

const financeLabels = {
  A: "Do 10 mln EUR",
  B: "Powyżej 10 mln EUR",
}

const ownershipLabels = {
  A: "Nie",
  B: "Tak",
}

const specialLabels = {
  TAK: "Tak",
  NIE: "Nie",
}

function Quiz() {
  const [step, setStep] = useState(1)

  const [answers, setAnswers] = useState({
    sector: "",
    employees: "",
    finance: "",
    ownership: "",
    special: "",
  })

  const [result, setResult] = useState(null)

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const next = () => setStep((prev) => prev + 1)

  const calculateResult = () => {
    const isCritical =
      answers.sector === "A" || answers.sector === "B"

    let res = "GREEN"

    if (!isCritical) {
      res = answers.special === "TAK" ? "ORANGE" : "GREEN"
    } else if (
      answers.employees === "B" ||
      answers.finance === "B"
    ) {
      res = "RED"
    } else if (
      answers.employees === "A" &&
      answers.finance === "A" &&
      answers.ownership === "B"
    ) {
      res = "ORANGE"
    }

    setResult(res)
    setStep(99)
  }

  const progress = () => {
    if (step === 99) return 100

    const total = answers.sector === "C" ? 3 : 5

    return Math.min(((step - 1) / (total - 1)) * 100, 100)
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Postęp</span>
          <span>{Math.round(progress())}%</span>
        </div>

        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress()}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              W jakim sektorze działa Twoja firma?
            </h2>

            <div className="space-y-4">
              <OptionCard
                title="Podmioty kluczowe"
                description="Energetyka, transport, bankowość, zdrowie, ICT, cloud, telekomunikacja"
                onClick={() => {
                  updateAnswer("sector", "A")
                  next()
                }}
              />

              <OptionCard
                title="Podmioty ważne"
                description="Produkcja, chemia, żywność, logistyka, marketplace, odpady"
                onClick={() => {
                  updateAnswer("sector", "B")
                  next()
                }}
              />

              <OptionCard
                title="Inna działalność"
                description="Usługi lokalne, handel detaliczny, standardowa działalność"
                onClick={() => {
                  updateAnswer("sector", "C")
                  setStep(5)
                }}
              />
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <Question
            key="employees"
            title="Ile osób zatrudnia Twoja firma?"
            options={[
              {
                label: "Mniej niż 50 pracowników",
                value: "A",
              },
              {
                label: "50 lub więcej pracowników",
                value: "B",
              },
            ]}
            onSelect={(value) => {
              updateAnswer("employees", value)
              next()
            }}
          />
        )}

        {step === 3 && (
          <Question
            key="finance"
            title="Jaki jest roczny obrót lub bilans firmy?"
            options={[
              {
                label: "Do 10 mln EUR",
                value: "A",
              },
              {
                label: "Powyżej 10 mln EUR",
                value: "B",
              },
            ]}
            onSelect={(value) => {
              updateAnswer("finance", value)
              next()
            }}
          />
        )}

        {step === 4 && (
          <Question
            key="ownership"
            title="Czy firma należy do grupy kapitałowej?"
            options={[
              {
                label: "Nie",
                value: "A",
              },
              {
                label: "Tak",
                value: "B",
              },
            ]}
            onSelect={(value) => {
              updateAnswer("ownership", value)
              calculateResult()
            }}
          />
        )}

        {step === 5 && (
          <Question
            key="special"
            title="Czy świadczycie usługi publiczne lub zaufania?"
            options={[
              {
                label: "Tak",
                value: "TAK",
              },
              {
                label: "Nie",
                value: "NIE",
              },
            ]}
            onSelect={(value) => {
              updateAnswer("special", value)
              calculateResult()
            }}
          />
        )}

        {step === 99 && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ResultScreen
              result={result}
              answers={answers}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Question({ title, options, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        {title}
      </h2>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/40 transition-all flex items-center justify-between"
          >
            <span className="text-lg">{option.label}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function OptionCard({ title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/40 transition-all"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </button>
  )
}

function ResultScreen({ result, answers }) {
  const config = {
    RED: {
      icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
      title: "NIS2 prawdopodobnie dotyczy Twojej firmy",
      text: "Wszystko wskazuje na to, że Twoja firma może podlegać pod obowiązki wynikające z dyrektywy NIS2.",
      classes: "bg-red-500/10 border-red-500/30",
    },
    ORANGE: {
      icon: <ShieldCheck className="w-8 h-8 text-orange-400" />,
      title: "Twoja firma znajduje się w strefie ryzyka",
      text: "Powiązania kapitałowe lub specyfika usług mogą powodować objęcie firmy regulacjami NIS2.",
      classes: "bg-orange-500/10 border-orange-500/30",
    },
    GREEN: {
      icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
      title: "NIS2 prawdopodobnie Was nie obejmuje",
      text: "Wstępna analiza wskazuje, że firma może nie podlegać bezpośrednio pod NIS2, jednak konieczna może być szczegółowa analiza relacji biznesowych.",
      classes: "bg-green-500/10 border-green-500/30",
    },
  }

  const current = config[result]

  return (
    <div className={`border rounded-3xl p-8 ${current.classes}`}>
      <div className="flex items-center gap-3 mb-4">
        {current.icon}

        <h2 className="text-2xl md:text-3xl font-black">
          {current.title}
        </h2>
      </div>

      <p className="text-gray-300 leading-relaxed mb-8">
        {current.text}
      </p>

      <LeadForm
        result={result}
        answers={answers}
        labels={{
          sectorLabels,
          employeeLabels,
          financeLabels,
          ownershipLabels,
          specialLabels,
        }}
        buttonText="Skontaktuj się z nami"
      />
    </div>
  )
}

function LeadForm({ buttonText, result, answers, labels }) {
  const {
    sectorLabels,
    employeeLabels,
    financeLabels,
    ownershipLabels,
    specialLabels,
  } = labels

  return (
    <form
      action="https://formsubmit.co/n.sawicka.gsoft@gmail.com"
      method="POST"
      className="grid md:grid-cols-2 gap-4"
    >
      <input type="hidden" name="Wynik NIS2" value={result} />

      <input
        type="hidden"
        name="Sektor"
        value={sectorLabels[answers?.sector] || "-"}
      />

      <input
        type="hidden"
        name="Liczba pracowników"
        value={employeeLabels[answers?.employees] || "-"}
      />

      <input
        type="hidden"
        name="Obrót lub bilans"
        value={financeLabels[answers?.finance] || "-"}
      />

      <input
        type="hidden"
        name="Grupa kapitałowa"
        value={ownershipLabels[answers?.ownership] || "-"}
      />

      <input
        type="hidden"
        name="Usługi publiczne lub zaufania"
        value={specialLabels[answers?.special] || "-"}
      />

      <input type="hidden" name="_captcha" value="false" />

      <input
        type="hidden"
        name="_subject"
        value="Nowy lead NIS2 ze strony G-SOFT"
      />

      <input
        type="hidden"
        name="_next"
        value="https://www.g-soft.pl/"
      />

      <input
        type="text"
        name="_honey"
        style={{ display: "none" }}
      />

      <input
        type="text"
        name="name"
        placeholder="Imię"
        required
        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
      />

      <input
        type="text"
        name="company"
        placeholder="Nazwa firmy"
        required
        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Telefon"
        pattern="[0-9+\\s]{7,15}"
        required
        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
      />

      <input
        type="email"
        name="email"
        placeholder="Adres e-mail"
        required
        className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
      />

      <label className="md:col-span-2 flex items-start gap-3 text-sm text-gray-300 mt-2">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1"
        />

        <span>
          Wyrażam zgodę na kontakt ze strony G-SOFT oraz zapoznałem się z polityką prywatności.
        </span>
      </label>

      <button
        type="submit"
        className="md:col-span-2 bg-gradient-to-r from-blue-700 to-cyan-600 hover:opacity-90 transition-all rounded-2xl p-5 text-lg font-bold shadow-xl"
      >
        {buttonText}
      </button>

      <p className="md:col-span-2 text-xs text-gray-500 leading-relaxed mt-2">
        To narzędzie ma charakter informacyjny i nie stanowi porady prawnej.
      </p>
    </form>
  )
}

// META TAGI DO index.html:
//
// <title>Czy Twoja firma podlega pod NIS2?</title>
// <meta name="description" content="Sprawdź w 60 sekund, czy Twoja firma może podlegać pod dyrektywę NIS2." />
// <meta property="og:title" content="Czy Twoja firma podlega pod NIS2?" />
// <meta property="og:description" content="Bezpłatny test zgodności NIS2 dla firm." />
// <meta property="og:type" content="website" />
// <meta property="og:image" content="https://twoja-domena.pl/og-image.jpg" />
//
// DEPLOY VERCEL:
// 1. wrzuć projekt na GitHub
// 2. zaloguj się na vercel.com
// 3. New Project -> import repo
// 4. Deploy
// 5. gotowy link możesz wkleić na FB

export default function App() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center p-4 md:p-10 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-3xl w-full bg-white/5 border border-white/10 rounded-[32px] p-6 md:p-10 backdrop-blur-xl shadow-2xl"
      >
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm mb-6">
          Bezpłatny test zgodności NIS2
        </div>

        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
          Czy Twoja firma podlega pod
          <span className="text-blue-400">
            {" "}dyrektywę NIS2?
          </span>
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl">
          Sprawdź w mniej niż 60 sekund, czy nowe przepisy cyberbezpieczeństwa dotyczą Twojej działalności.
        </p>

        <Quiz />
      </motion.div>
    </div>
  )
}
