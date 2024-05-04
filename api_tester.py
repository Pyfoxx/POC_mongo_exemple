
import requests

def get_movie():
    url = 'http://127.0.0.1:3000/api/movies'
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

movie = get_movie()
print(movie)