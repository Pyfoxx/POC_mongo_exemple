import React, { useEffect, useState } from 'react';
import MovieModel from "../../models/movie";
import CommentModel from "../../models/comments";
import TopBar from "../../../test/src/components/TopBar";
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';



const HoverImage = styled(Paper)(({ theme }) => ({
  overflow: 'hidden',
  cursor: 'pointer',
  '& img': {
    transition: 'transform 0.3s ease-in-out',
    width: '100%',
    height: 'auto'
  }
}));



const HomePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [movie, setMovie] = useState<MovieModel | null>(null);
    const [comments, setComments] = useState<CommentModel | null>(null);
    const [style, setStyle] = useState({});
    const [transformOrigin, setTransformOrigin] = useState('center center');


    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - left) / width) * 100;
        const y = ((event.clientY - top) / height) * 100;
        setTransformOrigin(`${x}% ${y}%`);
    };

    const handleMouseLeave = () => {
        setTransformOrigin('center center');
    };

    useEffect(() => {
        if (id) {
            fetch(`/api/movies/${id}`)
                .then(response => response.json())
                .then(data => setMovie(data.data.movie));
        }
    }, [id]);
    useEffect(() => {
        if (id) {
            fetch(`/api/comments/${id}`)
                .then(response => response.json())
                .then(data => setComments(data.data))
        }
    }, [id]);

    return (
        <Grid container spacing={2}>
            {movie ? (
                <Grid item xs={12} container>
                    <Grid item md={4} xs={12}>
                        <HoverImage onMouseMove={handleMouseMove} onMouseLeave={() => setStyle({})}>
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                style={style}
                            />
                        </HoverImage>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Card>
                            <CardContent>
                                <Typography gutterBottom variant="h4" component="div">
                                    {movie.title} ({movie.year})
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {movie.fullplot}
                                </Typography>
                                <Box mt={2}>
                                    <Typography variant="body2">
                                        Director(s): {movie.directors.join(', ')}
                                    </Typography>
                                    <Typography variant="body2">
                                        Cast: {movie.cast.join(', ')}
                                    </Typography>
                                    <Typography variant="body2">
                                        Genres: {movie.genres.join(', ')}
                                    </Typography>
                                    <Typography variant="body2">
                                        Languages: {movie.languages?
                                                `${movie.languages.join(', ')}% (languages)` : 'N/A (languages)'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Released: {movie.released}
                                    </Typography>
                                    <Typography variant="body2">
                                        Runtime: {movie.runtime} minutes
                                    </Typography>
                                    <Typography variant="body2">
                                        Rated: {movie.rated}
                                    </Typography>
                                    <Typography variant="body2">
                                        IMDb Rating: {movie.imdb.rating} ({movie.imdb.votes} votes)
                                    </Typography>
                                    <Typography variant="body2">

                                        <Typography variant="body2">
                                            Tomatometer:
                                            {movie.tomatoes.critic?.meter ?
                                                `${movie.tomatoes.critic.meter}% (Critic)` : 'N/A (Critic)'}
                                            , {movie.tomatoes.viewer?.meter ?
                                                `${movie.tomatoes.viewer.meter}% (Viewer)` : 'N/A (Viewer)'}
                                        </Typography>
                                    </Typography>
                                    <Typography variant="body2">
                                        Awards: {movie.awards.text} (Wins: {movie.awards.wins}, Nominations: {movie.awards.nominations})
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                        {comments?(
                            <Card>
                                <CardContent>
                                    <Typography variant="body2">
                                        {comments.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ):(
                            <Grid item xs={12}>
                                <Typography variant="h5">Loading...</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            ) : (
                <Grid item xs={12}>
                    <Typography variant="h5">Loading...</Typography>
                </Grid>
            )}
        </Grid>
    );
};

export default HomePage;
