export default function BiodataDiri() {
    return (
      <div>
  
        <div className="section">
          <HeaderBio />
          <Greeting />
          <StatusBadge />
        </div>
  
        <div className="section">
          <UserCard 
            nama="Dewi Mega"
            nim="2457301033"
            tanggal="31 Agustus 2006"
            alamat="Perawang, Riau"
            hobi="Desain & Menulis"
            prodi="Sistem Informasi"
            kampus="Politeknik Caltex Riau"
          />
        </div>
  
        <div className="section">
          <QuoteText />
        </div>
  
        <div className="section">
          <SkillList />
        </div>
  
        <div className="section">
          <SocialMedia />
        </div>
  
      </div>
    )
  }
  
  // CHILD COMPONENTS
  
  function HeaderBio() {
    return (
      <div>
        <h2>About Me</h2>
        <p className="subtitle">Digital Portfolio • 2026</p>
      </div>
    );
  }
  
  function Greeting() {
    return (
      <p className="greeting">
        Currently exploring tech, design, and creativity 🚀
      </p>
    );
  }
  
  function StatusBadge() {
    return (
      <div>
        <span className="badge">● Informatics Student</span>
      </div>
    );
  }
  
  function UserCard(props) {
    return (
      <div className="user-card">
        <strong>Nama</strong><span>{props.nama}</span>
        <strong>NIM</strong><span>{props.nim}</span>
        <strong>Tanggal Lahir</strong><span>{props.tanggal}</span>
        <strong>Alamat</strong><span>{props.alamat}</span>
        <strong>Hobi</strong><span>{props.hobi}</span>
        <strong>Prodi</strong><span>{props.prodi}</span>
        <strong>Kampus</strong><span>{props.kampus}</span>
      </div>
    )
  }
  
  function QuoteText() {
    return (
      <div>
        <p className="quote-main">stay curious, keep building ⚡</p>
        <p className="quote-sub">small steps today, big impact tomorrow</p>
      </div>
    )
  }
  
  function SkillList() {
    return (
      <div className="skills">
        <p className="skill-title">Skills</p>
        <ul>
          <li>HTML</li>
          <li>CSS</li>
          <li>React</li>
          <li>UI Design</li>
        </ul>
      </div>
    )
  }
  
  function SocialMedia() {
    return (
      <div className="social">
        Instagram: @ddmegg_
      </div>
    );
  }