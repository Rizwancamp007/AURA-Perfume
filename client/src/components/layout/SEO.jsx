import { useEffect } from 'react';

export default function SEO({ title, description, keywords }) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title 
      ? `${title} | AURA Luxury Perfumes` 
      : 'AURA | Handcrafted Luxury Perfumes & Custom Engravings';

    // 2. Update Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content', 
      description || 'Exquisite, hand-blended artisanal fragrances decanted and personalized in Karachi, Pakistan. Express tracked shipping nationwide.'
    );

    // 3. Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content', 
      keywords || 'perfumes, fragrances, luxury scent, custom bottle, glass engraving, Karachi, Pakistan, Oud, Sandalwood'
    );

    // 4. Update Open Graph Tags (Facebook / WhatsApp Previews)
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title ? `${title} | AURA` : 'AURA Luxury Fragrances');

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute(
      'content',
      description || 'Exquisite, hand-blended artisanal fragrances decanted and personalized in Karachi, Pakistan.'
    );

  }, [title, description, keywords]);

  return null;
}
