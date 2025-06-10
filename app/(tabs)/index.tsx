import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ImageBackground, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
type Movie = {
  id: string;
  title: string;
  poster: string;
  overview: string;
  trailer?: string;
  genre: string;      
  rating: number;     
};

const POSTER_WIDTH = 110;
const POSTER_HEIGHT = 165;

const API_KEY = '9fa87999dfb60ef5a35eed6951e524f9';

export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [actorSearchResults, setActorSearchResults] = useState<Movie[]>([]);
  const [isActorSearch, setIsActorSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const genres = ['All', 'Drama', 'Action', 'Crime', 'Adventure', 'Comedy'];

  const genreMap: { [key: number]: string } = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
  };

  // DAHA FAZLA FİLM ÇEKMEK İÇİN:
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      let all: Movie[] = [];
      for (let page = 1; page <= 10; page++) { 
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
        const data = await res.json();
        // Her film için trailer bilgisini de çek
        const moviesWithTrailer = await Promise.all(
          data.results.map(async (item: any) => {
            // Trailer çek
            let trailerUrl = undefined;
            try {
              const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${item.id}/videos?api_key=${API_KEY}&language=en-US`);
              const videoData = await videoRes.json();
              const youtube = videoData.results?.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer');
              if (youtube) {
                trailerUrl = `https://www.youtube.com/watch?v=${youtube.key}`;
              }
            } catch {}
            return {
              id: item.id.toString(),
              title: item.title,
              poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              overview: item.overview,
              genre: genreMap[item.genre_ids[0]] || 'Other',
              rating: item.vote_average,
              trailer: trailerUrl,
            };
          })
        );
        all = all.concat(moviesWithTrailer);
      }
      setMovies(all);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // Arama filtresi
  const filteredMovies = movies.filter(movie =>
    (selectedGenre === 'All' || movie.genre === selectedGenre) &&
    (search.length < 3 || movie.title.toLowerCase().includes(search.toLowerCase()))
  );

  const openTrailer = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert('YouTube linki açılamadı!');
      }
    });
  };

  const openModal = async (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
    // Oyuncuları çek
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}&language=en-US`);
      const data = await res.json();
      setCast(data.cast.slice(0, 5)); // En önemli 5 oyuncu
    } catch {
      setCast([]);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setModalVisible(false);
  };

  const handleSearch = async (text: string) => {
    setSearch(text); // Her zaman güncelle
    if (text.length > 2) {
      const actorId = await fetchActorIdByName(text);
      if (actorId) {
        setLoading(true);
        const movies = await fetchMoviesByActorId(actorId);
        const filtered = movies.filter((item: any) => item.vote_average > 0);
        const results: Movie[] = [];
        for (const item of filtered) {
          try {
            const creditsRes = await fetch(`https://api.themoviedb.org/3/movie/${item.id}/credits?api_key=${API_KEY}&language=en-US`);
            const creditsData = await creditsRes.json();
            const top5 = (creditsData.cast || []).slice(0, 5);
            const found = top5.some((actor: any) =>
              actor.name.toLowerCase().includes(text.toLowerCase())
            );
            if (found) {
              results.push({
                id: item.id.toString(),
                title: item.title,
                poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                overview: item.overview,
                genre: genreMap[item.genre_ids?.[0]] || 'Other',
                rating: item.vote_average,
              });
            }
          } catch {}
        }
        results.sort((a, b) => b.rating - a.rating);
        setActorSearchResults(results);
        setIsActorSearch(true);
        setLoading(false);
        return;
      }
    }
    // Arama kutusu boşsa veya 3 karakterden azsa:
    setIsActorSearch(false);
    setActorSearchResults([]);
    setSelectedGenre('All');
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={styles.background}>
      <ImageBackground
        source={{ uri: 'https://www.transparenttextures.com/patterns/diamond-upholstery.png' }}
        style={styles.background}
        imageStyle={{ opacity: 0.08 }}
      >
        <Text style={styles.title}>Top Rated IMDb Movies</Text>
        <View style={{ flexDirection: 'row', marginLeft: 16, marginBottom: 8, flexWrap: 'wrap' }}>
          {genres.map(genre => (
            <TouchableOpacity
              key={genre}
              onPress={() => {
                setSelectedGenre(genre);
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                if (genre === 'All') {
                  setSearch('');
                  setIsActorSearch(false);
                  setActorSearchResults([]);
                }
              }}
              style={{
                backgroundColor: selectedGenre === genre ? '#e50914' : '#232323',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                marginRight: 8,
                marginBottom: 6,
              }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={{
            backgroundColor: '#232323',
            color: '#fff',
            borderRadius: 8,
            margin: 16,
            paddingHorizontal: 12,
            fontSize: 16,
          }}
          placeholder="Search movies or actor..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={handleSearch}
        />
        {loading && <ActivityIndicator size="large" color="#e50914" style={{marginTop: 40}} />}
        <FlatList
          ref={flatListRef}
          data={isActorSearch ? actorSearchResults : filteredMovies}
          keyExtractor={(item) => item.id}
          numColumns={2} // <-- Bunu ekle
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.posterContainer} onPress={() => openModal(item)}>
              <Image source={{ uri: item.poster }} style={styles.poster} />
              <View style={{ flex: 1 }}>
                <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.imdbScore}>
                  IMDb: {item.rating.toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        {!loading && !isActorSearch && filteredMovies.length === 0 && (
  <Text style={{color:'#fff', textAlign:'center', marginTop:40}}>Film bulunamadı.</Text>
)}
{!loading && isActorSearch && actorSearchResults.length === 0 && (
  <Text style={{color:'#fff', textAlign:'center', marginTop:40}}>Oyuncunun filmi bulunamadı.</Text>
)}

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedMovie && (
                <>
                  <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                  <Image source={{ uri: selectedMovie.poster }} style={styles.modalPoster} />
                  <ScrollView
                    style={{
                      maxHeight: 350,
                      marginBottom: 16,
                      backgroundColor: '#181818',
                      borderRadius: 8,
                      padding: 10,
                    }}
                    showsVerticalScrollIndicator={true}
                  >
                    <Text style={styles.modalOverview}>{selectedMovie.overview}</Text>
                  </ScrollView>
                  {selectedMovie.trailer && (
                    <TouchableOpacity
                      style={styles.trailerButton}
                      onPress={() => openTrailer(selectedMovie.trailer!)}
                    >
                      <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                    </TouchableOpacity>
                  )}
                  {cast.length > 0 && (
                    <View style={{ marginBottom: 16 }}>
                      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Oyuncular</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {cast.map(actor => (
                          <View key={actor.id} style={{ alignItems: 'center', marginRight: 12 }}>
                            <Image
                              source={{ uri: actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/80x120?text=No+Image' }}
                              style={{ width: 60, height: 90, borderRadius: 8, marginBottom: 4, backgroundColor: '#333' }}
                            />
                            <Text style={{ color: '#fff', fontSize: 13, textAlign: 'center', maxWidth: 70 }} numberOfLines={2}>{actor.name}</Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                  <Pressable onPress={closeModal} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#181818',
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 18,
    fontFamily: 'System',
  },
  listContent: {
    paddingHorizontal: 4,   // Daha az padding
    paddingBottom: 20,
  },
  posterContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#232323',
    borderRadius: 8,
    margin: 6,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    maxWidth: '48%',
    minWidth: 100,
    justifyContent: 'flex-start',
    // aspectRatio: 2/3, // BUNU KALDIR!
    // Kart yüksekliğini postere göre değil, içeriğe göre ayarlıyoruz.
  },
  poster: {
    width: '100%',
    aspectRatio: 2/3,         // Sadece fotoğraf afiş oranında olsun
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    resizeMode: 'cover',
    backgroundColor: '#181818',
  },
  movieTitle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 15,
    marginBottom: 6,
    textAlign: 'center',   // <-- Bunu ekle
  },
  imdbScore: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',   // <-- Bunu ekle
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 16,
    width: '96%',         // Daha geniş modal
    maxHeight: 700,       // Daha yüksek modal
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPoster: {
    width: 150,           // Biraz daha küçük poster
    height: 225,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalOverview: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 0,      // 16 yerine 0 yap
    textAlign: 'justify',
  },
  trailerButton: {
    backgroundColor: '#e50914',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  trailerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  castTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  castContainer: {
    backgroundColor: '#181818',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  castMember: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 4,
  },
  noCastText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

async function fetchActorIdByName(name: string) {
  const res = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return data.results[0].id; // En uygun sonucu al
  }
  return null;
}

async function fetchMoviesByActorId(actorId: string) {
  const res = await fetch(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${API_KEY}`);
  const data = await res.json();
  return data.cast || [];
}
