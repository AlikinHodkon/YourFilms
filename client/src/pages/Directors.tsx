import Navbar from "../components/Navbar.tsx";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Directors() {
  const [directors, setDirectors] = useState([]);
  const [filteredDirectors, setFilteredDirectors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingDirector, setEditingDirector] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [biography, setBiography] = useState("");

  useEffect(() => {
    fetchDirectors();
  }, []);

  function fetchDirectors() {
    axios.get("http://localhost:5000/api/directors")
      .then((response) => {
        setDirectors(response.data);
        setFilteredDirectors(response.data);
      });
  }

  function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredDirectors(
      directors.filter(director =>
        director.first_name.toLowerCase().includes(query) ||
        director.last_name.toLowerCase().includes(query)
      )
    );
  }

  function addDirector() {
    axios.post("http://localhost:5000/api/directors", {
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate || null,
      biography
    }).then(fetchDirectors);
  }

  function deleteDirector(id: number) {
    axios.delete(`http://localhost:5000/api/directors/${id}`)
      .then(fetchDirectors);
  }

  function startEditing(director) {
    setEditingDirector(director);
    setFirstName(director.first_name);
    setLastName(director.last_name);
    setBirthDate(director.birth_date ? director.birth_date.split("T")[0] : "");
    setBiography(director.biography);
  }

  function updateDirector() {
    if (!editingDirector) return;

    axios.put(`http://localhost:5000/api/directors/${editingDirector.director_id}`, {
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate || null,
      biography
    }).then(() => {
      setEditingDirector(null);
      setFirstName("");       // очистка полей
      setLastName("");
      setBirthDate("");
      setBiography("");
      fetchDirectors();
    });
  }


  return (
    <div className="bg-[#14181c] min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center text-white p-5">
        <h2 className="text-2xl font-bold">Режиссеры</h2>

        {/* 🔹 Поле поиска */}
        <input
          type="text"
          placeholder="Поиск по имени или фамилии..."
          className="w-1/2 p-2 mt-2 bg-[#1d242b] text-white rounded border border-[#8a9aa9]"
          value={searchQuery}
          onChange={handleSearch}
        />

        <ul className="space-y-4 w-1/2 mt-4">
          {filteredDirectors.map((director) => (
            <li key={director.director_id} className="bg-[#283038] p-3 rounded text-white">
              <p className="font-bold">{director.first_name} {director.last_name}</p>
              <p className="text-[#8a9aa9]">Дата рождения: {director.birth_date.split("T")[0]}</p>
              <p className="text-[#647586] mt-2">{director.biography}</p>
              <button className="text-orange-500 hover:underline" onClick={() => startEditing(director)}>Редактировать</button>
              <button className="text-red-500 hover:underline ml-2" onClick={() => deleteDirector(director.director_id)}>Удалить</button>
            </li>
          ))}
        </ul>

        <div className="mt-6 p-5 w-1/2 bg-[#1d242b] rounded">
          <h3 className="text-xl font-semibold">{editingDirector ? "Редактировать режиссера" : "Добавить режиссера"}</h3>

          <input type="text" className="w-full p-2 mt-2 bg-[#283038] text-white rounded" placeholder="Имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" className="w-full p-2 mt-2 bg-[#283038] text-white rounded" placeholder="Фамилия" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <input
            type="date"
            className="w-full p-2 mt-2 border border-[#8a9aa9] rounded bg-[#283038] text-white"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
          <textarea className="w-full p-2 mt-2 bg-[#283038] text-white rounded" placeholder="Биография" value={biography} onChange={(e) => setBiography(e.target.value)}></textarea>

          {editingDirector ? (
            <button className="mt-3 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700" onClick={updateDirector}>Сохранить изменения</button>
          ) : (
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={addDirector}>Добавить</button>
          )}
        </div>
      </div>
    </div>
  );
}
