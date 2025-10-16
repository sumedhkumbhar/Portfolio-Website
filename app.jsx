const { useEffect, useMemo, useState } = React;

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        right: 16,
        bottom: 24,
        padding: '10px 12px',
        borderRadius: 999,
        border: '1px solid #ccd',
        background: '#fff',
        boxShadow: '0 4px 10px #0002',
        cursor: 'pointer',
      }}
      aria-label="Back to top"
      title="Back to top"
    >
      ⬆️
    </button>
  );
}

function DismissibleBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem('bannerDismissed') === '1');
  if (dismissed) return null;
  return (
    <div style={{
      background: '#2563eb',
      color: 'white',
      padding: '10px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 8px #0003'
    }}>
      <span><strong>Welcome!</strong> This page now uses React features: search, filters, and a modal.</span>
      <button onClick={() => { localStorage.setItem('bannerDismissed', '1'); setDismissed(true); }} style={{
        background: 'white', color: '#2563eb', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer'
      }}>Dismiss</button>
    </div>
  );
}

function ProjectCard({ title, description, url }) {
  return (
    <div className="project-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {url && (
        <a href={url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
          View project ↗
        </a>
      )}
    </div>
  );
}

function Projects() {
  const allProjects = useMemo(() => [
    { title: 'Portfolio Website', stack: ['HTML','CSS'], description: 'Polished portfolio using semantic HTML and CSS.', url: null },
    { title: 'Simple Calculator', stack: ['JS'], description: 'Calculator built with HTML, CSS, and JavaScript.', url: null },
    { title: 'E-commerce Hero Mock', stack: ['Design'], description: 'Static watch store landing hero.', url: null },
    { title: 'Todo App', stack: ['JS'], description: 'CRUD todos with localStorage.', url: null },
  ], []);

  const [query, setQuery] = useState('');
  const [stackFilter, setStackFilter] = useState('All');
  const [sort, setSort] = useState('A-Z');
  const [view, setView] = useState('grid');

  const filtered = useMemo(() => {
    let list = allProjects.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    if (stackFilter !== 'All') {
      list = list.filter(p => p.stack.includes(stackFilter));
    }
    if (sort === 'A-Z') list.sort((a,b) => a.title.localeCompare(b.title));
    if (sort === 'Z-A') list.sort((a,b) => b.title.localeCompare(a.title));
    return list;
  }, [allProjects, query, stackFilter, sort]);

  return (
    <div>
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:12 }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search projects..."
          style={{ padding:'8px 10px', border:'1px solid #ccc', borderRadius:8, flex:'1 1 240px' }}
        />
        <select value={stackFilter} onChange={e => setStackFilter(e.target.value)} style={{ padding:'8px 10px', borderRadius:8 }}>
          <option>All</option>
          <option>HTML</option>
          <option>CSS</option>
          <option>JS</option>
          <option>Design</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding:'8px 10px', borderRadius:8 }}>
          <option>A-Z</option>
          <option>Z-A</option>
        </select>
        <div style={{ display:'inline-flex', gap:8 }}>
          <button onClick={() => setView('grid')} style={{ padding:'8px 10px', border:'1px solid #ccc', borderRadius:8, background: view==='grid'?'#eef':'#fff' }}>Grid</button>
          <button onClick={() => setView('list')} style={{ padding:'8px 10px', border:'1px solid #ccc', borderRadius:8, background: view==='list'?'#eef':'#fff' }}>List</button>
        </div>
      </div>

      <div style={{ display: view==='grid'?'grid':'block', gridTemplateColumns: view==='grid'?'repeat(auto-fit, minmax(240px, 1fr))':'none', gap:16 }}>
        {filtered.map(p => (
          <ProjectCard key={p.title} {...p} />
        ))}
        {filtered.length === 0 && (
          <div className="project-card"><p>No projects match your search.</p></div>
        )}
      </div>
    </div>
  );
}

function mount(component, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const root = ReactDOM.createRoot(container);
  root.render(component);
}

// Mount widgets
mount(<DismissibleBanner />, 'react-banner-root');
mount(<Projects />, 'projects-root');
mount(<BackToTop />, 'react-root');


