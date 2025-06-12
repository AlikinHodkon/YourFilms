import { useEffect, useState } from "react";
import axios from "axios";
import { IFilm, IReview } from "../types.ts";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Review from "../components/Review.tsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import "./Review.css";
import EditableField from "../components/EditableField.tsx";

function FilmData() {
    const { t } = useTranslation();
    const [filmData, setFilmData] = useState<IFilm | null>(null);
    const [reviews, setReviews] = useState<IReview[] | []>([]);
    const [userData, setUserData] = useState(null);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const [image, setImage] = useState<File | null>(null);
     const [isAdmin, setIsAdmin] = useState(false);
     const [genres, setGenres] = useState([]);
     const [directors, setDirectors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

         const [genreResponse, directorResponse] = await Promise.all([
             axios.get("http://localhost:5000/api/genres"),
             axios.get("http://localhost:5000/api/directors")
         ]);
         setGenres(genreResponse.data);
         setDirectors(directorResponse.data);
                 axios
                .get("http://localhost:5000/api/admin-status", { withCredentials: true })
                .then((response) => {
                  setIsAdmin(response.data.isAdmin);
                })
                .catch(() => {
                  setIsAdmin(false);
                });
                const [reviewsResponse, userResponse, filmResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/reviews/${params.id}`),
                    axios.post("http://localhost:5000/api/profile", { email: localStorage.getItem("email") }),
                    axios.get(`http://localhost:5000/api/films/${params.id}`)
                ]);

                if (userResponse.data?.email && filmResponse.data?.movie_id) {
                    await axios.post("http://localhost:5000/api/watch", {
                        email: userResponse.data.email,
                        movie_id: filmResponse.data.movie_id
                    });
                }

                setReviews(reviewsResponse.data);
                setUserData(userResponse.data);
                setFilmData(filmResponse.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);


    function handleImageUpload(event) { // 🔹 Загрузка изображения
        const file = event.target.files[0];
        setImage(file);
    }

    function handleImageSubmit() { // 🔹 Отправка изображения
        if (!image) return;

        const formData = new FormData();
        formData.append("image", image);

        axios.post(`http://localhost:5000/api/films/${params.id}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }).then(() => {
            axios.get(`http://localhost:5000/api/films/${params.id}`).then((response) => {
                setFilmData(response.data);
            });
        });
    }

    function handleClick() {
        axios.post("http://localhost:5000/api/reviews", {
            "user_id": userData?.user_id,
            "movie_id": filmData?.movie_id,
            "text": text,
            "rating": rating
        }).then(() => {
            axios.get(`http://localhost:5000/api/reviews/${params.id}`).then((response) => {
                setReviews(response.data);
            });
        }).then(() => {
            setText("");
            setRating(1);
        });
    }

    const handleFieldUpdate = async (fieldName: string, value: string, filmId: number) => {
        try {
            await axios.patch(
                `http://localhost:5000/api/films/${filmId}`,
                { fieldName: fieldName, value: value },
                {
                    headers: {
                    'Content-Type': 'application/json',
                    },
                }
            );

            setFilmData(() => ({...filmData, [fieldName]: value}))
        } catch (error) {
            console.error("Error updating field:", error);
            throw error;
        }
    };

    if (isLoading || !filmData) {
        return (
            <div className="bg-[#14181c] min-h-screen flex flex-col">
                <Navbar />
                <div className="flex justify-center items-center h-full text-white">
                    Loading...
                </div>
            </div>
        );
    }

    async function handleFilmSave() {
      try {
        await axios.put(`http://localhost:5000/api/films/${filmData.movie_id}`, {
          title: filmData.title,
          genre_id: filmData.genre_id,
          release_date: filmData.release_date,
          director_id: filmData.director_id,
          rating: filmData.rating,
        }, {
          withCredentials: true
        });

        alert("Фильм успешно обновлён");
      } catch (error) {
        console.error("Ошибка при обновлении фильма:", error);
        alert("Ошибка обновления");
      }
    }


    return (
        <div className="bg-[#14181c] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex justify-center text-[#8a9aa9] pt-[2vh] flex-grow gap-4">

                <div className="h-[50vh] w-[15vw] flex flex-col items-center justify-center">
                  <img
                    className="h-[50vh] rounded border-2 w-[15vw]"
                    src={`http://localhost:5000/images/${filmData?.image}`}
                    alt={t("film_title")}
                  />
                  {isAdmin && (
                    <div className="flex flex-col items-center">
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        className="mt-2 text-white"
                      />
                      <button
                        onClick={handleImageSubmit}
                        className="bg-blue-500 text-white rounded p-2 mt-2"
                      >
                        Загрузить картинку
                      </button>
                    </div>
                  )}
                </div>


                <div className="flex flex-col flex-grow">
                    <section className="flex flex-row justify-between w-[40vw] text-white text-center items-center">
                        <EditableField
                            className="text-2xl"
                            fieldName="title"
                            value={filmData.title || ""}
                            onUpdate={handleFieldUpdate}
                            filmId={filmData.movie_id}
                        />
                        <p className="text-[16px] flex">
                            {t("release_date")}:
                            <EditableField
                                className="text-base"
                                fieldName="release_date"
                                value={filmData.release_date ? new Date(filmData.release_date).toLocaleDateString("ru-RU") : ""}
                                onUpdate={handleFieldUpdate}
                                filmId={filmData.movie_id}
                            />
                        </p>
                        <p className="text-[16px]">{t("director")}: {filmData.director_name}</p>
                        {isAdmin && (
                        <select
                          className="bg-[#1d242b] ml-2 rounded text-white px-2"
                          value={filmData.director_id}
                          onChange={async (e) => {
                            const newDirectorId = parseInt(e.target.value);
                            const newDirector = directors.find(d => d.director_id === newDirectorId);
                            setFilmData((prev) => ({
                              ...prev,
                              director_id: newDirectorId,
                              director_name: newDirector
                                ? `${newDirector.first_name} ${newDirector.last_name}`
                                : prev.director_name,
                            }));

                            try {
                              await axios.put(`http://localhost:5000/api/films/${filmData.movie_id}`, {
                                title: filmData.title,
                                genre_id: filmData.genre_id,
                                release_date: filmData.release_date,
                                director_id: newDirectorId,
                                rating: filmData.rating,
                              }, { withCredentials: true });
                            } catch (err) {
                              console.error("Ошибка при обновлении режиссёра:", err);
                            }
                          }}
                        >
                          {directors.map((d) => (
                            <option key={d.director_id} value={d.director_id}>
                              {d.first_name} {d.last_name}
                            </option>
                          ))}
                        </select>)}

                    </section>

                    <div className="flex mt-2">
                        <p className="bg-[#283038] rounded p-1 text-[#8a9aa9]">{t("genre")}: {filmData?.genre_name}</p>
                        {isAdmin && (
                            <select
                              className="bg-[#1d242b] ml-2 rounded text-white px-2"
                              value={filmData.genre_id}
                              onChange={async (e) => {
                                const newGenreId = parseInt(e.target.value);
                                  const newGenre = genres.find(g => g.genre_id === newGenreId);

                                  // Обновляем локально genre_id + genre_name
                                  setFilmData((prev) => ({
                                    ...prev,
                                    genre_id: newGenreId,
                                    genre_name: newGenre ? newGenre.name : prev.genre_name,
                                  }));

                                try {
                                  await axios.put(`http://localhost:5000/api/films/${filmData.movie_id}`, {
                                    title: filmData.title,
                                    genre_id: newGenreId,
                                    release_date: filmData.release_date,
                                    director_id: filmData.director_id,
                                    rating: filmData.rating,
                                  }, { withCredentials: true });
                                } catch (err) {
                                  console.error("Ошибка при обновлении жанра:", err);
                                }
                              }}
                            >
                              {genres.map((g) => (
                                <option key={g.genre_id} value={g.genre_id}>
                                  {g.name}
                                </option>
                              ))}
                            </select>
                          )}
                    </div>

                    <hr className="bg-[#14181c] mt-5 mb-5"/>

                    <section className="flex text-2xl text-center w-100 text-white justify-between items-center">
                        <h2 className="ml-[5vw]">{t("rating")}</h2>
                        <div className={`ml-auto mr-[5vw] border rounded-3xl w-[3vw] h-[3vw] text-white flex justify-center items-center ${filmData?.rating > 6 ? "bg-green-500" : filmData?.rating > 3 ? "bg-amber-500" : "bg-red-600"}`}>
                            <p>{filmData?.rating}</p>
                        </div>
                    </section>

                    <section className="flex flex-col text-[24px] flex-grow overflow-hidden">
                        <h2 className="text-center">{t("reviews")}</h2>
                        <div className="flex flex-col space-y-2 items-center">
                            {reviews.map((review) => (
                                <Review key={review.review_id} review={review} setReviews={setReviews} userData={userData} />
                            ))}
                        </div>

                        <div className={`${localStorage.getItem("email") && localStorage.getItem("email") != "admin" ? "flex" : "hidden"} flex-col mt-5 h-full items-center`}>
                            <div className="flex flex-col p-3 border-2 rounded bg-[#1d242b] w-3/4">
                                <div className="flex pb-3">
                                    <h3 className="text-[16px] text-[#647586]">
                                        {t("review_by")} <span className="text-[#aabbcc]">{userData?.last_name} {userData?.first_name}</span>
                                    </h3>
                                    <div className="ml-auto border flex justify-center items-center">
                                        <select onChange={(e) => setRating(parseInt(e.target.value))}
                                                className="bg-[#283038] text-[#8a9aa9]">
                                            {Array.from({ length: 10 }, (_, i) => <option key={i+1}>{i+1}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <ReactQuill
                                    value={text}
                                    onChange={setText}
                                    className="quill-container overflow-auto h-80 bg-white text-black rounded"
                                    modules={{ toolbar: true }}
                                    readOnly={false}
                                />

                                <div className={"flex justify-center mt-3"}>
                                    <button onClick={handleClick} className="bg-green-500 text-white rounded p-2">Добавить отзыв</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default FilmData;
