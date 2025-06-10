import Navbar from "../components/Navbar.tsx";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingGenre, setEditingGenre] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchGenres();
  }, []);

  function fetchGenres() {
    axios.get("http://localhost:5000/api/genres")
      .then((response) => {
        setGenres(response.data);
        setFilteredGenres(response.data);
      });
  }

  function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredGenres(
      genres.filter(genre =>
        genre.name.toLowerCase().includes(query)
      )
    );
  }

  function addGenre() {
    axios.post("http://localhost:5000/api/genres", { name, description })
      .then(fetchGenres);
  }

  function deleteGenre(id: number) {
    axios.delete(`http://localhost:5000/api/genres/${id}`)
      .then(fetchGenres);
  }

  function startEditing(genre) {
    setEditingGenre(genre);
    setName(genre.name);
    setDescription(genre.description);
  }

  function updateGenre() {
    if (!editingGenre) return;

    axios.put(`http://localhost:5000/api/genres/${editingGenre.genre_id}`, { name, description })
      .then(() => {
        setEditingGenre(null);
        fetchGenres();
      });
  }

  return (
    <div className="bg-[#14181c] min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center text-white p-5">
        <h2 className="text-2xl font-bold">Жанры</h2>

        <input
          type="text"
          placeholder="Поиск по названию..."
          className="w-1/2 p-2 mt-2 bg-[#1d242b] text-white rounded border border-[#8a9aa9]"
          value={searchQuery}
          onChange={handleSearch}
        />

        <ul className="space-y-4 w-1/2 mt-4">
          {filteredGenres.map((genre) => (
            <li key={genre.genre_id} className="bg-[#283038] p-3 rounded text-white">
              <p className="font-bold">{genre.name}</p>
              <p className="text-[#8a9aa9] mt-1">{genre.description}</p>
              <button className="text-orange-500 hover:underline" onClick={() => startEditing(genre)}>Редактировать</button>
              <button className="text-red-500 hover:underline ml-2" onClick={() => deleteGenre(genre.genre_id)}>Удалить</button>
            </li>
          ))}
        </ul>

        <div className="mt-6 p-5 w-1/2 bg-[#1d242b] rounded">
          <h3 className="text-xl font-semibold">{editingGenre ? "Редактировать жанр" : "Добавить жанр"}</h3>

          <input type="text" className="w-full p-2 mt-2 bg-[#283038] text-white rounded" placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="w-full p-2 mt-2 bg-[#283038] text-white rounded" placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

          {editingGenre ? (
            <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700" onClick={updateGenre}>Сохранить изменения</button>
          ) : (
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={addGenre}>Добавить</button>
          )}
        </div>
      </div>
    </div>
  );
}
