import sys
import os
from dotenv import load_dotenv
import lyricsgenius

a = sys.argv[1]
b = sys.argv[2]

# a = 'VERY ALONE'
# b = 'Zaia'

load_dotenv()

# Genius Client Token Here
TOKEN = os.getenv('GENIUS_SECRET')

defaults = {
    'request': {
        'token': TOKEN,
        'base_url': 'https://api.genius.com'
    },
    'message': {
        'search_fail': 'The lyrics for this song were not found!',
    }
}


def main():
    song_title = a
    artist_name = b
    
    genius = lyricsgenius.Genius(TOKEN)

    artist = genius.search_artist(artist_name, max_songs=0, sort="title")
    song = artist.song(song_title)

    output = song.lyrics.split("EmbedShare")

    
    print(output[0])
    sys.stdout.flush()


if __name__ == '__main__':
    main()