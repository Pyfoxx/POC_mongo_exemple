import React, {useEffect, useState} from 'react';
import MovieModel from "../../models/movie";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography} from '@mui/material';




const HomePage = () => {
    useEffect(() => {
    document.title = 'GG EZ noraj';
  }, []);


    const [moviesList, setMoviesList] = useState<MovieModel[]>([]);
    const handleDelete = async (movieId: string) => {
        try {
            const response = await fetch(`/api/movies/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as necessary
                },
            });

            if (response.ok) {
                setMoviesList(moviesList.filter(movie => movie._id !== movieId));
                console.log("Delete successful");
            } else {
                console.error('Delete failed:', response.status);
            }
        } catch (error) {
            console.error('Error making the DELETE request:', error);
        }
    };

    useEffect(() => {
        fetch('/api/movies')
            .then(response => response.json())
            .then(data => setMoviesList(data.data));
        console.log(moviesList);
    }, []);

    return (
        <div>
            <ul>
                {/*{moviesList.map((movie, index) => <a href={"/api/movies/" + movie._id}><div><img src={movie.poster}/></div></a>)}*/}
                {moviesList.map((movie, index) =>
                    <li key={movie._id} style={{listStyleType: "none", margin: "20px 0"}}>
                        <Card>
                            <CardActionArea>
                                <a href={"/movies/" + movie._id}>
                                    <CardMedia component="img" height="140" image={movie.poster} alt={movie.title}/>
                                </a>
                                <CardContent>
                                    <Typography variant='h6' noWrap gutterBottom>
                                        {movie.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {movie.fullplot}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handleDelete(movie._id)}>
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </li>
                )}
            </ul>
        </div>
    );
};


export default HomePage;