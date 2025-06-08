import React, { useState } from 'react';
import { FlatList, Image, ImageBackground, Linking, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
type Movie = {
  id: string;
  title: string;
  poster: string;
  overview: string;
  trailer?: string;
  genre: string;      // EKLENDİ
  rating: number;     // EKLENDİ
};

const POSTER_WIDTH = 110;
const POSTER_HEIGHT = 165;

const movies: Movie[] = [
  {
    id: '1',
    title: 'The Shawshank Redemption (1994)',
    poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    overview: 'Two imprisoned men bond over years, finding solace and eventual redemption through acts of common decency.',
    trailer: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    genre: 'Drama',
    rating: 9.3
  },
  {
    id: '2',
    title: 'The Godfather (1972)',
    poster: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    overview: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    trailer: 'https://www.youtube.com/watch?v=sY1S34973zA',
    genre: 'Crime',
    rating: 9.2
  },
  {
    id: '3',
    title: 'The Dark Knight (2008)',
    poster: 'https://image.tmdb.org/t/p/w500/1hRoyzDtpgMU7Dz4JF22RANzQO7.jpg',
    overview: 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.',
    trailer: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    genre: 'Action',
    rating: 9.0
  },
  {
    id: '4',
    title: 'The Godfather Part II (1974)',
    poster: 'https://image.tmdb.org/t/p/w500/amvmeQWheahG3StKwIE1f7jRnkZ.jpg',
    overview: 'The early life and career of Vito Corleone in 1920s New York is portrayed.',
    trailer: 'https://www.youtube.com/watch?v=9O1Iy9od7-A',
    genre: 'Crime',
    rating: 9.0
  },
  {
    id: '5',
    title: '12 Angry Men (1957)',
    poster: 'https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg',
    overview: 'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.',
    trailer: 'https://www.youtube.com/watch?v=fSG38tk6TpI',
    genre: 'Drama',
    rating: 9.0
  },
  {
    id: '6',
    title: "Schindler's List (1993)",
    poster: 'https://image.tmdb.org/t/p/w500/c8Ass7acuOe4za6DhSattE359gr.jpg',
    overview: 'In German-occupied Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce.',
    trailer: 'https://www.youtube.com/watch?v=gG22XNhtnoY',
    genre: 'Biography',
    rating: 8.9
  },
  {
    id: '7',
    title: 'The Lord of the Rings: The Return of the King (2003)',
    poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    overview: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam.',
    trailer: 'https://www.youtube.com/watch?v=r5X-hFf6Bwo',
    genre: 'Adventure',
    rating: 8.9
  },
  {
    id: '8',
    title: 'Pulp Fiction (1994)',
    poster: 'https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg',
    overview: 'The lives of two mob hitmen, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine.',
    trailer: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
    genre: 'Crime',
    rating: 8.9
  },
  {
    id: '9',
    title: 'The Lord of the Rings: The Fellowship of the Ring (2001)',
    poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    overview: 'A meek Hobbit and eight companions set out on a journey to destroy the One Ring.',
    trailer: 'https://www.youtube.com/watch?v=V75dMMIW2B4',
    genre: 'Adventure',
    rating: 8.8
  },
  {
    id: '10',
    title: 'The Good, the Bad and the Ugly (1966)',
    poster: 'https://image.tmdb.org/t/p/w500/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg',
    overview: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold.',
    trailer: 'https://www.youtube.com/watch?v=WCN5JJY_wiA',
    genre: 'Western',
    rating: 8.8
  },
  {
    id: '11',
    title: 'Forrest Gump (1994)',
    poster: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
    overview: 'The presidencies of Kennedy and Johnson, Vietnam, Watergate, and other history unfold through the perspective of an Alabama man.',
    trailer: 'https://www.youtube.com/watch?v=bLvqoHBptjg',
    genre: 'Drama',
    rating: 8.8
  },
  {
    id: '12',
    title: 'Fight Club (1999)',
    poster: 'https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg',
    overview: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.',
    trailer: 'https://www.youtube.com/watch?v=SUXWAEX2jlg',
    genre: 'Drama',
    rating: 8.8
  },
  {
    id: '13',
    title: 'Inception (2010)',
    poster: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
    trailer: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    genre: 'Sci-Fi',
    rating: 8.8
  },
  {
    id: '14',
    title: 'The Lord of the Rings: The Two Towers (2002)',
    poster: 'https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
    overview: 'While Frodo and Sam edge closer to Mordor, the divided fellowship makes a stand against Sauron\'s new ally, Saruman.',
    trailer: 'https://www.youtube.com/watch?v=LbfMDwc4azU',
    genre: 'Adventure',
    rating: 8.8
  },
  {
    id: '15',
    title: 'Star Wars: Episode V - The Empire Strikes Back (1980)',
    poster: 'https://image.tmdb.org/t/p/w500/7BuH8itoSrLExs2YZSsM01Qk2no.jpg',
    overview: 'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke begins Jedi training with Yoda.',
    trailer: 'https://www.youtube.com/watch?v=JNwNXF9Y6kY',
    genre: 'Sci-Fi',
    rating: 8.7
  },
  {
    id: '16',
    title: 'The Matrix (1999)',
    poster: 'https://m.media-amazon.com/images/I/51EG732BV3L._AC_SY679_.jpg',
    overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    trailer: 'https://www.youtube.com/watch?v=vKQi3bBA1y8',
    genre: 'Sci-Fi',
    rating: 8.7
  },
  {
    id: '17',
    title: 'Goodfellas (1990)',
    poster: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    overview: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
    trailer: 'https://www.youtube.com/watch?v=2ilzidi_J8Q',
    genre: 'Biography',
    rating: 8.7
  },
  {
    id: '18',
    title: 'One Flew Over the Cuckoo\'s Nest (1975)',
    poster: 'https://image.tmdb.org/t/p/w500/3jcbDmRFiQ83drXNOvRDeKHxS0C.jpg', // GÜNCELLENDİ
    overview: 'A criminal pleads insanity and is admitted to a mental institution, where he rebels against the oppressive nurse.',
    trailer: 'https://www.youtube.com/watch?v=OXrcDonY-B8',
    genre: 'Drama',
    rating: 8.6
  },
  {
    id: '19',
    title: 'Se7en (1995)',
    poster: 'https://image.tmdb.org/t/p/w500/6yoghtyTpznpBik8EngEmJskVUO.jpg',
    overview: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.',
    trailer: 'https://www.youtube.com/watch?v=znmZoVkCjpI',
    genre: 'Crime',
    rating: 8.6
  },
  {
    id: '20',
    title: 'Seven Samurai (1954)',
    poster: 'https://image.tmdb.org/t/p/w500/8OKmBV5BUFzmozIC3pPWKHy17kx.jpg',
    overview: 'A poor village under attack by bandits recruits seven unemployed samurai to help them defend themselves.',
    trailer: 'https://www.youtube.com/watch?v=7mw6LyyoeGE',
    genre: 'Adventure',
    rating: 8.6
  },
  {
    id: '21',
    title: 'It\'s a Wonderful Life (1946)',
    poster: 'https://www.themoviedb.org/t/p/w500/8rIoyM6zYXJNjzGseT3MRusMPWl.jpg', // DÜZELTİLDİ
    overview: 'An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed.',
    trailer: 'https://www.youtube.com/watch?v=8OFp3g6rksc',
    genre: 'Drama',
    rating: 8.6
  },
  {
    id: '22',
    title: 'The Silence of the Lambs (1991)',
    poster: 'https://image.tmdb.org/t/p/w500/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg',
    overview: 'A young F.B.I. cadet must confide in an incarcerated and manipulative killer to receive his help on catching another serial killer.',
    trailer: 'https://www.youtube.com/watch?v=W6Mm8Sbe__o',
    genre: 'Thriller',
    rating: 8.6
  },
  {
    id: '23',
    title: 'Interstellar (2014)',
  poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
  trailer: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
  genre: 'Sci-Fi',
  rating: 8.6
  },
  {
    id: '24',
    title: 'Saving Private Ryan (1998)',
    poster: 'https://www.themoviedb.org/t/p/w500/uqx37cS8cpHg8U35f9U5IBlrCV3.jpg', // DÜZELTİLDİ
    overview: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action.',
    trailer: 'https://www.youtube.com/watch?v=vwAxi4A6rzk',
    genre: 'War',
    rating: 8.6
  },
  {
    id: '25',
    title: 'Life Is Beautiful (1997)',
    poster: 'https://image.tmdb.org/t/p/w500/74hLDKjD5aGYOotO6esUVaeISa2.jpg',
    overview: 'When an open-minded Jewish librarian and his son become victims of the Holocaust, he uses a perfect mixture of will, humor and imagination to protect his son.',
    trailer: 'https://www.youtube.com/watch?v=pAYEQP8gx3w',
    genre: 'Comedy',
    rating: 8.6
  },
  {
    id: '26',
    title: 'The Green Mile (1999)',
    poster: 'https://image.tmdb.org/t/p/w500/sOHqdY1RnSn6kcfAHKu28jvTebE.jpg',
    overview: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
    trailer: 'https://www.youtube.com/watch?v=Ki4haFrqSrw',
    genre: 'Crime',
    rating: 8.6
  },
  {
    id: '27',
    title: 'Star Wars: Episode IV - A New Hope (1977)',
    poster: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg',
    overview: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station.',
    trailer: 'https://www.youtube.com/watch?v=vZ734NWnAHA',
    genre: 'Sci-Fi',
    rating: 8.6
  },
  {
    id: '28',
    title: 'Terminator 2: Judgment Day (1991)',
    poster: 'https://image.tmdb.org/t/p/w500/weVXMD5QBGeQil4HEATZqAkXeEc.jpg',
    overview: 'A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her teenage son from a more advanced and powerful cyborg.',
    trailer: 'https://www.youtube.com/watch?v=CRRlbK5w8AE',
    genre: 'Action',
    rating: 8.6
  },
  {
    id: '29',
    title: 'Back to the Future (1985)',
    poster: 'https://image.tmdb.org/t/p/w500/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
    overview: 'Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend.',
    trailer: 'https://www.youtube.com/watch?v=qvsgGtivCgs',
    genre: 'Adventure',
    rating: 8.5
  },
  {
    id: '30',
    title: 'Spirited Away (2001)',
    poster: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    trailer: 'https://www.youtube.com/watch?v=ByXuk9QqQkk',
    genre: 'Animation',
    rating: 8.6
  },
];
export default function HomePage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const genres = ['All', 'Drama', 'Action', 'Crime', 'Adventure', 'Sci-Fi', 'Comedy'];

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
              onPress={() => setSelectedGenre(genre)}
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
          data={filteredMovies}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.posterContainer} onPress={() => openModal(item)}>
              <Image source={{ uri: item.poster }} style={styles.poster} />
              <View style={{ flex: 1 }}>
                <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={{ color: '#FFD700', fontWeight: 'bold', fontSize: 15, marginTop: 2 }}>
                  IMDb: {item.rating}
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
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  posterContainer: {
    flexDirection: 'column', // Dikey hizala
    alignItems: 'center',    // Ortala
    backgroundColor: '#232323',
    borderRadius: 16,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    width: '95%',            // Kartı genişlet
    alignSelf: 'center',     // Ortala
  },
  poster: {
    width: POSTER_WIDTH + 60,
    height: POSTER_HEIGHT + 90,
    borderRadius: 12,
    marginRight: 18,
  },
  movieTitle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 15,
    marginBottom: 6,
  },
  imdbScore: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 17,
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
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPoster: {
    width: 180,
    height: 270,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalOverview: {
    color: '#ddd',
    fontSize: 16,
    marginBottom: 20,
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
});
