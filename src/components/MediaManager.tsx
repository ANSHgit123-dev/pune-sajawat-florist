import React, { useState, useEffect, useRef } from "react";
import { 
  UploadCloud, 
  Trash2, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  Play, 
  Film, 
  Image as ImageIcon, 
  CheckCircle, 
  Check, 
  X, 
  ArrowLeft,
  Eye,
  FileVideo,
  FileImage,
  FolderOpen
} from "lucide-react";
import { MediaItem } from "../types";

interface MediaManagerProps {
  onBack: () => void;
}

type MediaFolder = "hero" | "gallery" | "shop" | "videos";

const FOLDER_DETAILS = {
  hero: {
    label: "Hero Slider Banners",
    desc: "Vibrant media shown at the very top of the homepage slider. Supports wide landscapes.",
    accept: "image/*,video/*"
  },
  gallery: {
    label: "Design Gallery",
    desc: "Captures of real arrangements and store setups shown in the design section.",
    accept: "image/*"
  },
  shop: {
    label: "Shop Backgrounds",
    desc: "Curated aesthetic images for background blocks and promotions.",
    accept: "image/*"
  },
  videos: {
    label: "Promotional Video Reels",
    desc: "Autoplay reels showing designs in action, displayed in the reels slider.",
    accept: "video/*"
  }
};

