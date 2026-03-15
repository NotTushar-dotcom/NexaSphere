import { useEffect, useState } from 'react';

// Small popup showing a value with a copy button
function CopyPopup({ label, value, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Close when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.copy-popup')) onClose();
    };
    setTimeout(() => document.addEventListener('click', handler), 0);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  return (
    <div className="copy-popup">
      <span className="copy-popup-value">{value}</span>
      <button className="copy-popup-btn" onClick={handleCopy}>
        {copied ? '✅ Copied!' : '📋 Copy'}
      </button>
    </div>
  );
}

export default function TeamMemberModal({ member, onClose }) {
  const [activePopup, setActivePopup] = useState(null); // 'email' | 'whatsapp' | null

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!member) return null;

  const hasSocial = member.linkedin || member.whatsapp || member.instagram || member.email;

  // Extract phone number from WhatsApp URL for display
  // e.g. https://wa.me/919876543210 → +91 98765 43210
  // or QR link → show the full URL
  const whatsappDisplay = member.whatsapp
    ? member.whatsapp.replace('https://wa.me/', '').startsWith('qr/')
      ? member.whatsapp   // QR link — show full URL for copy
      : '+' + member.whatsapp.replace('https://wa.me/', '')
    : null;

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        {/* Close */}
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Photo */}
        <img src={member.photo} alt={member.name} className="modal-photo" />

        {/* Name & Role */}
        <div className="modal-name">{member.name}</div>
        <div className="modal-role">{member.role}</div>

        {/* Info */}
        <div className="modal-info">
          <div className="modal-info-row">
            <span className="modal-info-label">🎓 Year</span>
            <span className="modal-info-value">{member.year}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">🔬 Branch</span>
            <span className="modal-info-value">{member.branch}</span>
          </div>
          <div className="modal-info-row">
            <span className="modal-info-label">📋 Section</span>
            <span className="modal-info-value">{member.section}</span>
          </div>
        </div>

        {/* Social links */}
        {hasSocial && (
          <div className="modal-social">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-social-btn btn-linkedin"
              >
                🔗 LinkedIn
              </a>
            )}

            {/* WhatsApp — click to show number/link + copy */}
            {member.whatsapp && (
              <div style={{ position: 'relative' }}>
                <button
                  className="modal-social-btn btn-whatsapp"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopup(activePopup === 'whatsapp' ? null : 'whatsapp');
                  }}
                >
                  💬 WhatsApp
                </button>
                {activePopup === 'whatsapp' && (
                  <CopyPopup
                    label="WhatsApp"
                    value={member.whatsapp}
                    onClose={() => setActivePopup(null)}
                  />
                )}
              </div>
            )}

            {member.instagram && (
              <a
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-social-btn btn-instagram"
              >
                📸 Instagram
              </a>
            )}

            {/* Email — click to show address + copy */}
            {member.email && (
              <div style={{ position: 'relative' }}>
                <button
                  className="modal-social-btn btn-contact"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePopup(activePopup === 'email' ? null : 'email');
                  }}
                >
                  ✉️ Email
                </button>
                {activePopup === 'email' && (
                  <CopyPopup
                    label="Email"
                    value={member.email}
                    onClose={() => setActivePopup(null)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
