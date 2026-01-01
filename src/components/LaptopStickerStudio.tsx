import { useState, useRef, useEffect } from 'react'
import { toPng } from 'html-to-image'
import Moveable from 'react-moveable'

// Image assets from Figma
const imgMainImage = '/assets/laptop-image-v3.png'
const imgStickerImage = '/assets/sticker-1.png'
const imgStickerImage1 = '/assets/sticker-2.png'
const imgStickerImage2 = '/assets/sticker-3.png'
const imgStickerImage3 = '/assets/sticker-4.png'
const imgStickerImage4 = '/assets/sticker-5.png'
const imgStickerImage5 = '/assets/sticker-6.png'
const imgImage7 = '/assets/sticker-7.png'
const imgImage6 = '/assets/sticker-8.png'
const imgImage4 = '/assets/sticker-9.png'
const imgImage9 = '/assets/sticker-10.png'
const imgImage3 = '/assets/sticker-11.png'
const imgImage8 = '/assets/sticker-12.png'
const imgImage14 = '/assets/sticker-13.png'
const imgImage13 = '/assets/sticker-14.png'
const imgUploadIcon = '/assets/upload-icon.svg'
const imgDownloadIcon1 = '/assets/download-icon-1.svg'
const imgDownloadIcon2 = '/assets/download-icon-2.svg'
const imgArrow = '/assets/arrow.svg'

interface Sticker {
  id: string
  src: string
  rotation: number
  position: { x: number; y: number }
  size: { width: number; height: number }
}

// Helper function to parse transform string and extract position and rotation
const parseTransform = (transform: string): { x: number; y: number; rotation: number } => {
  const translateMatch = /translate\(([^,]+)px,\s*([^)]+)px\)/.exec(transform)
  const x = translateMatch ? parseFloat(translateMatch[1]) : 0
  const y = translateMatch ? parseFloat(translateMatch[2]) : 0
  
  const rotateMatch = /rotate\(([^)]+)deg\)/.exec(transform)
  const rotation = rotateMatch ? parseFloat(rotateMatch[1]) : 0
  
  return { x, y, rotation }
}

// Helper function to get sticker-specific offsets
const getStickerOffset = (id: string) => {
  if (id === '3') return { left: '-35px', top: '33px' }
  if (id === '7') return { left: '13px', top: '35px' }
  if (id === '9') return { left: '111px', top: '25px' }
  if (id === '12') return { left: '31px', top: '104px' }
  if (id === '13') return { left: undefined, top: '39px' }
  return { left: undefined, top: undefined }
}

// Default sticker positions from Figma design
const defaultStickers: Sticker[] = [
  {
    id: '1',
    src: imgStickerImage,
    rotation: 337.735,
    position: { x: 844, y: 825 },
    size: { width: 476.731, height: 351.941 }
  },
  {
    id: '2',
    src: imgStickerImage1,
    rotation: 22.127,
    position: { x: 644, y: 818 },
    size: { width: 332.502, height: 332.502 }
  },
  {
    id: '3',
    src: imgStickerImage2,
    rotation: 34.61,
    position: { x: 0, y: 750 },
    size: { width: 450.821, height: 300.548 }
  },
  {
    id: '4',
    src: imgStickerImage3,
    rotation: 16.272,
    position: { x: 1280, y: 809 },
    size: { width: 318.433, height: 318.433 }
  },
  {
    id: '5',
    src: imgStickerImage4,
    rotation: 0,
    position: { x: 568.28, y: 828 },
    size: { width: 255.638, height: 319.548 }
  },
  {
    id: '6',
    src: imgStickerImage5,
    rotation: 325.245,
    position: { x: 292, y: 795 },
    size: { width: 339.411, height: 339.411 }
  },
  {
    id: '7',
    src: imgImage7,
    rotation: 0,
    position: { x: 211, y: 501 },
    size: { width: 120, height: 120 }
  },
  {
    id: '8',
    src: imgImage6,
    rotation: 25.133,
    position: { x: 1322, y: 637 },
    size: { width: 120, height: 120 }
  },
  {
    id: '9',
    src: imgImage4,
    rotation: 30,
    position: { x: 32, y: 587 },
    size: { width: 144, height: 120 }
  },
  {
    id: '10',
    src: imgImage9,
    rotation: 0,
    position: { x: 1140, y: 537 },
    size: { width: 100, height: 100 }
  },
  {
    id: '11',
    src: imgImage3,
    rotation: 0,
    position: { x: 1226, y: 647 },
    size: { width: 96, height: 100 }
  },
  {
    id: '12',
    src: imgImage8,
    rotation: 45,
    position: { x: 53, y: 456 },
    size: { width: 100, height: 100 }
  },
  {
    id: '13',
    src: imgImage14,
    rotation: 0,
    position: { x: 347, y: 587 },
    size: { width: 100, height: 100 }
  },
  {
    id: '14',
    src: imgImage13,
    rotation: 0,
    position: { x: 1081, y: 652 },
    size: { width: 118, height: 100 }
  }
]

