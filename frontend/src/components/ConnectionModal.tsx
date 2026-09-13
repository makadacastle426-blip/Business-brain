import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, Check, Loader2, X } from 'lucide-react'
import { useConnections } from '../context/ConnectionsContext'
import { amazonMarketplaces, countryCodes, instagramAccounts, platforms, tiktokAccounts, type PlatformId } from '../data/appData'

export function ConnectionModal({ id, onClose, onConnected }: {
  id: PlatformId
  onClose: () => void
  onConnected?: () => void
}) {
  const { connectPlatform } = useConnections()
  const dialog = useRef<HTMLDialogElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const submitting = useRef(false)
  const [step, setStep] = useState<'details' | 'connecting' | 'done'>('details')
  const accounts = id === 'instagram' ? instagramAccounts : tiktokAccounts
  const [selectedAccount, setSelectedAccount] = useState(accounts[0].id)
  const [countryCode, setCountryCode] = useState('+1')
  const [phone, setPhone] = useState('')
  const [sellerId, setSellerId] = useState('')
  const [marketplace, setMarketplace] = useState(amazonMarketplaces[0])
  const [error, setError] = useState('')
  const name = platforms.find((platform) => platform.id === id)!.name
  const pageSelector = id === 'tiktok' || id === 'instagram'

  useEffect(() => {
    const element = dialog.current!
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer.current)
      document.body.style.overflow = previousOverflow
      element.close()
    }
  }, [])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    let label: string
    if (pageSelector) {
      const account = accounts.find((item) => item.id === selectedAccount)!
      label = `${account.name} (${account.handle})`
    } else if (id === 'whatsapp') {
      const digits = phone.replace(/[\s().-]/g, '')
      if (!/^\d{6,14}$/.test(digits) || countryCode.length - 1 + digits.length > 15) {
        setError('Enter a valid phone number without the country code (6–14 digits).')
        return
      }
      label = `${countryCode} ${digits}`
    } else {
      if (!/^[a-zA-Z0-9]+$/.test(sellerId.trim())) {
        setError('Enter a Seller ID using letters and numbers only.')
        return
      }
      label = `${sellerId.trim()} · ${marketplace}`
    }
    setError('')
    submitting.current = true
    setStep('connecting')
    timer.current = setTimeout(() => {
      connectPlatform(id, label)
      setStep('done')
      onConnected?.()
    }, 1100)
  }

  return (
    <dialog ref={dialog} aria-labelledby="connect-title" aria-describedby="connect-description"
      onCancel={(event) => { event.preventDefault(); if (step !== 'connecting') onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget && step !== 'connecting') onClose() }}
      className="bb-connection-dialog m-auto max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white p-0 text-ink shadow-lift backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm">
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{name}</p>
            <h2 id="connect-title" className="mt-1 text-xl font-bold">
              {step === 'details' ? (pageSelector ? `Choose a ${name} page` : `Connect ${name}`) : step === 'connecting' ? `Connecting ${name}` : `${name} connected`}
            </h2>
          </div>
          <button type="button" disabled={step === 'connecting'} onClick={onClose} aria-label="Close"
            className="rounded-lg p-2 text-muted hover:bg-surface disabled:opacity-40"><X className="h-4 w-4" aria-hidden /></button>
        </div>
        <p id="connect-description" className="text-sm text-muted">
          {pageSelector ? `Select which ${name} account you want Business Brain to use for Lacebybritney.` : id === 'whatsapp' ? 'Enter the phone number used for your WhatsApp Business account.' : 'Enter your Amazon Seller ID and choose your marketplace.'}
        </p>
        {step === 'details' && (
          <form onSubmit={submit} className="mt-4">
            {pageSelector ? (
              <fieldset className="space-y-2">
                <legend className="sr-only">Choose a {name} page</legend>
                {accounts.map((account) => (
                  <label key={account.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-3 ring-1 transition ${selectedAccount === account.id ? 'bg-brand/5 ring-brand' : 'bg-white ring-line hover:bg-surface'}`}>
                    <span>
                      <span className="block text-sm font-bold">{account.name}</span>
                      <span className="block text-xs text-muted">{account.handle} · {account.followers} followers</span>
                    </span>
                    <input type="radio" name="account" value={account.id} checked={selectedAccount === account.id}
                      onChange={() => setSelectedAccount(account.id)} className="peer sr-only" />
                    <span className="rounded-full p-1 peer-focus-visible:outline-2 peer-focus-visible:outline-brand">
                      {selectedAccount === account.id ? <Check className="h-4 w-4 text-brand" aria-hidden /> : <span className="block h-4 w-4" />}
                    </span>
                  </label>
                ))}
              </fieldset>
            ) : id === 'whatsapp' ? (
              <div className="space-y-4">
                <label className="block text-sm font-semibold">Country code
                  <select className="bb-input mt-2" value={countryCode} onChange={(event) => setCountryCode(event.target.value)}>
                    {countryCodes.map(({ country, code }) => <option key={code} value={code}>{country} ({code})</option>)}
                  </select>
                </label>
                <label className="block text-sm font-semibold">Phone number
                  <input className="bb-input mt-2" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="202 555 0123" required maxLength={24}
                    value={phone} onChange={(event) => { setPhone(event.target.value); setError('') }} aria-invalid={!!error} aria-describedby={error ? 'connect-error' : 'phone-hint'} />
                </label>
                <p id="phone-hint" className="text-xs text-muted">Use the national number without the country code.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-semibold">Seller ID
                  <input className="bb-input mt-2" placeholder="A1EXAMPLE123" required maxLength={64} autoCapitalize="characters" spellCheck={false}
                    value={sellerId} onChange={(event) => { setSellerId(event.target.value); setError('') }} aria-invalid={!!error} aria-describedby={error ? 'connect-error' : undefined} />
                </label>
                <label className="block text-sm font-semibold">Marketplace
                  <select className="bb-input mt-2" value={marketplace} onChange={(event) => setMarketplace(event.target.value)}>
                    {amazonMarketplaces.map((domain) => <option key={domain}>{domain}</option>)}
                  </select>
                </label>
              </div>
            )}
            {error && <p id="connect-error" role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
            <p className="mt-4 text-xs text-muted">Demo connection — no platform data is accessed.</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={onClose} className="bb-btn bb-btn-secondary flex-1 px-4 py-3"><ArrowLeft className="h-4 w-4" aria-hidden />Back</button>
              <button type="submit" className="bb-btn bb-btn-primary flex-1 px-4 py-3">Continue</button>
            </div>
          </form>
        )}
        <div role="status" aria-live="polite">
          {step === 'connecting' && <div className="flex flex-col items-center py-10 text-center"><Loader2 className="h-8 w-8 animate-spin text-brand" aria-hidden /><p className="mt-4 text-sm font-semibold">Simulating {name} connection…</p></div>}
          {step === 'done' && <div className="flex flex-col items-center pt-8 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-6 w-6" aria-hidden /></span><p className="mt-4 text-sm font-semibold">Connection complete</p><button type="button" onClick={onClose} className="bb-btn bb-btn-primary mt-5 w-full px-4 py-3">Done</button></div>}
        </div>
      </div>
    </dialog>
  )
}
