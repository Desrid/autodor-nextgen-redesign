import Image from "next/image";

import {
  FOOTER_CONTACTS,
  FOOTER_LEGAL_LINKS,
  GOVERNMENT_LINKS,
  SOCIAL_LINKS,
} from "@/app/data/home-content";

export function SiteFooter() {
  return (
    <footer className="site-footer" data-section="footer" data-node-id="1767:7539">
      <div className="footer-frame" data-node-id="1767:7540">
        <div className="footer-top-row" data-node-id="1767:7541">
          <div className="footer-brand" data-node-id="1767:7542">
            <a href="https://russianhighways.ru/" aria-label="Государственная компания Автодор">
              <Image src="/brand/autodor-logo-footer.svg" alt="" width={241} height={38} loading="lazy" />
            </a>
          </div>
          <div className="footer-top-spacer" aria-hidden="true" />
          <address className="footer-contacts" data-node-id="1767:8050">
            {FOOTER_CONTACTS.map((item) => {
              const content = <><Image src={item.image} alt="" width={24} height={24} /><span>{item.value}</span></>;
              return item.href ? <a className="footer-contact" href={item.href} data-node-id={item.nodeId} key={item.label}>{content}</a> : <span className="footer-contact" data-node-id={item.nodeId} key={item.label}>{content}</span>;
            })}
          </address>
          <nav className="footer-social" aria-label="Социальные сети" data-node-id="1767:8066">
            {SOCIAL_LINKS.map((item) => <a key={item.label} href={item.href} aria-label={item.label} data-node-id={item.nodeId}><Image src={item.image} alt="" width={48} height={48} loading="lazy" /></a>)}
          </nav>
        </div>
        <nav className="footer-government" aria-label="Государственные ресурсы" data-node-id="1767:8085">
          {GOVERNMENT_LINKS.map((item) => <a key={item.label} href={item.href} aria-label={item.label} data-node-id={item.nodeId}><Image src={item.image} alt="" width={item.width} height={64} loading="lazy" /><span className="footer-government__label">{item.caption}</span></a>)}
        </nav>
        <nav className="footer-legal" aria-label="Правовая информация" data-node-id="1767:9207">
          {FOOTER_LEGAL_LINKS.map((item) => <a href={item.href} data-node-id={item.nodeId} key={item.label}>{item.label}</a>)}
        </nav>
        <p className="footer-copyright" data-node-id="1767:9215">© 2009–2026&nbsp;Государственная компания «Российские автомобильные дороги»</p>
      </div>
    </footer>
  );
}