export default function LaptopStickerStudio() {
  const [activeTab, setActiveTab] = useState<'macbook' | 'others'>('macbook')
  const [stickers, setStickers] = useState<Sticker[]>(defaultStickers)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const targetRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const laptopRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // Preload critical images
  useEffect(() => {
    const criticalImages = [imgMainImage, imgUploadIcon, imgDownloadIcon1, imgDownloadIcon2]
    criticalImages.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }, [])

  const handleImageError = (src: string) => {
    setImageErrors((prev) => new Set(prev).add(src))
  }

  const handleTabClick = (tab: 'macbook' | 'others') => {
    setActiveTab(tab)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          const img = new Image()
          img.onload = () => {
            const newSticker: Sticker = {
              id: Date.now().toString(),
              src: imageUrl,
              rotation: Math.random() * 360,
              position: { 
                x: Math.random() * 400 + 200, 
                y: Math.random() * 300 + 100 
              },
              size: { 
                width: Math.min(img.width, 400), 
                height: Math.min(img.height, 400) 
              }
            }
            setStickers((prev) => [...prev, newSticker])
          }
          img.src = imageUrl
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDownload = async () => {
    if (!containerRef.current || !laptopRef.current) return
    try {
      const rootRect = containerRef.current.getBoundingClientRect()
      const laptopRect = laptopRef.current.getBoundingClientRect()
      const left = laptopRect.left - rootRect.left
      const top = laptopRect.top - rootRect.top
      const width = laptopRect.width
      const height = laptopRect.height
      const rootWidth = rootRect.width
      const rootHeight = rootRect.height
      const right = rootWidth - (left + width)
      const bottom = rootHeight - (top + height)

      const dataUrl = await toPng(containerRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        width: width + 24,
        height: height + 24,
        style: {
          transform: `translate(${-left + 12}px, ${-top + 12}px)`,
          transformOrigin: 'top left',
          width: `${rootRect.width}px`,
          height: `${rootRect.height}px`,
          clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px)`,
        },
        filter: (node) => {
          return !node.classList?.contains('export-exclude')
        },
      })
      const link = document.createElement('a')
      link.download = 'laptop-sticker-design.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#f5f5f5] flex flex-col items-center pb-0 pt-[60px] px-0 relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.1'%3E%3Cpath d='M20 20 L30 10 L40 20 L35 30 L25 30 Z' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3Ccircle cx='70' cy='30' r='8' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3Crect x='15' y='60' width='20' height='20' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3Cpath d='M50 70 Q55 60 60 70 T70 70' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3Cpath d='M80 50 L85 45 L90 50 L87 55 L83 55 Z' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
      onClick={() => setSelectedId(null)}
    >
      <div className="flex flex-col gap-[14px] items-center relative shrink-0 w-[597px]">
        <div className="flex flex-col gap-[24px] items-center relative shrink-0 w-full">
          <div className="flex flex-col items-center leading-[1.4] relative shrink-0 w-full whitespace-pre-wrap">
            <p className="font-['Figtree',sans-serif] font-extrabold relative shrink-0 text-[#110D37] text-[64px] leading-[140%] tracking-[-1.92px] w-full">
              Laptop sticker studio
            </p>
            <p className="font-['Figtree',sans-serif] font-semibold relative shrink-0 text-[#5D5A72] text-[20px] text-center leading-[140%] tracking-[-0.6px] w-full">
              Design your perfect laptop with custom stickers
            </p>
          </div>
          <div className="bg-[#DEDFE2] content-stretch flex gap-[2px] items-center p-[2px] relative rounded-[8px] shrink-0">
            <button
              onClick={() => handleTabClick('macbook')}
              className={`content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[6px] shrink-0 transition-colors ${
                activeTab === 'macbook'
                  ? 'bg-[#110d37]'
                  : 'bg-[#DEDFE2] hover:bg-[#e5e5e5]'
              }`}
            >
              <p
                className={`font-['Figtree',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] ${
                  activeTab === 'macbook' ? 'text-white' : 'text-black'
                }`}
              >
                Macbook
              </p>
            </button>
            <button
              onClick={() => handleTabClick('others')}
              className={`content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[8px] shrink-0 transition-colors ${
                activeTab === 'others'
                  ? 'bg-[#110d37]'
                  : 'bg-[#DEDFE2] hover:bg-[#e5e5e5]'
              }`}
            >
              <p
                className={`font-['Figtree',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] ${
                  activeTab === 'others' ? 'text-white' : 'text-black'
                }`}
              >
                Others
              </p>
            </button>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[13px] items-center relative shrink-0 w-[335px]">
          <div className="h-[400px] relative shrink-0 w-[565px]" ref={laptopRef}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {imageErrors.has(imgMainImage) ? (
                <div className="absolute h-[143.2%] left-[-16.77%] max-w-none top-[-21.6%] w-[133.53%] bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Laptop image</p>
                </div>
              ) : (
                  <img
                    alt="Laptop"
                    crossOrigin="anonymous"
                    className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full"
                    src={imgMainImage}
                    loading="eager"
                    fetchPriority="high"
                    onError={() => handleImageError(imgMainImage)}
                  />
              )}
            </div>
          </div>
          <div className="content-stretch flex gap-[13px] items-start justify-center relative shrink-0 export-exclude">
            <button
              onClick={handleUploadClick}
              className="bg-[#f5f5f5] border border-[#c6ccd0] border-solid flex gap-[4px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0 hover:bg-[#e5e5e5] transition-colors cursor-pointer w-[220px]"
            >
              <div className="relative shrink-0 size-[20px]">
                {imageErrors.has(imgUploadIcon) ? (
                  <div className="block max-w-none size-full bg-gray-400 rounded"></div>
                ) : (
                  <div className="absolute contents inset-0">
                    <img alt="Upload icon" className="block max-w-none size-full" src={imgUploadIcon} loading="eager" onError={() => handleImageError(imgUploadIcon)} />
                  </div>
                )}
              </div>
              <p className="font-['Figtree',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#110d37] text-[14px]">
                Upload your stickers
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </button>
            <button
              onClick={handleDownload}
              disabled={stickers.length === 0}
              className={`flex gap-[4px] items-center justify-center px-[24px] py-[16px] relative rounded-[8px] shrink-0 transition-colors w-[220px] ${
                stickers.length > 0 
                  ? 'bg-[#110d37] hover:bg-[#231b5f] cursor-pointer' 
                  : 'bg-[#110d37]/50 cursor-not-allowed'
              }`}
            >
              <div className="relative shrink-0 size-[20px]">
                <div className="absolute inset-[9.38%_30.21%_30.21%_30.24%]">
                  <div className="absolute inset-0">
                    {imageErrors.has(imgDownloadIcon1) ? (
                      <div className="block max-w-none size-full bg-gray-400 rounded"></div>
                    ) : (
                      <img alt="" className="block max-w-none size-full" src={imgDownloadIcon1} loading="eager" onError={() => handleImageError(imgDownloadIcon1)} />
                    )}
                  </div>
                </div>
                <div className="absolute inset-[59.38%_9.38%_9.38%_9.38%]">
                  <div className="absolute inset-0">
                    {imageErrors.has(imgDownloadIcon2) ? (
                      <div className="block max-w-none size-full bg-gray-400 rounded"></div>
                    ) : (
                      <img alt="" className="block max-w-none size-full" src={imgDownloadIcon2} loading="eager" onError={() => handleImageError(imgDownloadIcon2)} />
                    )}
                  </div>
                </div>
              </div>
              <p className="font-['Figtree',sans-serif] font-medium leading-[20px] relative shrink-0 text-[14px] text-white">
                Download your design
              </p>
            </button>
          </div>
        </div>
      </div>
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        onClick={() => setSelectedId(null)}
      >
        <div 
          className="relative size-full"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedId(null)
            }
          }}
        >
          {stickers.map((sticker) => {
            const offset = getStickerOffset(sticker.id)
            
            return (
            <div
              key={sticker.id}
              ref={(el) => (targetRefs.current[sticker.id] = el)}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedId(sticker.id)
              }}
              className="absolute cursor-move pointer-events-auto"
              style={{
                width: `${sticker.size.width}px`,
                height: `${sticker.size.height}px`,
                transform: `translate(${sticker.position.x}px, ${sticker.position.y}px) rotate(${sticker.rotation}deg)`,
                zIndex: selectedId === sticker.id ? 20 : 10,
                outline: 'none',
                border: 'none',
                ...(offset.left && { left: offset.left }),
                ...(offset.top && { top: offset.top }),
              }}
            >
              {imageErrors.has(sticker.src) ? (
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center border-2 border-dashed border-gray-400">
                  <p className="text-gray-600 text-xs text-center px-2">Sticker</p>
                </div>
              ) : (
                <img
                  alt="Sticker"
                  className="absolute inset-0 max-w-none object-cover object-center pointer-events-none size-full"
                  style={{ outline: 'none', border: 'none' }}
                  src={sticker.src}
                  loading="lazy"
                  draggable={false}
                  onError={() => handleImageError(sticker.src)}
                />
              )}
            </div>
            )
          })}
          
          <Moveable
            className="pointer-events-auto export-exclude"
            style={{ pointerEvents: selectedId ? 'auto' : 'none' }}
            target={selectedId ? targetRefs.current[selectedId] : null}
            draggable={true}
            resizable={true}
            rotatable={true}
            keepRatio={true}
            throttleRotate={0}
            rotationPosition="top"
            renderDirections={['nw', 'ne', 'sw', 'se']}
            edge={false}
            onDrag={(e) => {
              e.target.style.transform = e.transform
            }}
            onDragEnd={(e) => {
              if (selectedId && e.lastEvent?.transform) {
                const { x, y, rotation } = parseTransform(e.lastEvent.transform)
                setStickers((prev) =>
                  prev.map((s) =>
                    s.id === selectedId
                      ? { ...s, position: { x, y }, rotation }
                      : s
                  )
                )
              }
            }}
            onResizeStart={(e) => {
              e.setOrigin(["%", "%"]);
              if (e.dragStart) {
                const currentSticker = stickers.find(s => s.id === selectedId);
                if (currentSticker) {
                  e.dragStart.set([currentSticker.position.x, currentSticker.position.y]);
                }
              }
            }}
            onResize={(e) => {
              e.target.style.width = `${e.width}px`
              e.target.style.height = `${e.height}px`
              e.target.style.transform = e.drag.transform
            }}
            onResizeEnd={(e) => {
              if (selectedId && e.lastEvent) {
                const { width, height } = e.lastEvent
                const { x, y, rotation } = parseTransform(e.lastEvent.drag.transform)
                
                setStickers((prev) =>
                  prev.map((s) =>
                    s.id === selectedId
                      ? { ...s, size: { width, height }, position: { x, y }, rotation }
                      : s
                  )
                )
              }
            }}
            onRotateStart={(e) => {
              e.set(stickers.find(s => s.id === selectedId)?.rotation || 0);
            }}
            onRotate={(e) => {
              e.target.style.transform = e.drag.transform
            }}
            onRotateEnd={(e) => {
              if (selectedId && e.lastEvent) {
                const { x, y } = parseTransform(e.lastEvent.drag.transform)
                const rotation = e.lastEvent.rotation

                setStickers((prev) =>
                  prev.map((s) =>
                    s.id === selectedId
                      ? { ...s, rotation, position: { x, y } }
                      : s
                  )
                )
              }
            }}
          />
        </div>
      </div>

      <div className="absolute content-stretch flex flex-col gap-[24px] items-center w-[197px] z-30" style={{ left: '40px', top: '434px' }}>
        <p className="font-['Unkempt',sans-serif] font-bold leading-[20px] min-w-full not-italic relative shrink-0 text-[24px] text-[#110D37] text-center w-[min-content] whitespace-pre-wrap">
          Click and drag the stickers around
        </p>
        <div className="h-[72.412px] relative shrink-0 w-[26.767px]">
          {imageErrors.has(imgArrow) ? (
            <div className="block max-w-none size-full bg-gray-300"></div>
          ) : (
            <img alt="" className="block max-w-none size-full" src={imgArrow} loading="lazy" onError={() => handleImageError(imgArrow)} />
          )}
        </div>
      </div>
    </div>
  )
}

