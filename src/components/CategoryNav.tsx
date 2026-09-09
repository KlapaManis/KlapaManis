'use client'
const ITEMS: [string, string][] = [
  ['Makanan', 'Makanan'],
  ['Minuman', 'Minuman'],
  ['Paket', 'Paket'],
  ['Gallery', 'Gallery'],
]

export default function CategoryNav({ active, onSelect, bgColor='#FAF7F2' }: { active: string, onSelect: (v:string)=>void, bgColor?: string }) {
  return (
    <nav className="flex w-full gap-4 overflow-x-auto pb-1 scrollbar-none px-1 justify-center" aria-label="Navigasi media promo" style={{ scrollbarWidth: 'none' }}>
      {ITEMS.map(([value, label]) => {
        const isActive = active.toLowerCase() === value.toLowerCase()
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="shrink-0 flex flex-col items-center gap-1 min-w-[56px]"
          >
            <div
              className={[
                'w-14 h-14 rounded-full flex items-center justify-center border-2 overflow-hidden transition-all duration-150',
                'shadow-[0_6px_0_rgba(0,0,0,0.3),0_8px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_0_rgba(0,0,0,0.3),0_10px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:shadow-[0_2px_0_rgba(0,0,0,0.3),0_3px_8px_rgba(0,0,0,0.2)] active:translate-y-[3px]',
                isActive
                  ? 'bg-[#1E3124] border-[#1E3124] shadow-[0_6px_0_rgba(10,18,12,0.5),0_8px_16px_rgba(0,0,0,0.35)]'
                  : 'border-[#E8E0C8]',
              ].join(' ')}
              style={isActive ? undefined : {background: `linear-gradient(to bottom, ${bgColor}, ${bgColor})`}}
            >
              {label === 'Gallery' ? (
                <img src="/icons/Gallery.svg" alt={label} className="w-[30px] h-[30px] object-contain shrink-0" />
              ) : (
                <img
                  src={`/icons/${label}.png`}
                  alt={label}
                  className={['w-[30px] h-[30px] object-contain shrink-0 transition-all duration-200', isActive ? 'brightness-0 invert' : ''].join(' ')}
                  loading="lazy"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              )}
            </div>
            <span className={['text-[11px] whitespace-nowrap font-bold', isActive ? 'text-[#1E3124]' : 'text-[#1E3124]'].join(' ')}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
