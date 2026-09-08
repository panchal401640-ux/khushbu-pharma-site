'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AdminLayout } from '../AdminLayout';
import { siteConfig } from '@/lib/config';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [logo, setLogo] = useState('');
  const [favicon, setFavicon] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState({
    name: siteConfig.name,
    phone: siteConfig.phone,
    phone2: siteConfig.phone2 || '',
    whatsapp: siteConfig.whatsapp,
    email: siteConfig.email,
    gst: siteConfig.gst || '',
    address: `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state}, ${siteConfig.address.country} - ${siteConfig.address.pincode}`,
    weekdays: siteConfig.businessHours.weekdays,
    saturday: siteConfig.businessHours.saturday,
    sunday: siteConfig.businessHours.sunday,
    tagline: 'Pharmaceutical Machinery Manufacturer',
    whatsappMessage: 'Hello Khushbu Pharma Machinery, I would like to discuss my pharmaceutical machinery requirements.',
  });

  useEffect(() => {
    try {
      const storedLogo = localStorage.getItem('kpm_logo');
      if (storedLogo) setLogo(storedLogo);
      const storedFavicon = localStorage.getItem('kpm_favicon');
      if (storedFavicon) setFavicon(storedFavicon);
      const storedConfig = localStorage.getItem('kpm_settings');
      if (storedConfig) setConfig(prev => ({ ...prev, ...JSON.parse(storedConfig) }));
    } catch {}
  }, []);

  const handleLogoUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let w = img.width, h = img.height;
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = (h * maxSize) / w; w = maxSize; }
          else { w = (w * maxSize) / h; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/png', 0.9);
          setLogo(compressed);
          localStorage.setItem('kpm_logo', compressed);
          window.dispatchEvent(new Event('kpm-logo-changed'));
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 64, 64);
          const compressed = canvas.toDataURL('image/png', 0.9);
          setFavicon(compressed);
          localStorage.setItem('kpm_favicon', compressed);
          const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
          if (link) link.href = compressed;
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem('kpm_settings', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        {saved && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-700 font-medium flex items-center gap-2">
            <span className="text-lg">✅</span> Settings saved successfully!
          </div>
        )}

        {/* Logo Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-xl">🎨</span> Company Logo
          </h3>
          <p className="text-sm text-gray-500 mb-4">Upload your company logo. It will appear in the header, footer, and all pages.</p>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              {logo ? (
                <div className="relative group">
                  <div className="h-24 w-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    <img src={logo} alt="Company Logo" className="max-h-20 max-w-60 object-contain" />
                  </div>
                  <button
                    onClick={() => { setLogo(''); localStorage.removeItem('kpm_logo'); window.dispatchEvent(new Event('kpm-logo-changed')); }}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 flex items-center justify-center shadow"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="h-24 w-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                  <svg className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">No logo uploaded</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <button
                onClick={() => logoInputRef.current?.click()}
                className="px-5 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {logo ? 'Change Logo' : 'Upload Logo'}
              </button>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]); e.target.value = ''; }} />
              <div className="text-xs text-gray-400 space-y-1">
                <p>• Recommended size: 300x100 pixels</p>
                <p>• Format: PNG (transparent background) or JPG</p>
                <p>• Max file size: 2MB (auto-compressed)</p>
                <p>• Logo appears in header & footer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Favicon Upload */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-xl">🔖</span> Favicon (Browser Tab Icon)
          </h3>
          <p className="text-sm text-gray-500 mb-4">Small icon that appears in the browser tab.</p>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              {favicon ? (
                <div className="relative">
                  <div className="h-16 w-16 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    <img src={favicon} alt="Favicon" className="h-12 w-12 object-contain" />
                  </div>
                  <button
                    onClick={() => { setFavicon(''); localStorage.removeItem('kpm_favicon'); }}
                    className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full text-[10px] hover:bg-red-600 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <span className="text-2xl">📋</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <button
                onClick={() => faviconInputRef.current?.click()}
                className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {favicon ? 'Change Favicon' : 'Upload Favicon'}
              </button>
              <input ref={faviconInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFaviconUpload(e.target.files[0]); e.target.value = ''; }} />
              <div className="text-xs text-gray-400">
                <p>• Recommended: 64x64 or 32x32 pixels PNG</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-xl">🏢</span> Company Information
          </h3>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input value={config.name} onChange={e => setConfig({...config, name: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input value={config.tagline} onChange={e => setConfig({...config, tagline: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
                <input value={config.phone} onChange={e => setConfig({...config, phone: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
                <input value={config.phone2} onChange={e => setConfig({...config, phone2: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input value={config.whatsapp} onChange={e => setConfig({...config, whatsapp: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input value={config.email} onChange={e => setConfig({...config, email: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input value={config.gst} onChange={e => setConfig({...config, gst: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={config.address} onChange={e => setConfig({...config, address: e.target.value})} rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Default Message</label>
              <textarea value={config.whatsappMessage} onChange={e => setConfig({...config, whatsappMessage: e.target.value})} rows={2} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-xl">🕐</span> Business Hours
          </h3>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weekdays</label>
              <input value={config.weekdays} onChange={e => setConfig({...config, weekdays: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saturday</label>
              <input value={config.saturday} onChange={e => setConfig({...config, saturday: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sunday</label>
              <input value={config.sunday} onChange={e => setConfig({...config, sunday: e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Admin Password */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-xl">🔐</span> Admin Password
          </h3>
          <div className="mt-3 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">Current password: <code className="bg-gray-200 px-2 py-0.5 rounded text-xs font-mono">khushbu2024</code></p>
            <p className="text-xs text-gray-400 mt-2">To change admin password, update the ADMIN_PASSWORD constant in AdminLayout.tsx</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} className="px-8 py-3.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
            Save All Settings
          </button>
          <a href="/" target="_blank" className="px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
            View Website ↗
          </a>
        </div>
        <p className="text-xs text-gray-400">Settings are saved in browser localStorage. Logo appears immediately on the site.</p>
      </div>
    </AdminLayout>
  );
}
