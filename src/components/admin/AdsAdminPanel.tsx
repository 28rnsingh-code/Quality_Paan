import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Film,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sliders,
  ExternalLink,
  Flame,
  X,
  Layers,
  Sparkle
} from 'lucide-react';
import { AdvertisementItem, AdMediaType } from '../../types';

export const AdsAdminPanel: React.FC = () => {
  const {
    adConfig,
    updateAdConfig,
    addAdvertisementItem,
    updateAdvertisementItem,
    deleteAdvertisementItem,
    reorderAdvertisementItems,
    showToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdvertisementItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [mediaType, setMediaType] = useState<AdMediaType>('video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [badgeText, setBadgeText] = useState('🔥 TRENDING REEL');
  const [badgeColor, setBadgeColor] = useState<'gold' | 'rose' | 'cyan' | 'emerald' | 'amber' | 'purple'>('gold');
  const [linkUrl, setLinkUrl] = useState('shop');
  const [ctaText, setCtaText] = useState('Explore Now');
  const [autoplay, setAutoplay] = useState(true);
  const [loop, setLoop] = useState(true);
  const [muted, setMuted] = useState(true);
  const [isActive, setIsActive] = useState(true);

  // Upload feedback
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle('');
    setSubtitle('');
    setTagline('Pure Brass • 24K Plated');
    setMediaType('video');
    setMediaUrl('');
    setThumbnailUrl('');
    setBadgeText('🎬 VIRAL REEL');
    setBadgeColor('gold');
    setLinkUrl('shop');
    setCtaText('Explore Collection >');
    setAutoplay(true);
    setLoop(true);
    setMuted(true);
    setIsActive(true);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: AdvertisementItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSubtitle(item.subtitle);
    setTagline(item.tagline || '');
    setMediaType(item.mediaType);
    setMediaUrl(item.mediaUrl);
    setThumbnailUrl(item.thumbnailUrl || '');
    setBadgeText(item.badgeText || '');
    setBadgeColor((item.badgeColor as any) || 'gold');
    setLinkUrl(item.linkUrl || 'shop');
    setCtaText(item.ctaText || 'Shop Now');
    setAutoplay(item.autoplay ?? true);
    setLoop(item.loop ?? true);
    setMuted(item.muted ?? true);
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const isVideoFile = file.type.startsWith('video/');
    const isGifFile = file.type === 'image/gif';

    if (isVideoFile) {
      setMediaType('video');
      setBadgeText('🎬 VIDEO SPOTLIGHT');
    } else if (isGifFile) {
      setMediaType('gif');
      setBadgeText('🎉 PLAYFUL GIF');
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setMediaUrl(result);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      setIsUploading(false);
      showToast(`Media file "${file.name}" uploaded successfully!`, 'success');
    };
    reader.onerror = () => {
      setIsUploading(false);
      showToast('Failed to read file. Please try again.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Quick preset sample media
  const handleApplyPreset = (presetType: 'video_shisha' | 'gif_clouds' | 'video_fire' | 'gif_delivery') => {
    if (presetType === 'video_shisha') {
      setMediaType('video');
      setMediaUrl('https://assets.mixkit.co/videos/preview/mixkit-smoke-clouds-rising-in-the-dark-39828-large.mp4');
      setTitle('Imperial Brass Shisha Cloudcraft');
      setSubtitle('Mesmerizing slow-motion cloud session with royal brass stem');
      setTagline('Pure Smoke • Connoisseur Grade');
      setBadgeText('👑 ROYAL REEL');
      setBadgeColor('gold');
      setLinkUrl('shop');
      setCtaText('Shop Imperial Shishas >');
    } else if (presetType === 'gif_clouds') {
      setMediaType('gif');
      setMediaUrl('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZpcTlpZTFpdnN2cWk4d2YzaWl2Mnh3a3ZndGphOW93aDVnNWRhYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l3q2K5jinAlChoCLS/giphy.gif');
      setTitle('Brain Freeze Double Apple Sparkle');
      setSubtitle('Playful dancing smoke swirl with chilled natural mint blast');
      setTagline('100% Herbal • Tobacco Free');
      setBadgeText('🎉 PLAYFUL LOOP');
      setBadgeColor('cyan');
      setLinkUrl('shop');
      setCtaText('Grab Buy 2 Get 1 >');
    } else if (presetType === 'video_fire') {
      setMediaType('video');
      setMediaUrl('https://assets.mixkit.co/videos/preview/mixkit-fire-sparks-flying-in-dark-room-40114-large.mp4');
      setTitle('Hurricane Quad-Torch Jet Flame');
      setSubtitle('Windproof 2200°F coal ignition in under 20 seconds');
      setTagline('Zinc Alloy • Dual Fuel');
      setBadgeText('⚡ JET IGNITION');
      setBadgeColor('amber');
      setLinkUrl('shop');
      setCtaText('Get Quad-Jet Torch >');
    } else if (presetType === 'gif_delivery') {
      setMediaType('gif');
      setMediaUrl('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHkxbHBidWJqN3E1c29mdXNqYnhjMGFwb3J6bnV3bWRtcnI4N3Q0NCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/12xWfpexhLsWVK/giphy.gif');
      setTitle('25-Minute Midnight Express Runner');
      setSubtitle('Discreet luxury pouch delivered straight to your party');
      setTagline('GPS Live Tracked • 100% Discreet');
      setBadgeText('🚀 MIDNIGHT RUSH');
      setBadgeColor('rose');
      setLinkUrl('combos');
      setCtaText('Order Midnight Combo >');
    }
    showToast('Loaded preset media template!', 'info');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a title for the advertisement.', 'error');
      return;
    }
    if (!mediaUrl.trim()) {
      showToast('Please upload or provide a video or GIF URL.', 'error');
      return;
    }

    if (editingItem) {
      updateAdvertisementItem(editingItem.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        tagline: tagline.trim(),
        mediaType,
        mediaUrl: mediaUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        badgeText: badgeText.trim(),
        badgeColor,
        linkUrl: linkUrl.trim(),
        ctaText: ctaText.trim(),
        autoplay,
        loop,
        muted,
        isActive,
      });
    } else {
      addAdvertisementItem({
        title: title.trim(),
        subtitle: subtitle.trim(),
        tagline: tagline.trim(),
        mediaType,
        mediaUrl: mediaUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim(),
        badgeText: badgeText.trim(),
        badgeColor,
        linkUrl: linkUrl.trim(),
        ctaText: ctaText.trim(),
        autoplay,
        loop,
        muted,
        isActive,
        displayOrder: adConfig.items.length + 1,
        likesCount: Math.floor(Math.random() * 500) + 750,
      });
    }

    setIsModalOpen(false);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newItems = [...adConfig.items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // re-assign displayOrder
    newItems.forEach((it, idx) => {
      it.displayOrder = idx + 1;
    });

    reorderAdvertisementItems(newItems);
    showToast('Advertisement order updated!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="p-6 bg-gradient-to-r from-[#171717] via-[#141414] to-[#101010] rounded-2xl border border-[#C59B27]/30 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E5C158] border border-[#C59B27]/30">
              <Film className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-royal font-bold text-white tracking-wide">
              Homepage Advertisement &amp; Video Reels Showcase
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 font-serif-luxury italic">
            Configure advertisement videos, promotional reels and playful looping .GIFs placed directly below &ldquo;Top Picks &amp; Recent Arrivals&rdquo; on the storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Main Visibility Toggle */}
          <button
            onClick={() => updateAdConfig({ enabled: !adConfig.enabled })}
            className={`px-4 py-2 rounded-xl font-royal text-xs font-bold transition-all flex items-center gap-2 ${
              adConfig.enabled
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${adConfig.enabled ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
            <span>{adConfig.enabled ? 'Section Active on Store' : 'Section Hidden'}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B27] via-[#D8AD34] to-[#B08920] hover:from-[#D8AD34] hover:to-[#C59B27] text-black font-royal text-xs font-black tracking-wide flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Advertisement / Reel</span>
          </button>
        </div>
      </div>

      {/* Section Global Settings */}
      <div className="p-5 bg-[#141414] rounded-2xl border border-white/10 space-y-4">
        <h3 className="font-royal text-sm font-bold text-[#E5C158] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#C59B27]" />
          <span>Section Presentation Controls</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-royal text-gray-400 mb-1">Section Title</label>
            <input
              type="text"
              value={adConfig.sectionTitle}
              onChange={(e) => updateAdConfig({ sectionTitle: e.target.value })}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
              placeholder="e.g. SPOTLIGHT & MEDIA SHOWCASE"
            />
          </div>

          <div>
            <label className="block text-xs font-royal text-gray-400 mb-1">Section Subtitle</label>
            <input
              type="text"
              value={adConfig.sectionSubtitle}
              onChange={(e) => updateAdConfig({ sectionSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
              placeholder="e.g. Watch royal shisha sessions, live preparation reels & playful flavour launches"
            />
          </div>

          <div>
            <label className="block text-xs font-royal text-gray-400 mb-1">Badge Tag</label>
            <input
              type="text"
              value={adConfig.bannerBadge}
              onChange={(e) => updateAdConfig({ bannerBadge: e.target.value })}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
              placeholder="e.g. 🔥 TRENDING MEDIA & REELS"
            />
          </div>
        </div>
      </div>

      {/* Advertisements List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-royal font-bold text-white flex items-center gap-2">
            <span>Configured Media Items ({adConfig.items.length})</span>
            <span className="text-xs text-gray-400 font-sans">
              • Videos &amp; GIFs can be reordered, edited or uploaded
            </span>
          </h3>
        </div>

        {adConfig.items.length === 0 ? (
          <div className="p-12 text-center bg-[#141414] rounded-2xl border border-dashed border-white/15 space-y-3">
            <Film className="w-10 h-10 text-gray-500 mx-auto" />
            <p className="text-gray-300 font-royal font-medium text-sm">No advertisements currently configured.</p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-[#C59B27] text-black font-royal text-xs font-bold"
            >
              Add First Video or Playful .GIF
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adConfig.items.map((item, index) => (
              <div
                key={item.id}
                className={`relative bg-[#141414] rounded-2xl border ${
                  item.isActive ? 'border-[#C59B27]/30' : 'border-white/10 opacity-70'
                } p-3.5 space-y-3 flex flex-col justify-between`}
              >
                {/* Media Preview Box */}
                <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10">
                  {item.mediaType === 'video' ? (
                    <video
                      src={item.mediaUrl}
                      muted
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Badge & Type indicator */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-royal bg-black/70 backdrop-blur-md text-[#E5C158] border border-[#C59B27]/40">
                      {item.mediaType === 'video' ? '🎬 VIDEO' : '✨ PLAYFUL GIF'}
                    </span>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-royal ${
                        item.isActive ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'
                      }`}
                    >
                      {item.isActive ? 'ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h4 className="text-sm font-royal font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-xs text-gray-400 font-serif-luxury italic line-clamp-1">{item.subtitle}</p>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <span className="font-sans text-[#E5C158]">CTA: {item.ctaText || 'Shop Now'}</span>
                    <span className="text-gray-500">Order #{item.displayOrder}</span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1">
                  {/* Order arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === adConfig.items.length - 1}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Toggle Active */}
                    <button
                      onClick={() => updateAdvertisementItem(item.id, { isActive: !item.isActive })}
                      className={`px-2 py-1 rounded-lg text-[10px] font-royal font-bold ${
                        item.isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {item.isActive ? 'Pause' : 'Activate'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-[#C59B27]/20 text-gray-300 hover:text-[#E5C158]"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteAdvertisementItem(item.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#141414] rounded-2xl border border-[#C59B27]/50 p-6 shadow-2xl space-y-5 my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#C59B27]/20 text-[#E5C158]">
                  <Film className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-royal text-lg font-bold text-white">
                    {editingItem ? 'Edit Advertisement Reel' : 'Add New Advertisement or Playful .GIF'}
                  </h3>
                  <p className="text-xs text-gray-400 font-serif-luxury italic">
                    Upload MP4 / WebM video clips, animated playful GIFs or paste direct URLs
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets Bar */}
            <div className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-2">
              <span className="text-[11px] font-royal font-bold text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>1-Click Sample Media Presets (High Quality Demo Reels &amp; GIFs):</span>
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('video_shisha')}
                  className="px-2.5 py-1 rounded-lg text-xs font-royal bg-white/5 hover:bg-[#C59B27]/20 text-gray-300 hover:text-[#E5C158] border border-white/10"
                >
                  🎬 Shisha Cloudcraft Reel
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('gif_clouds')}
                  className="px-2.5 py-1 rounded-lg text-xs font-royal bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 border border-white/10"
                >
                  🎉 Playful Flavour GIF
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('video_fire')}
                  className="px-2.5 py-1 rounded-lg text-xs font-royal bg-white/5 hover:bg-amber-500/20 text-gray-300 hover:text-amber-300 border border-white/10"
                >
                  ⚡ Quad-Torch Lighter Video
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('gif_delivery')}
                  className="px-2.5 py-1 rounded-lg text-xs font-royal bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 border border-white/10"
                >
                  🚀 25-Min Express GIF
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Media Type Selection */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMediaType('video');
                    setBadgeText('🎬 VIDEO REEL');
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-royal text-xs font-bold transition-all ${
                    mediaType === 'video'
                      ? 'bg-[#C59B27]/20 border-[#C59B27] text-[#E5C158]'
                      : 'bg-black/40 border-white/10 text-gray-400'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Video Clip (.mp4, .webm)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMediaType('gif');
                    setBadgeText('🎉 PLAYFUL GIF');
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-royal text-xs font-bold transition-all ${
                    mediaType === 'gif'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-black/40 border-white/10 text-gray-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Playful Animated .GIF</span>
                </button>
              </div>

              {/* Upload or URL input */}
              <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-royal text-gray-300 font-bold">
                    Upload File from Computer or Paste URL
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-royal flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#E5C158]" />
                    <span>{isUploading ? 'Reading...' : 'Choose File to Upload'}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={mediaType === 'video' ? 'video/mp4,video/webm,video/*' : 'image/gif,image/*'}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://... (or uploaded data url)"
                  className="w-full px-3 py-2 bg-black/70 border border-white/15 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                />

                {/* Live Preview within modal */}
                {mediaUrl && (
                  <div className="relative aspect-video w-full max-h-48 bg-black rounded-xl overflow-hidden border border-[#C59B27]/40 flex items-center justify-center">
                    {mediaType === 'video' ? (
                      <video
                        src={mediaUrl}
                        autoPlay
                        loop
                        muted
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 24K Egyptian Brass Hookah"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Tagline Feature</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. 24K Plated • Zero Leakage"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-royal text-gray-400 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Experience dense velvety clouds handcrafted for emperors and connoisseurs"
                  className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                />
              </div>

              {/* Badge & Color */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="e.g. 👑 ROYAL SPOTLIGHT"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Badge Accent Color</label>
                  <select
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                  >
                    <option value="gold">Gold (Royal Luxury)</option>
                    <option value="rose">Rose (Hot Flash Deal)</option>
                    <option value="cyan">Cyan (Cool Mint / Playful)</option>
                    <option value="amber">Amber (Sparks &amp; Fire)</option>
                    <option value="emerald">Emerald (Herbal Pure)</option>
                    <option value="purple">Purple (Imperial Lounge)</option>
                  </select>
                </div>
              </div>

              {/* CTA & Link Target */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Explore Flavours >"
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-royal text-gray-400 mb-1">Destination Target</label>
                  <select
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:border-[#C59B27] focus:outline-none"
                  >
                    <option value="shop">Catalog / Shop All</option>
                    <option value="combos">Combos &amp; Best Offers</option>
                    <option value="hookah">Hookahs Category</option>
                    <option value="flavours">Flavours Category</option>
                    <option value="bongs_rolls">Bongs &amp; Rolls Category</option>
                    <option value="lighters_ashtray">Lighters &amp; Ashtrays</option>
                    <option value="fragrances">Fragrances Category</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-[#C59B27] rounded"
                  />
                  <span>Active &amp; Visible on Homepage</span>
                </label>

                {mediaType === 'video' && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                      <input
                        type="checkbox"
                        checked={autoplay}
                        onChange={(e) => setAutoplay(e.target.checked)}
                        className="accent-[#C59B27] rounded"
                      />
                      <span>Autoplay Video</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                      <input
                        type="checkbox"
                        checked={loop}
                        onChange={(e) => setLoop(e.target.checked)}
                        className="accent-[#C59B27] rounded"
                      />
                      <span>Continuous Loop</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                      <input
                        type="checkbox"
                        checked={muted}
                        onChange={(e) => setMuted(e.target.checked)}
                        className="accent-[#C59B27] rounded"
                      />
                      <span>Muted by Default</span>
                    </label>
                  </>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 font-royal text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B27] to-[#A07C1C] text-black font-royal text-xs font-black tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Publish to Storefront'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