export default function MediaManager({ onBack }: MediaManagerProps) {
  const [activeFolder, setActiveFolder] = useState<MediaFolder>("hero");
  const [files, setFiles] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<MediaItem | null>(null);
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async (folder: MediaFolder) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/media/list?folder=${folder}`);
      if (!res.ok) {
        throw new Error("Failed to list media files");
      }
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err: any) {
      setError(err?.message || "Could not load files from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(activeFolder);
  }, [activeFolder]);

  const getCsrfToken = () => sessionStorage.getItem("sajawat_csrf_token") || "";

  const handleBase64Upload = async (fileName: string, base64Data: string, folder: MediaFolder) => {
    const csrfToken = getCsrfToken();
    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({
          name: fileName,
          base64: base64Data,
          folder: folder
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(`File "${fileName}" uploaded successfully! ✨`);
      setTimeout(() => setSuccess(""), 3000);
      loadFiles(folder);
    } catch (err: any) {
      setError(err?.message || "Upload process failed.");
    } finally {
      setUploadingFile(null);
    }
  };

  const processFileAndUpload = (file: File, folder: MediaFolder, customName?: string) => {
    if (!file) return;
    
    // Check file size (limit: 45MB to be safe with standard express serverless limits)
    if (file.size > 45 * 1024 * 1024) {
      setError("File is too large. Max limit is 45MB.");
      return;
    }

    setUploadingFile(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      const uploadName = customName || file.name.replace(/\s+/g, "_"); // clean spacing
      handleBase64Upload(uploadName, base64String, folder);
    };
    reader.onerror = () => {
      setError("Error reading local file.");
      setUploadingFile(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Basic validation
      const folderAccept = FOLDER_DETAILS[activeFolder].accept;
      if (folderAccept.includes("image/*") && !file.type.startsWith("image/") && !folderAccept.includes("video/*")) {
        setError("Only images are accepted in this folder.");
        return;
      }
      if (folderAccept.includes("video/*") && !file.type.startsWith("video/") && !folderAccept.includes("image/*")) {
        setError("Only videos are accepted in this folder.");
        return;
      }

      processFileAndUpload(file, activeFolder);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileAndUpload(e.target.files[0], activeFolder);
    }
  };

  const handleReplaceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && replaceTarget) {
      processFileAndUpload(e.target.files[0], activeFolder, replaceTarget.name);
      setReplaceTarget(null);
    }
  };

  const handleDeleteFile = async (item: MediaItem) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError("");
    const csrfToken = getCsrfToken();

    try {
      const res = await fetch("/api/media/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({
          name: item.name,
          folder: activeFolder
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setSuccess(`Deleted file "${item.name}" successfully.`);
      setTimeout(() => setSuccess(""), 3000);
      loadFiles(activeFolder);
    } catch (err: any) {
      setError(err?.message || "Failed to delete file.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="bg-white border border-stone-250/90 rounded-3xl p-6 shadow-md space-y-6 font-sans" id="media-manager-portal">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-5 gap-3">
        <div>
          <h3 className="text-lg font-bold font-serif text-stone-900 flex items-center gap-2">
            <span>🖼️</span> Cloud Media Manager
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed mt-1">
            Store, view, and replace background banner slider assets and promotional video reels dynamically.
          </p>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-950 transition-colors cursor-pointer uppercase tracking-widest font-black"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Shop</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-650 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Folder Tab Switches */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-stone-50 border border-stone-200/80 p-1.5 rounded-2xl gap-1.5">
        {(Object.keys(FOLDER_DETAILS) as MediaFolder[]).map((folderKey) => {
          const isActive = activeFolder === folderKey;
          const info = FOLDER_DETAILS[folderKey];
          return (
            <button
              key={folderKey}
              onClick={() => setActiveFolder(folderKey)}
              className={`py-3 text-center text-[10.5px] font-extrabold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? "bg-[#82862F] text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-850 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-1.5">
                {folderKey === "videos" ? <Film className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                <span>{info.label}</span>
              </div>
              <span className="text-[8px] opacity-75 font-mono lowercase mt-0.5">/{folderKey}</span>
            </button>
          );
        })}
      </div>

      {/* Folder Sub-description */}
      <div className="p-4 bg-stone-50 border border-stone-150 rounded-2xl">
        <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1">
          <FolderOpen className="w-4 h-4 text-[#82862F]" />
          <span>Active Folder: <strong className="text-[#82862F] font-mono">/{activeFolder}</strong></span>
        </h4>
        <p className="text-[11px] text-stone-500 mt-1">{FOLDER_DETAILS[activeFolder].desc}</p>
      </div>

      {/* Upload Drag & Drop Box */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-3 transition-all group cursor-pointer ${
          isDragging 
            ? "border-[#82862F] bg-[#82862F]/5"
            : "border-stone-200 bg-stone-50/20 hover:border-[#82862F]/40"
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect}
          accept={FOLDER_DETAILS[activeFolder].accept}
          className="hidden" 
        />
        <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center group-hover:scale-110 duration-300 shadow-xs">
          {uploadingFile ? (
            <RefreshCw className="w-7 h-7 text-[#82862F] animate-spin" />
          ) : (
            <UploadCloud className="w-7 h-7 text-stone-400 group-hover:text-[#82862F] transition-colors" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-stone-700">
            {uploadingFile ? `Uploading ${uploadingFile}...` : "Drag & Drop media here, or click to select"}
          </p>
          <p className="text-[10px] text-stone-400">
            Supports {activeFolder === "videos" ? "videos (MP4, WebM, MOV)" : activeFolder === "gallery" || activeFolder === "shop" ? "images (JPG, PNG, WebP)" : "images and videos"} up to 45MB.
          </p>
        </div>
      </div>

      {/* Replace Hidden File Input */}
      <input 
        type="file" 
        ref={replaceInputRef} 
        onChange={handleReplaceSelect}
        accept={FOLDER_DETAILS[activeFolder].accept}
        className="hidden" 
      />

      {/* File List Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-450 border-b border-stone-100 pb-2">
          Stored Media Files ({files.length})
        </h4>

        {loading && files.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="w-8 h-8 text-[#82862F] animate-spin" />
            <span className="text-xs text-stone-400">Querying Supabase Storage Bucket...</span>
          </div>
        ) : files.length === 0 ? (
          <div className="py-16 text-center space-y-2 border border-dashed border-stone-200 rounded-3xl bg-stone-50/20">
            <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
            <div>
              <p className="font-bold text-stone-700 text-xs">No media files in this folder</p>
              <p className="text-[10px] text-stone-400 mt-0.5">Use the upload box above to add your first asset.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((item) => {
              const isVideo = item.mimeType?.startsWith("video/") || item.name.match(/\.(mp4|webm|mov)$/i);
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
                >
                  
                  {/* Visual Preview Slot */}
                  <div className="aspect-video bg-stone-900 rounded-xl overflow-hidden relative group flex items-center justify-center">
                    {isVideo ? (
                      <div className="w-full h-full relative">
                        <video 
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-stone-950/45 flex items-center justify-center group-hover:bg-stone-950/20 transition-colors">
                          <Play className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={item.url} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Quick Preview Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200 rounded-xl">
                      <button 
                        onClick={() => setPreviewMedia(item)}
                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-white/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3 space-y-1.5">
                    <strong className="text-xs text-stone-850 block truncate font-bold" title={item.name}>
                      {item.name}
                    </strong>
                    <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono">
                      <span>{formatBytes(item.size)}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-3 gap-1">
                    <button
                      onClick={() => handleCopyUrl(item)}
                      className="py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 border border-stone-200"
                      title="Copy public link"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Link</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setReplaceTarget(item);
                        replaceInputRef.current?.click();
                      }}
                      className="py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 border border-stone-200"
                      title="Replace file with keeping same name"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replace</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFile(item)}
                      className="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1 border border-rose-100"
                      title="Delete asset from Supabase"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL SCREEN PREVIEW MODAL */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button 
            onClick={() => setPreviewMedia(null)}
            className="absolute top-4 right-4 p-2 bg-stone-900/80 hover:bg-stone-800 text-white rounded-full cursor-pointer hover:scale-105 transition-transform"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black border border-stone-800">
              {previewMedia.mimeType?.startsWith("video/") || previewMedia.name.match(/\.(mp4|webm|mov)$/i) ? (
                <video 
                  src={previewMedia.url} 
                  controls 
                  autoPlay 
                  className="max-w-full max-h-[75vh] object-contain"
                />
              ) : (
                <img 
                  src={previewMedia.url} 
                  alt={previewMedia.name} 
                  className="max-w-full max-h-[75vh] object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            
            <div className="text-center text-white space-y-1">
              <h4 className="text-sm font-bold font-mono">{previewMedia.name}</h4>
              <p className="text-xs text-stone-400">
                URL: <a href={previewMedia.url} target="_blank" rel="noreferrer" className="text-[#82862F] hover:underline font-mono break-all">{previewMedia.url}</a>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
