// Bu uygulamayı Rick and Morty API'sini kullanarak geliştirdim.
// Temel amaç: filtreleme, sıralama, sayfalama ve detay görüntüleme özelliklerini pratik etmekti.

import React, { useEffect, useState } from "react";
import axios from "axios";

// API'den gelecek karakterlerin tipi
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

const App = () => {
  // Kullanıcıdan alınan filtreler ve karakter verileri için state'ler tanımlandı
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filtered, setFiltered] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Character | null>(null);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [error, setError] = useState("");

  // Sayfalama için toplam sayfa sayısı
  const totalPages = Math.ceil(filtered.length / perPage);

  // Sayfa açıldığında karakterleri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        let allCharacters: Character[] = [];
        // En az 250 karakter için 15 sayfa çağrıyoruz (her sayfa 20 veri içeriyor)
        for (let i = 1; i <= 15; i++) {
          const res = await axios.get(\https://rickandmortyapi.com/api/character?page=\${i}\);
          allCharacters = [...allCharacters, ...res.data.results];
        }
        setCharacters(allCharacters);
        setFiltered(allCharacters); // Başta tüm veriler gösterilsin
      } catch (err) {
        setError("Veriler alınırken bir hata oluştu.");
      }
    };
    fetchData();
  }, []);

  // Filtreleme işlemleri (isim ve cinsiyet)
  useEffect(() => {
    let filteredData = characters.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
    if (gender) {
      filteredData = filteredData.filter((c) => c.gender === gender);
    }
    setFiltered(filteredData);
    setPage(1); // Yeni filtrede sayfa başa dönmeli
  }, [search, gender, characters]);

  // Satıra tıklanınca detayları göstermek için seçilen karakter
  const handleRowClick = (char: Character) => {
    setSelected(char);
  };

  // Şu anki sayfadaki veriler
  const currentData = filtered.slice(
    (page - 1) * perPage,
    (page - 1) * perPage + perPage
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rick and Morty Karakter Tablosu</h1>

      {/* Filtreleme girişleri */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="İsme göre filtrele"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2"
        >
          <option value="">Cinsiyet (Hepsi)</option>
          <option value="Male">Erkek</option>
          <option value="Female">Kadın</option>
          <option value="Genderless">Cinsiyetsiz</option>
          <option value="unknown">Bilinmiyor</option>
        </select>
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border p-2"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Hata varsa göster */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Sonuç bulunmazsa mesaj ver */}
      {!filtered.length && !error ? (
        <div>Uygun sonuç bulunamadı.</div>
      ) : (
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="border p-2">İsim</th>
              <th className="border p-2">Durum</th>
              <th className="border p-2">Tür</th>
              <th className="border p-2">Cinsiyet</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((char) => (
              <tr
                key={char.id}
                onClick={() => handleRowClick(char)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="border p-2">{char.name}</td>
                <td className="border p-2">{char.status}</td>
                <td className="border p-2">{char.species}</td>
                <td className="border p-2">{char.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Sayfalama düğmeleri */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Önceki
        </button>
        <span>
          Sayfa {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Sonraki
        </button>
      </div>

      {/* Detaylar */}
      {selected && (
        <div className="mt-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Detaylar</h2>
          <img src={selected.image} alt={selected.name} className="w-32 h-32" />
          <p><strong>İsim:</strong> {selected.name}</p>
          <p><strong>Durum:</strong> {selected.status}</p>
          <p><strong>Tür:</strong> {selected.species}</p>
          <p><strong>Cinsiyet:</strong> {selected.gender}</p>
        </div>
      )}
    </div>
  );
};
