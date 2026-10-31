import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Film, 
  Heart, 
  ExternalLink, 
  Maximize2, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  ArrowRight,
  ShieldCheck,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { AdvertisementItem } from '../../types';

export const AdvertisementSection: React.FC = () => {
  const { adConfig, setCurrentPage, setSelectedCategory, showToast } = useApp();
  const [activeMediaFilter, setActiveMediaFilter] = useState<'all' | 'video' | 'gif'>('all');
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  const [expandedAd, setExpandedAd] = useState<AdvertisementItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Video and scroll refs
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [activeMediaFilter, viewMode]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!adConfig.enabled) {
    return null;
  }

  const activeItems = adConfig.items
    .filter((item) => item.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeItems.length === 0) {
    return null;
  }

  const filteredItems = activeItems.filter((item) => {
    if (activeMediaFilter === 'all') return true;
    return item.mediaType === activeMediaFilter;
  });

  const togglePlayPause = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setPlayingVideoId(id);
    } else {
      video.pause();
      setPlayingVideoId(null);
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    const isCurrentlyMuted = mutedMap[id] ?? video.muted ?? true;
    video.muted = !isCurrentlyMuted;
    setMutedMap((prev) => ({ ...prev, [id]: !isCurrentlyMuted }));
  };

  const handleLike = (id: string, initialLikes: number = 0, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLiked = likedMap[id];
    const current = likesCountMap[id] ?? initialLikes;
    if (isLiked) {
      setLikedMap((prev) => ({ ...prev, [id]: false }));
      setLikesCountMap((prev) => ({ ...prev, [id]: Math.max(0, current - 1) }));
    } else {
      setLikedMap((prev) => ({ ...prev, [id]: true }));
      setLikesCountMap((prev) => ({ ...prev, [id]: current + 1 }));
      showToast('Loved this spotlight reel!', 'success');
    }
  };

  const handleCtaClick = (item: AdvertisementItem) => {
    if (!item.linkUrl) {
      setCurrentPage('shop');
      return;
    }
    const target = item.linkUrl.toLowerCase();
    if (target === 'shop') {
      setCurrentPage('shop');
    } else if (target === 'combos') {
      setCurrentPage('combos');
    } else if (target === 'hookah' || target === 'flavours' || target === 'bongs_rolls' || target === 'lighters_ashtray' || target === 'fragrances') {
      setSelectedCategory(target as any);
      setCurrentPage('shop');
    } else if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank');
    } else {
      setCurrentPage('shop');
    }
  };

  const getBadgeColorClasses = (color?: string) => {
    switch (color) {
      case 'gold':
      case 'amber':
        return 'bg-[#C59B27]/25 text-[#E5C158] border-[#C59B27]/60';
      case 'rose':
        return 'bg-rose-500/25 text-rose-300 border-rose-500/60';
      case 'cyan':
        return 'bg-cyan-500/25 text-cyan-300 border-cyan-500/60';
      case 'emerald':
        return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60';
      case 'purple':
        return 'bg-purple-500/25 text-purple-300 border-purple-500/60';
      default:
        return 'bg-[#C59B27]/25 text-[#E5C158] border-[#C59B27]/60';
    }
  };

  return (
    <section className="relative px-3 sm:px-6 lg:px-8 py-10 sm:py-16 my-8 bg-gradient-to-b from-[#0E0E0E] via-[#080808] to-[#0A0A0A] border-y border-[#C59B27]/15 overflow-hidden">
      {/* Luxury atmospheric backlights */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-rose-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-7 relative z-10">
        {/* Header with Title and Sliding Navigation Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[#C59B27]/15 pb-5"
        >
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider font-royal bg-[#C59B27]/15 text-[#E5C158] border border-[#C59B27]/30 backdrop-blur-md">
              <Film className="w-3.5 h-3.5 text-[#E5C158] animate-pulse" />
              <span>{adConfig.bannerBadge || '🔥 TRENDING MEDIA & REELS'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-royal font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F3EFE0] via-[#E5C158] to-[#C59B27]">
              {adConfig.sectionTitle || 'SPOTLIGHT & MEDIA SHOWCASE'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-serif-luxury italic max-w-2xl">
              {adConfig.sectionSubtitle || 'Watch royal shisha sessions, live preparation reels & playful flavour launches'}
            </p>
          </div>

          {/* Right Action Toolbar: Filter Tabs + View Mode + Glide Chevrons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveMediaFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-royal font-bold transition-all ${
                  activeMediaFilter === 'all'
                    ? 'bg-gradient-to-r from-[#C59B27] to-[#A07C1C] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({activeItems.length})
              </button>
              <button
                onClick={() => setActiveMediaFilter('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-royal font-bold transition-all flex items-center gap-1.5 ${
                  activeMediaFilter === 'video'
                    ? 'bg-gradient-to-r from-[#C59B27] to-[#A07C1C] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Reels</span>
              </button>
              <button
                onClick={() => setActiveMediaFilter('gif')}
                className={`px-3 py-1.5 rounded-lg text-xs font-royal font-bold transition-all flex items-center gap-1.5 ${
                  activeMediaFilter === 'gif'
                    ? 'bg-gradient-to-r from-[#C59B27] to-[#A07C1C] text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Playful GIFs</span>
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#141414] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('slider')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-royal font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'slider'
                    ? 'bg-[#C59B27]/25 text-[#E5C158] border border-[#C59B27]/40'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Slider View"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span className="hidden sm:inline">Slider</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-royal font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'grid'
                    ? 'bg-[#C59B27]/25 text-[#E5C158] border border-[#C59B27]/40'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Compass className="w-3 h-3" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

            {/* Horizontal Slider Controls */}
            {viewMode === 'slider' && (
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    canScrollLeft
                      ? 'border-[#C59B27]/50 bg-[#161616] text-[#E5C158] hover:bg-[#C59B27] hover:text-black shadow-[0_0_15px_rgba(197,155,39,0.3)]'
                      : 'border-white/10 bg-[#111111] text-gray-600 opacity-40 cursor-not-allowed'
                  }`}
                  aria-label="Previous reels"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                    canScrollRight
                      ? 'border-[#C59B27]/50 bg-[#161616] text-[#E5C158] hover:bg-[#C59B27] hover:text-black shadow-[0_0_15px_rgba(197,155,39,0.3)]'
                      : 'border-white/10 bg-[#111111] text-gray-600 opacity-40 cursor-not-allowed'
                  }`}
                  aria-label="Next reels"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Media Showcase: Unboxed Cinema Carousel or Grid with Right-to-Left Entrance Animation */}
        <div
          ref={scrollContainerRef}
          className={
            viewMode === 'slider'
              ? 'flex items-stretch gap-5 overflow-x-auto pb-4 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6'
          }
        >
          {filteredItems.map((item, idx) => {
            const isVideo = item.mediaType === 'video';
            const isMuted = mutedMap[item.id] ?? true;
            const isLiked = likedMap[item.id] ?? false;
            const currentLikes = likesCountMap[item.id] ?? item.likesCount ?? 840;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 85, scale: 0.96 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  delay: Math.min(idx * 0.12, 0.6),
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={
                  viewMode === 'slider'
                    ? 'flex-shrink-0 w-[290px] sm:w-[320px] snap-start'
                    : 'w-full'
                }
              >
                {/* Unboxed Cinema Frame - Organic curves, ambient glow, no rigid double boxes */}
                <div className="group relative h-full flex flex-col justify-between rounded-3xl overflow-hidden bg-gradient-to-b from-[#181818]/90 via-[#121212]/95 to-[#0A0A0A] border border-[#C59B27]/25 hover:border-[#C59B27]/70 shadow-[0_12px_36px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_50px_rgba(197,155,39,0.22)] transition-all duration-500">
                  {/* Subtle top gold halo */}
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#C59B27]/10 to-transparent pointer-events-none" />

                  {/* Media Viewport */}
                  <div 
                    className="relative aspect-[4/5] w-full overflow-hidden cursor-pointer bg-black/40"
                    onClick={() => isVideo ? togglePlayPause(item.id) : setExpandedAd(item)}
                  >
                    {isVideo ? (
                      <video
                        ref={(el) => (videoRefs.current[item.id] = el)}
                        src={item.mediaUrl}
                        poster={item.thumbnailUrl}
                        loop={item.loop ?? true}
                        muted={isMuted}
                        autoPlay={item.autoplay ?? true}
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    )}

                    {/* Gradient Overlay for Text Clarity */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/35 pointer-events-none" />

                    {/* Top Floating Glass Pill Controls */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                      <span
                        className={`text-[10px] font-bold font-royal tracking-wider px-3 py-1 rounded-full border backdrop-blur-md shadow-md ${getBadgeColorClasses(
                          item.badgeColor
                        )}`}
                      >
                        {item.badgeText || (isVideo ? '🎬 REEL' : '✨ PLAYFUL GIF')}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isVideo && (
                          <button
                            type="button"
                            onClick={(e) => toggleMute(item.id, e)}
                            className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95"
                            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                          >
                            {isMuted ? (
                              <VolumeX className="w-3.5 h-3.5 text-gray-300" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-[#E5C158] animate-pulse" />
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedAd(item);
                          }}
                          className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95"
                          title="Fullscreen Preview"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-gray-300 hover:text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Center Glowing Play Indicator */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-[#C59B27]/70 flex items-center justify-center text-[#E5C158] shadow-[0_0_25px_rgba(197,155,39,0.4)]">
                          <Play className="w-6 h-6 ml-0.5 fill-[#E5C158]/40" />
                        </div>
                      </div>
                    )}

                    {/* Bottom Floating Metadata Overlay */}
                    <div className="absolute bottom-3 inset-x-3.5 z-10 space-y-1">
                      {item.tagline && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#E5C158] uppercase tracking-wider">
                          <Flame className="w-3 h-3 text-[#E5C158]" />
                          <span>{item.tagline}</span>
                        </div>
                      )}
                      <h3 className="text-base font-royal font-bold text-white drop-shadow-md line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-300 line-clamp-2 drop-shadow font-serif-luxury italic">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Sleek Floating Bottom Bar */}
                  <div className="p-3.5 bg-gradient-to-t from-[#0A0A0A] to-[#121212] border-t border-[#C59B27]/15 flex items-center justify-between gap-2">
                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(item.id, item.likesCount, e)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5 active:scale-95"
                    >
                      <Heart
                        className={`w-4 h-4 transition-transform ${
                          isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-gray-400'
                        }`}
                      />
                      <span className="font-sans text-[11px] font-bold">
                        {currentLikes.toLocaleString()}
                      </span>
                    </button>

                    {/* Action CTA Button */}
                    <button
                      onClick={() => handleCtaClick(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C59B27] via-[#D8AD34] to-[#B08920] hover:from-[#D8AD34] hover:to-[#C59B27] text-black font-royal text-xs font-black tracking-wider flex items-center gap-1.5 shadow-[0_4px_16px_rgba(197,155,39,0.35)] hover:shadow-[0_6px_22px_rgba(197,155,39,0.5)] hover:scale-[1.03] active:scale-95 transition-all"
                    >
                      <span>{item.ctaText || 'Explore Now'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video / GIF Modal */}
      {expandedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#141414] rounded-2xl border border-[#C59B27]/50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Close button */}
            <button
              onClick={() => setExpandedAd(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Media */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {expandedAd.mediaType === 'video' ? (
                <video
                  src={expandedAd.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={expandedAd.mediaUrl}
                  alt={expandedAd.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Modal Info Footer */}
            <div className="p-5 sm:p-6 bg-gradient-to-t from-[#0E0E0E] to-[#141414] border-t border-[#C59B27]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span
                  className={`text-[10px] font-bold font-royal tracking-wider px-2.5 py-0.5 rounded-full border ${getBadgeColorClasses(
                    expandedAd.badgeColor
                  )}`}
                >
                  {expandedAd.badgeText || (expandedAd.mediaType === 'video' ? '🎬 REEL' : '✨ PLAYFUL GIF')}
                </span>
                <h3 className="text-lg font-royal font-bold text-white">{expandedAd.title}</h3>
                <p className="text-xs text-gray-400 font-serif-luxury italic">{expandedAd.subtitle}</p>
              </div>

              <button
                onClick={() => {
                  handleCtaClick(expandedAd);
                  setExpandedAd(null);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B27] to-[#A07C1C] text-black font-royal text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                <span>{expandedAd.ctaText || 'Shop Collection'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
