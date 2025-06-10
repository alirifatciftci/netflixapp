import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ImageBackground, Linking, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
    };
    fetchAll();
  }, []);

  // Arama filtresi
  const filteredMovies = movies.filter(movie =>
    (selectedGenre === 'All' || movie.genre === selectedGenre) &&
    movie.title.toLowerCase().includes(search.toLowerCase())
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

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setModalVisible(false);
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
          placeholder="Search movies..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          ref={flatListRef}
          data={filteredMovies}
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

        {/* Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {selectedMovie && (
                <>
                  <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                  <Image source={{ uri: selectedMovie.poster }} style={styles.modalPoster} />
                  <Text style={styles.modalOverview}>{selectedMovie.overview}</Text>
                  {selectedMovie.trailer && (
                    <TouchableOpacity
                      style={styles.trailerButton}
                      onPress={() => openTrailer(selectedMovie.trailer!)}
                    >
                      <Text style={styles.trailerButtonText}>Watch Trailer</Text>
                    </TouchableOpacity>
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
    width: '85%',         // Daha dar modal
    maxHeight: 340,       // Daha kısa modal
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPoster: {
    width: 180,           // Daha küçük poster
    height: 270,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalOverview: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'justify',
    maxHeight: 80,        // Daha kısa özet alanı
    overflow: 'scroll',
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
});
