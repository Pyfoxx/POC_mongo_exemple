// export default
import clientPromise from "../../lib/mongodb";

const DB_NAME = "sample_mflix";
const COLLECTION_NAME = "comments";
const LIMIT = 10;

const ERROR_RESPONSE = {
    status: 500,
    error: 'Movie data operation failed'
};

const SUCCESS_RESPONSE = {
    status: 200
};
/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Returns movies
 *     responses:
 *       200:
 *         description: Hello Movies
 *   post:
 *     description: insert movies in the DB
 *     parameters:
 *         - id: query
 *           name: id
 *           type: integer
 *           description: The id of the movie targeted
 *     responses:
 *       200:
 *         description: Hello Movies
 *       400:
 *          description: no movie data was given to the api
 */
export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    let movieData = req.body;

    if (!movieData && req.method.toLowerCase() !== "get") {
        res.status(400).json({status: 400, error: 'No movie data provided'});
        return;
    }

    switch (req.method.toLowerCase()) {
        case "get":
            getMovies(db, res);
            break;
        case "post":
          postMovie(db, idMovie, movieData, res);
          break;
    }
}

/**
 * Retrieves a list of movies from the database and sends a JSON response.
 *
 * @param {Object} db - The database object.
 * @param {Object} res - The response object.
 * @return {void}
 *
 * @example
 * getMovies(db, res);
 */
async function getMovies(db, res) {
    const movies = await db.collection(COLLECTION_NAME).find({}).limit(LIMIT).toArray();
    res.json({...SUCCESS_RESPONSE, data: movies});
}

/**
 * Save movie data to the database.
 *
 * @param {Object} db - The database connection object.
 * @param {number} idMovie - The ID of the movie.
 * @param {Object} movieData - The movie data to be inserted.
 * @param {Object} res - The response object.
 * @return {void} - It does not return anything.
 */
async function postMovie(db, idMovie, movieData, res) {
    const insertResult = await db.collection(COLLECTION_NAME).insertOne(movieData);
    console.log(insertResult)
    responseBasedOnAcknowledgement(res, insertResult);
}


async function responseBasedOnAcknowledgement(res, operationResult, successData) {
    if (operationResult.acknowledged !== true) {
        res.status(500).json(ERROR_RESPONSE);
    } else {
        res.json({...SUCCESS_RESPONSE, data: successData});
    }
}
