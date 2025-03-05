function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Pronostics Sportifs. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
