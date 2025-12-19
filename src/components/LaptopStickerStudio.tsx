import { useState, useRef, useEffect } from 'react'
import { toPng } from 'html-to-image'
import Moveable from 'react-moveable'

// Image assets from Figma
const imgMainImage = '/assets/Laptop image.png'
const imgStickerImage = 'https://www.figma.com/api/mcp/asset/63893630-ad44-4243-b1f2-2efa23587ff0'
const imgStickerImage1 = 'https://www.figma.com/api/mcp/asset/76026186-ea79-4680-a42a-63a3180d4f20'
const imgStickerImage2 = 'https://www.figma.com/api/mcp/asset/d12ae34c-dad1-402a-8999-1c048fe3c6ec'
const imgStickerImage3 = 'https://www.figma.com/api/mcp/asset/3fe347b6-f1fd-430d-8e39-9607c29ce6a0'
const imgStickerImage4 = 'https://www.figma.com/api/mcp/asset/a0409e22-71b9-45ab-9bdb-cd3ac78fe84c'
const imgStickerImage5 = 'https://www.figma.com/api/mcp/asset/311daa8f-ad7d-464e-9aa6-010ea4631ebd'
const imgImage7 = 'https://www.figma.com/api/mcp/asset/f31cc0be-63c5-4451-8774-fe68be9fec70'
const imgImage6 = 'https://www.figma.com/api/mcp/asset/e76911de-fdee-411e-8739-c56796decd0b'
const imgImage4 = 'https://www.figma.com/api/mcp/asset/10d51388-9024-4740-8096-f7cd85a08e6b'
const imgImage9 = 'https://www.figma.com/api/mcp/asset/e2793fc3-2834-4968-8377-f6a37fe06e29'
const imgImage3 = 'https://www.figma.com/api/mcp/asset/3fb02ed7-2522-493f-8296-8ccde01c628f'
const imgImage8 = 'https://www.figma.com/api/mcp/asset/3cf018cb-dae6-4b8f-9308-c2388cf6ef5e'
const imgImage14 = 'https://www.figma.com/api/mcp/asset/d1d1254f-1b35-480e-bb0a-c0ffb15aed7d'
const imgImage13 = 'https://www.figma.com/api/mcp/asset/61f14bac-27e2-4cd0-9cb7-bc1b8cc28e9c'
const imgUploadIcon = 'https://www.figma.com/api/mcp/asset/2e8d45b1-49a0-44a2-810b-11381645f56b'
const imgDownloadIcon1 = 'https://www.figma.com/api/mcp/asset/f6dd6ee2-3dba-4754-ba4c-e0b413f10ca2'
const imgDownloadIcon2 = 'https://www.figma.com/api/mcp/asset/08016424-3498-4002-9caf-439c063e47d4'
const imgArrow = 'https://www.figma.com/api/mcp/asset/11ec4634-c0b8-4abe-ac9e-06af8d26a452'

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
  const exportRef = useRef<HTMLDivElement>(null)
  const [laptopRect, setLaptopRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const updateRect = () => {
      if (laptopRef.current) {
        setLaptopRect(laptopRef.current.getBoundingClientRect())
      }
    }
    updateRect()
    window.addEventListener('resize', updateRect)
    return () => window.removeEventListener('resize', updateRect)
  }, [])

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
    if (!exportRef.current || !laptopRect) return
    try {
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        backgroundColor: '#f5f5f5',
        pixelRatio: 2,
      })
      const link = document.createElement('a')
      link.download = 'laptop-sticker-design.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      // Silently fail - user can try again
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
          <div className="bg-[#f5f5f5] content-stretch flex gap-[2px] items-center p-[2px] relative rounded-[8px] shrink-0">
            <button
              onClick={() => handleTabClick('macbook')}
              className={`content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[6px] shrink-0 transition-colors ${
                activeTab === 'macbook'
                  ? 'bg-[#110d37]'
                  : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
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
                  : 'bg-[#f5f5f5] hover:bg-[#e5e5e5]'
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
          <div className="h-[400px] relative shrink-0 w-[558px]" ref={laptopRef}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {imageErrors.has(imgMainImage) ? (
                <div className="absolute h-[143.2%] left-[-16.77%] max-w-none top-[-21.6%] w-[133.53%] bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Laptop image</p>
                </div>
              ) : (
                <img
                  alt="Laptop"
                  className="w-full h-full object-contain pointer-events-none"
                  src={imgMainImage}
                  loading="eager"
                  fetchPriority="high"
                  onError={() => handleImageError(imgMainImage)}
                />
              )}
            </div>
          </div>
          <div className="content-stretch flex gap-[13px] items-start justify-center relative shrink-0">
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
    {laptopRect && (
      <div className="absolute left-[-99999px] top-[-99999px]">
        <div
          ref={exportRef}
          className="bg-[#f5f5f5] flex flex-col items-center pb-0 pt-[60px] px-0 relative w-full h-screen overflow-hidden"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : `${window.innerWidth}px`,
            height: containerRef.current ? `${containerRef.current.offsetHeight}px` : `${window.innerHeight}px`,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.1'%3E%3Cpath d='M20 20 L30 10 L40 20 L35 30 L25 30 Z' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3Ccircle cx='70' cy='30' r='8' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3Crect x='15' y='60' width='20' height='20' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3Cpath d='M50 70 Q55 60 60 70 T70 70' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3Cpath d='M80 50 L85 45 L90 50 L87 55 L83 55 Z' fill='none' stroke='%23110D37' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        >
          {/* Match the exact structure from visible view */}
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
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[13px] items-center relative shrink-0 w-[335px]">
            <div className="h-[400px] relative shrink-0 w-[558px]">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {imageErrors.has(imgMainImage) ? (
                  <div className="absolute h-[143.2%] left-[-16.77%] max-w-none top-[-21.6%] w-[133.53%] bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Laptop image</p>
                  </div>
                ) : (
                <img
                  alt="Laptop"
                  className="w-full h-full object-contain"
                  src={imgMainImage}
                />
                )}
              </div>
            </div>
          </div>
          {/* Stickers container - must match visible structure exactly */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="relative size-full">
              {stickers.map((sticker) => {
                const offset = getStickerOffset(sticker.id)
                
                return (
                  <div
                    key={`export-${sticker.id}`}
                    className="absolute cursor-move pointer-events-auto"
                    style={{
                      width: `${sticker.size.width}px`,
                      height: `${sticker.size.height}px`,
                      transform: `translate(${sticker.position.x}px, ${sticker.position.y}px) rotate(${sticker.rotation}deg)`,
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
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )}
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
            className="pointer-events-auto"
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

