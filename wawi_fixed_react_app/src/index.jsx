import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './index.css';

const supabaseUrl = 'https://jkfghygkvrxvxzphrypt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZmdoeWdrdnJ4dnh6cGhyeXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODMxODIsImV4cCI6MjA2OTY1OTE4Mn0.TH6sZ3XNX9y9NHpP2eyLgtCtT5DTTq0BKS3VZ4RJgVQ';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [artikel, setArtikel] = useState([]);
  const [neu, setNeu] = useState({ name: '', bestand: '', mindestbestand: '', einheit: '' });

  useEffect(() => {
    ladeArtikel();
  }, []);

  async function ladeArtikel() {
    const { data, error } = await supabase.from('artikel').select('*').order('id', { ascending: true });
    if (!error) setArtikel(data);
  }

  async function artikelErstellen() {
    const { error } = await supabase.from('artikel').insert([{
      name: neu.name,
      bestand: parseInt(neu.bestand),
      mindestbestand: parseInt(neu.mindestbestand),
      einheit: neu.einheit,
    }]);
    if (!error) {
      setNeu({ name: '', bestand: '', mindestbestand: '', einheit: '' });
      ladeArtikel();
    }
  }

  async function bestandAendern(id, delta) {
    const artikelItem = artikel.find(a => a.id === id);
    const neuerBestand = artikelItem.bestand + delta;
    const { error } = await supabase.from('artikel').update({ bestand: neuerBestand }).eq('id', id);
    if (!error) ladeArtikel();
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lagerverwaltung</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Neuen Artikel anlegen</h2>
        <input className="border p-1 mr-2" placeholder="Name" value={neu.name} onChange={e => setNeu({ ...neu, name: e.target.value })} />
        <input className="border p-1 mr-2 w-20" placeholder="Bestand" type="number" value={neu.bestand} onChange={e => setNeu({ ...neu, bestand: e.target.value })} />
        <input className="border p-1 mr-2 w-20" placeholder="Mindest" type="number" value={neu.mindestbestand} onChange={e => setNeu({ ...neu, mindestbestand: e.target.value })} />
        <input className="border p-1 mr-2 w-20" placeholder="Einheit" value={neu.einheit} onChange={e => setNeu({ ...neu, einheit: e.target.value })} />
        <button className="bg-blue-600 text-white px-3 py-1" onClick={artikelErstellen}>Anlegen</button>
      </div>

      <h2 className="font-semibold mb-2">Artikelübersicht</h2>
      <ul>
        {artikel.map(a => (
          <li key={a.id} className={`mb-2 p-2 border ${a.bestand <= a.mindestbestand ? 'bg-red-100' : 'bg-green-50'}`}>
            <div className="flex justify-between items-center">
              <div>
                <strong>{a.name}</strong> – {a.bestand} {a.einheit} (Minimum: {a.mindestbestand})
              </div>
              <div>
                <button className="bg-red-500 text-white px-2 mr-1" onClick={() => bestandAendern(a.id, -1)}>-</button>
                <button className="bg-green-500 text-white px-2" onClick={() => bestandAendern(a.id, 1)}>+</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
