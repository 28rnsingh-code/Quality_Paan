import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Settings, 
  FileText, 
  Upload, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  FileUp, 
  Image as ImageIcon, 
  Layers, 
  HelpCircle, 
  RefreshCw, 
  Search, 
  ToggleLeft, 
  ToggleRight, 
  ExternalLink,
  Flame,
  Save,
  BookOpen
} from 'lucide-react';
import { KnowledgeDocument, KnowledgeDocType, ChatbotConfig } from '../../types';

export const ChatbotAdminPanel: React.FC = () => {
  const { 
    chatbotConfig, 
    updateChatbotConfig, 
    knowledgeDocs, 
    addKnowledgeDoc, 
    updateKnowledgeDoc, 
    deleteKnowledgeDoc, 
    toggleKnowledgeDocStatus,
    resetKnowledgeDocsToDefault,
    setIsChatbotOpen,
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'knowledge' | 'whats_new' | 'settings' | 'test'>('knowledge');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Document Editor Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Partial<KnowledgeDocument> | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered knowledge docs
  const filteredDocs = knowledgeDocs.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const whatsNewDocs = knowledgeDocs.filter((d) => d.type === 'whats_new');

  const handleOpenNewDoc = (type: KnowledgeDocType = 'text') => {
    setEditingDoc({
      title: '',
      type,
      category: type === 'whats_new' ? "What's New & Announcements" : 'Product Guides & Policies',
      summary: '',
      content: '',
      tags: [type === 'whats_new' ? "what's new" : 'store_guide', 'catalog'],
      active: true,
    });
    setIsDocModalOpen(true);
  };

  const handleEditDoc = (doc: KnowledgeDocument) => {
    setEditingDoc({ ...doc });
    setIsDocModalOpen(true);
  };

  const handleSaveDoc = () => {
    if (!editingDoc || !editingDoc.title?.trim() || !editingDoc.content?.trim()) {
      showToast('Document title and content are required.', 'error');
      return;
    }

    if (editingDoc.id) {
      updateKnowledgeDoc(editingDoc.id, {
        title: editingDoc.title.trim(),
        type: editingDoc.type || 'text',
        category: editingDoc.category || 'General Store Guide',
        summary: editingDoc.summary?.trim() || editingDoc.content.slice(0, 160) + '...',
        content: editingDoc.content.trim(),
        tags: editingDoc.tags || [],
        active: editingDoc.active ?? true,
      });
    } else {
      addKnowledgeDoc({
        title: editingDoc.title.trim(),
        type: editingDoc.type || 'text',
        category: editingDoc.category || 'General Store Guide',
        summary: editingDoc.summary?.trim() || editingDoc.content.slice(0, 160) + '...',
        content: editingDoc.content.trim(),
        tags: editingDoc.tags || [],
        active: editingDoc.active ?? true,
        fileName: editingDoc.fileName,
        fileUrl: editingDoc.fileUrl,
        imageData: editingDoc.imageData,
      });
    }

    setIsDocModalOpen(false);
    setEditingDoc(null);
  };

  // Handle file uploads (PDF, Text files, Images, Word docs)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type.includes('pdf') || file.name.endsWith('.pdf');
    const isText = file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md');

    const determinedType: KnowledgeDocType = isPdf ? 'pdf' : isImage ? 'image' : 'document';

    setIsParsing(true);
    showToast(`Analyzing and ingesting ${file.name} with AI...`, 'info');

    try {
      if (isImage) {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = reader.result as string;
          try {
            const parseRes = await fetch('/api/parse-document', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: file.name.replace(/\.[^/.]+$/, ''),
                imageBase64: base64Data,
                mimeType: file.type,
                docType: 'image',
              }),
            });
            const parsed = await parseRes.json();

            setEditingDoc({
              title: parsed.title || file.name.replace(/\.[^/.]+$/, ''),
              type: 'image',
              category: 'Visual Menus & Asset Catalog',
              summary: parsed.summary || `Visual knowledge uploaded from ${file.name}`,
              content: parsed.extractedContent || `Extracted details from photo: ${file.name}`,
              tags: parsed.tags || ['image', 'catalog', 'specifications'],
              active: true,
              fileName: file.name,
              fileSize: file.size,
              imageData: base64Data,
            });
            setIsDocModalOpen(true);
            showToast('Document parsed into structured knowledge!', 'success');
          } catch (err) {
            console.error(err);
            setEditingDoc({
              title: file.name.replace(/\.[^/.]+$/, ''),
              type: 'image',
              category: 'Visual Asset',
              content: `Image file: ${file.name}`,
              active: true,
              fileName: file.name,
              imageData: base64Data,
            });
            setIsDocModalOpen(true);
          } finally {
            setIsParsing(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Read text or document content
        const reader = new FileReader();
        reader.onload = async () => {
          const content = reader.result as string;
          try {
            const parseRes = await fetch('/api/parse-document', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: file.name.replace(/\.[^/.]+$/, ''),
                textContent: content.slice(0, 15000), // First 15k chars
                docType: determinedType,
              }),
            });
            const parsed = await parseRes.json();

            setEditingDoc({
              title: parsed.title || file.name.replace(/\.[^/.]+$/, ''),
              type: determinedType,
              category: 'Uploaded Documentation',
              summary: parsed.summary || content.slice(0, 180),
              content: parsed.extractedContent || content,
              tags: parsed.tags || [determinedType, 'documentation'],
              active: true,
              fileName: file.name,
              fileSize: file.size,
            });
            setIsDocModalOpen(true);
            showToast('Document ingested into RAG format!', 'success');
          } catch (err) {
            console.error(err);
            setEditingDoc({
              title: file.name.replace(/\.[^/.]+$/, ''),
              type: determinedType,
              category: 'Uploaded Document',
              content: content.slice(0, 5000),
              active: true,
              fileName: file.name,
            });
            setIsDocModalOpen(true);
          } finally {
            setIsParsing(false);
          }
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      console.error(err);
      setIsParsing(false);
      showToast('Error reading uploaded file.', 'error');
    }

    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Automation Header */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-[#1E1706] via-[#2A1E06] to-[#14120B] border-2 border-[#D4AF37]/60 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#3D2C0C] border border-[#D4AF37] text-[#E5C158] flex items-center justify-center flex-shrink-0 shadow-lg">
              <Bot className="w-7 h-7 text-[#F3D079] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="font-royal text-lg font-bold text-[#E5C158]">
                  🤖 AI Chatbot &amp; Autonomous RAG Knowledge Center
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#162A17] text-[#2ECC71] border border-[#2ECC71]/40 font-bold">
                  Gemini LLM + Live RAG Retrieval
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-3xl leading-relaxed">
                Empower your storefront with an intelligent automated sales concierge. Ingest knowledge via <strong className="text-white">PDFs, Word documents, raw text, photos, or What&apos;s New bulletins</strong>. The chatbot grounds every reply in your factual business data with zero hallucination.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsChatbotOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-royal font-extrabold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg active:scale-95 cursor-pointer transition-all"
            >
              <Eye className="w-4 h-4 text-black" />
              <span>Launch Live Store Chat</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsing}
              className="px-4 py-2.5 rounded-xl bg-[#221C0A] hover:bg-[#30260E] text-[#E5C158] border border-[#D4AF37]/60 font-royal font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 cursor-pointer transition-all disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-[#D4AF37]" />
              <span>{isParsing ? 'Parsing...' : 'Upload PDF / Doc / Image'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx,.png,.jpg,.jpeg,.webp"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#2A200B] pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab('knowledge')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-royal transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'knowledge'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'bg-[#14120C] text-gray-400 hover:text-[#E5C158] border border-[#2A2210]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Knowledge Base ({knowledgeDocs.length} Docs)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('whats_new')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-royal transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'whats_new'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'bg-[#14120C] text-gray-400 hover:text-[#E5C158] border border-[#2A2210]'
          }`}
        >
          <Flame className="w-4 h-4 text-[#F39C12]" />
          <span>What&apos;s New &amp; Bulletins ({whatsNewDocs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-royal transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-[#D4AF37] text-black shadow-md'
              : 'bg-[#14120C] text-gray-400 hover:text-[#E5C158] border border-[#2A2210]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Bot Personality &amp; Config</span>
        </button>
      </div>

      {/* SUBTAB 1 & 2: KNOWLEDGE BASE / WHAT'S NEW */}
      {(activeSubTab === 'knowledge' || activeSubTab === 'whats_new') && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, keywords, tags, policies..."
                  className="w-full pl-9 pr-3 py-2 bg-[#14120C] text-xs text-gray-200 rounded-xl border border-[#2A2210] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#14120C] text-xs text-gray-300 py-2 px-3 rounded-xl border border-[#2A2210] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="whats_new">What&apos;s New</option>
                <option value="document">Text Docs</option>
                <option value="pdf">PDFs</option>
                <option value="image">Images</option>
              </select>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenNewDoc(activeSubTab === 'whats_new' ? 'whats_new' : 'text')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black font-royal font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {activeSubTab === 'whats_new' ? 'Add What&apos;s New Update' : 'Add Knowledge Document'}
                </span>
              </button>

              <button
                type="button"
                onClick={resetKnowledgeDocsToDefault}
                className="px-3 py-2 rounded-xl bg-[#181818] hover:bg-[#222] text-gray-400 hover:text-gray-200 border border-[#333] text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Reset to default store documents"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Documents Grid / Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(activeSubTab === 'whats_new' ? whatsNewDocs : filteredDocs).map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl bg-[#14120C] border transition-all shadow-lg flex flex-col justify-between ${
                  doc.active ? 'border-[#3D2C0C] hover:border-[#D4AF37]/50' : 'border-red-900/30 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          doc.type === 'whats_new'
                            ? 'bg-amber-950 text-amber-400 border border-amber-600/30'
                            : doc.type === 'pdf'
                            ? 'bg-rose-950 text-rose-400 border border-rose-600/30'
                            : doc.type === 'image'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/30'
                            : 'bg-sky-950 text-sky-400 border border-sky-600/30'
                        }`}
                      >
                        {doc.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium truncate max-w-[160px]">
                        {doc.category || 'Store Knowledge'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleKnowledgeDocStatus(doc.id)}
                      className="text-gray-400 hover:text-white"
                      title={doc.active ? 'Deactivate from RAG' : 'Activate in RAG'}
                    >
                      {doc.active ? (
                        <ToggleRight className="w-5 h-5 text-[#2ECC71]" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-royal text-sm font-bold text-[#E5C158] mt-2 leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-gray-300 mt-1.5 line-clamp-3 leading-relaxed">
                    {doc.summary || doc.content}
                  </p>

                  {/* Thumbnail if image is attached */}
                  {doc.imageData && (
                    <div className="mt-2.5 rounded-xl overflow-hidden border border-[#3A2E12] max-h-32">
                      <img
                        src={doc.imageData}
                        alt={doc.title}
                        className="w-full h-28 object-cover"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {doc.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-2 py-0.5 rounded bg-[#1F1A0E] text-[#C59B27] border border-[#3A2E14]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-[#261E0D] pt-3 mt-4 text-[10px] text-gray-500">
                  <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditDoc(doc)}
                      className="px-2.5 py-1 rounded-lg bg-[#221C0E] hover:bg-[#332A14] text-[#E5C158] border border-[#443513] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Remove "${doc.title}" from RAG index?`)) {
                          deleteKnowledgeDoc(doc.id);
                        }
                      }}
                      className="p-1 rounded-lg hover:bg-rose-950/50 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: BOT PERSONALITY & CONFIGURATION */}
      {activeSubTab === 'settings' && (
        <div className="bg-[#14120C] border border-[#2A2210] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#2A200B] pb-4">
            <h3 className="font-royal text-base font-bold text-[#E5C158]">
              ⚙️ Bot Identity, Tone &amp; Autonomous RAG Rules
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Configure how the automated concierge interacts with visitors and retrieves knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bot Enabled */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1A160E] border border-[#3D2C0C]">
              <div>
                <div className="text-xs font-bold text-gray-200">Enable Store Chatbot</div>
                <div className="text-[11px] text-gray-400">
                  Display the floating AI bubble on the public storefront.
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateChatbotConfig({ enabled: !chatbotConfig.enabled })}
                className="text-gray-400 hover:text-white"
              >
                {chatbotConfig.enabled ? (
                  <ToggleRight className="w-7 h-7 text-[#2ECC71]" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-gray-500" />
                )}
              </button>
            </div>

            {/* Persona Tone */}
            <div>
              <label className="block text-xs font-bold text-[#D4AF37] mb-1.5">
                Assistant Voice / Tone
              </label>
              <select
                value={chatbotConfig.tone}
                onChange={(e) => updateChatbotConfig({ tone: e.target.value as any })}
                className="w-full bg-[#18140B] text-xs text-gray-200 px-3.5 py-2.5 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="luxury_concierge">Luxury Royal Concierge (Polite, prestigious, detailed)</option>
                <option value="friendly">Warm &amp; Friendly (Approachable, engaging)</option>
                <option value="professional">Professional &amp; Crisp (Direct, corporate e-commerce)</option>
                <option value="support_assistant">Fast Support Dispatch (Troubleshooting focused)</option>
              </select>
            </div>

            {/* Bot Name */}
            <div>
              <label className="block text-xs font-bold text-[#D4AF37] mb-1.5">
                Bot Display Name
              </label>
              <input
                type="text"
                value={chatbotConfig.botName}
                onChange={(e) => updateChatbotConfig({ botName: e.target.value })}
                className="w-full bg-[#18140B] text-xs text-gray-200 px-3.5 py-2.5 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Bot Subtitle */}
            <div>
              <label className="block text-xs font-bold text-[#D4AF37] mb-1.5">
                Sub-Headline / Status Description
              </label>
              <input
                type="text"
                value={chatbotConfig.botTitle}
                onChange={(e) => updateChatbotConfig({ botTitle: e.target.value })}
                className="w-full bg-[#18140B] text-xs text-gray-200 px-3.5 py-2.5 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Welcome Greeting */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#D4AF37] mb-1.5">
                Default Welcome Message
              </label>
              <textarea
                rows={2}
                value={chatbotConfig.welcomeMessage}
                onChange={(e) => updateChatbotConfig({ welcomeMessage: e.target.value })}
                className="w-full bg-[#18140B] text-xs text-gray-200 p-3 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* System Persona / Prompt */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#D4AF37] mb-1.5">
                Core System Persona (LLM Context Prompt)
              </label>
              <textarea
                rows={3}
                value={chatbotConfig.systemPersona}
                onChange={(e) => updateChatbotConfig({ systemPersona: e.target.value })}
                className="w-full bg-[#18140B] text-xs text-gray-200 p-3 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none font-mono text-[11px]"
              />
            </div>

            {/* Fallback Channels */}
            <div>
              <label className="block text-xs font-bold text-[#D4AF37] mb-1.5">
                WhatsApp Live Escalation Number
              </label>
              <input
                type="text"
                value={chatbotConfig.whatsappSupportNumber}
                onChange={(e) => updateChatbotConfig({ whatsappSupportNumber: e.target.value })}
                className="w-full bg-[#18140B] text-xs text-gray-200 px-3.5 py-2.5 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
                placeholder="+919876543210"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#D4AF37] mb-1.5">
                Fallback Support Email
              </label>
              <input
                type="email"
                value={chatbotConfig.fallbackEmail}
                onChange={(e) => updateChatbotConfig({ fallbackEmail: e.target.value })}
                className="w-full bg-[#18140B] text-xs text-gray-200 px-3.5 py-2.5 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
                placeholder="care@qualityshisha.com"
              />
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT ADD/EDIT MODAL */}
      {isDocModalOpen && editingDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12100C] border border-[#D4AF37]/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1E1706] to-[#14120B] p-4 border-b border-[#2A200B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F3D079]" />
                <h3 className="font-royal text-sm font-bold text-[#E5C158]">
                  {editingDoc.id ? 'Edit Knowledge Document' : 'Create Knowledge Document / What&apos;s New'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={editingDoc.title || ''}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    placeholder="e.g. What's New: Weekend Offers & Egyptian Hookah Drop"
                    className="w-full bg-[#1A160E] text-xs text-gray-200 px-3 py-2 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                    Knowledge Type
                  </label>
                  <select
                    value={editingDoc.type || 'text'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, type: e.target.value as any })}
                    className="w-full bg-[#1A160E] text-xs text-gray-200 px-3 py-2 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="whats_new">What&apos;s New &amp; Latest Updates</option>
                    <option value="text">General Store Guide</option>
                    <option value="document">Policy / Document</option>
                    <option value="pdf">PDF Handbook</option>
                    <option value="image">Image / Spec Sheet</option>
                    <option value="faq">FAQ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                  Department / Category Label
                </label>
                <input
                  type="text"
                  value={editingDoc.category || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                  placeholder="e.g. Logistics, Hookah Care, Flavours, Billing"
                  className="w-full bg-[#1A160E] text-xs text-gray-200 px-3 py-2 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                  Summary (Quick overview for AI retrieval snippet)
                </label>
                <input
                  type="text"
                  value={editingDoc.summary || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, summary: e.target.value })}
                  placeholder="2-3 sentence summary of what this document covers"
                  className="w-full bg-[#1A160E] text-xs text-gray-200 px-3 py-2 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                  Full Knowledge Content (RAG Body) *
                </label>
                <textarea
                  rows={8}
                  value={editingDoc.content || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  placeholder="Paste product specifications, return policies, delivery hours, or what's new bullet points here..."
                  className="w-full bg-[#1A160E] text-xs text-gray-200 p-3 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none font-mono text-[11px] leading-relaxed"
                />
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-bold text-[#D4AF37] mb-1">
                  Search Keywords / Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={(editingDoc.tags || []).join(', ')}
                  onChange={(e) =>
                    setEditingDoc({
                      ...editingDoc,
                      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. shipping, delivery, charges, discreet, hookahs"
                  className="w-full bg-[#1A160E] text-xs text-gray-200 px-3 py-2 rounded-xl border border-[#382C10] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#16120A] border-t border-[#2A200B] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDocModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#222] hover:bg-[#333] text-gray-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDoc}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#F3D079] via-[#D4AF37] to-[#B38C1B] text-black font-royal font-bold text-xs flex items-center gap-1.5 hover:brightness-110 shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save to Knowledge Base</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
