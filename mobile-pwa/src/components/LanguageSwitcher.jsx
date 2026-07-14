import { useLanguage } from '../context/LanguageContext'
import { languages } from '../i18n/translations'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition ${
            lang === l.code ? 'bg-white shadow text-brand-700' : 'text-gray-500'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
