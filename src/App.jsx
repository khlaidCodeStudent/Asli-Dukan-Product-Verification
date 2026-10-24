import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  BadgeCheck,
  ImagePlus,
  Loader2,
  Moon,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Upload,
  X,
} from 'lucide-react'

// --- Helper: Image Compress ---
const compressImage = (file, maxWidth = 1024, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1])
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function UploadBox({ label, hint, preview, onSelect, onClear, inputRef }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-0.5">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
        {preview && (
          <button type="button" onClick={onClear} className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400">
            <X className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative flex min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-stone-50/80 p-4 text-center hover:border-emerald-500/70 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-900/60"
      >
        {preview ? (
          <img src={preview} alt={label} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-emerald-400 dark:ring-slate-700">
              <ImagePlus className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Click to upload</span>
            <span className="mt-1 max-w-[16rem] text-xs leading-5 text-slate-500 dark:text-slate-400">{hint}</span>
          </>
        )}
        {preview && (
          <span className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/35 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:bg-slate-900/95 dark:text-slate-100">
              <Upload className="h-3.5 w-3.5" /> Replace
            </span>
          </span>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onSelect} />
    </div>
  )
}

function ResultPage({ result, onReset, frontPreview, backPreview }) {
  const isAuthentic = result?.verdict === 'AUTHENTIC'
  return (
    <div className="w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-card backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8 animate-in fade-in zoom-in-95">
      <div className="text-center mb-6">
        <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${isAuthentic ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'}`}>
          {isAuthentic ? <BadgeCheck className="h-10 w-10" /> : <ShieldAlert className="h-10 w-10" />}
        </div>
        <h2 className={`text-3xl font-bold tracking-tight ${isAuthentic ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
          {isAuthentic ? 'AUTHENTIC' : 'COUNTERFEIT'}
        </h2>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{result.confidence}% Confidence</p>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">{result.reason}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <img src={frontPreview} alt="front" className="h-40 w-full rounded-xl object-cover border dark:border-slate-800" />
        <img src={backPreview} alt="back" className="h-40 w-full rounded-xl object-cover border dark:border-slate-800" />
      </div>
      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 border dark:border-slate-700/50">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Analysis Details</p>
        <ul className="space-y-2">
          {result.details?.map((d, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onReset} className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
        Scan Another Product
      </button>
    </div>
  )
}

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const [frontFile, setFrontFile] = useState(null)
  const [backFile, setBackFile] = useState(null)
  const [frontPreview, setFrontPreview] = useState('')
  const [backPreview, setBackPreview] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const frontInputRef = useRef(null)
  const backInputRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextDark = stored ? stored === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', nextDark)
    setIsDark(nextDark)
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    document.documentElement.classList.toggle('dark', nextDark)
    localStorage.setItem('theme', nextDark ? 'dark' : 'light')
  }

  const handleSelect = (fileSetter, previewSetter, currentPreview) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image too large (max 10MB)')
      return
    }
    if (currentPreview) URL.revokeObjectURL(currentPreview)
    fileSetter(file)
    previewSetter(URL.createObjectURL(file))
    setErrorMsg('')
  }

  const clearPreview = (fileSetter, previewSetter, currentPreview, ref) => {
    if (currentPreview) URL.revokeObjectURL(currentPreview)
    fileSetter(null)
    previewSetter('')
    if (ref.current) ref.current.value = ''
  }

  const bothUploaded = Boolean(frontPreview && backPreview)

  // --- FINAL FIXED CHECK (Direct Gemini) ---
  const handleCheck = async () => {
    if (!bothUploaded || !frontFile || !backFile) return
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      setErrorMsg('API Key missing. .env me VITE_GEMINI_API_KEY dalo')
      setStatus('error')
      return
    }
    try {
      setStatus('loading')
      setErrorMsg('')
      const [frontB64, backB64] = await Promise.all([compressImage(frontFile), compressImage(backFile)])
      
     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `You are a product authenticity expert. Analyze front and back images. Return ONLY valid JSON with no markdown: {"verdict":"AUTHENTIC or COUNTERFEIT","confidence":85,"reason":"short summary in 1 line","details":["detail 1","detail 2","detail 3"]}. Check logo, font, barcode, packaging.` },
              { inline_data: { mime_type: "image/jpeg", data: frontB64 } },
              { inline_data: { mime_type: "image/jpeg", data: backB64 } }
            ]
          }]
        })
      })

      if (response.status === 429) throw new Error('RATE_LIMIT')
      if (!response.ok) {
        const errText = await response.text()
        console.log('Gemini Error:', errText)
        throw new Error('API_ERROR')
      }

      const data = await response.json()
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      text = text.replace(/```json|```/g, '').trim()
      console.log('Gemini Text:', text)
      const parsed = JSON.parse(text)
      setResult(parsed)
      setStatus('result')
    } catch (err) {
      console.error(err)
      if (err.message === 'RATE_LIMIT') {
        setErrorMsg('AI is busy (token limit). 20 sec baad try karo.')
      } else {
        setErrorMsg('Failed to check. F12 > Console ka screenshot bhejo.')
      }
      setStatus('error')
    }
  }

  const resetAll = () => {
    setStatus('idle')
    setResult(null)
    setErrorMsg('')
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-stone-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-[-8rem] h-80 w-80 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-16 top-24 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl dark:bg-amber-400/10" />
      </div>
      <header className="relative z-10 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 dark:bg-emerald-500">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Asli Dukan</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">Authenticity check</p>
            </div>
          </div>
          <button onClick={toggleTheme} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-amber-300">
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>
      <main className="relative z-10 mx-auto flex max-w-5xl items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        {status === 'result' && result ? (
          <ResultPage result={result} onReset={resetAll} frontPreview={frontPreview} backPreview={backPreview} />
        ) : (
          <section className="w-full max-w-3xl rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-card backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-8">
            <div className="mb-8 text-center">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900">
                <ShieldCheck className="h-3.5 w-3.5" /> Product verification
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Verify Your Product</h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
                Upload a clear front photo and the back or box photo. We will use both images to check authenticity.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <UploadBox label="Front Image" hint="PNG or JPG of the product front" preview={frontPreview} inputRef={frontInputRef} onSelect={handleSelect(setFrontFile, setFrontPreview, frontPreview)} onClear={() => clearPreview(setFrontFile, setFrontPreview, frontPreview, frontInputRef)} />
              <UploadBox label="Back / Box Image" hint="PNG or JPG of the back, label, or box" preview={backPreview} inputRef={backInputRef} onSelect={handleSelect(setBackFile, setBackPreview, backPreview)} onClear={() => clearPreview(setBackFile, setBackPreview, backPreview, backInputRef)} />
            </div>
            {status === 'error' && (
              <div className="mt-5 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <button
              type="button"
              disabled={!bothUploaded || status === 'loading'}
              onClick={handleCheck}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500"
            >
              {status === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" /> Checking with AI...</> : <><ShieldCheck className="h-4 w-4" /> Check Authenticity</>}
            </button>
          </section>
        )}
      </main>
    </div>
  )
}