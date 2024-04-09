// export default
import clientPromise from "../../lib/mongodb";

const DB_NAME = "sample_mflix";
const COLLECTION_NAME = "movies";
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
 *   put:
 *     description: modify movies entry
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
 *   delete:
 *     description: delete movies entry
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
 *
 *
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
            postMovie(db, movieData, res);
            break;
        case "put":
            putMovie(db, movieData, res);
            break;
        case "delete":
            deleteMovie(db, movieData, res);
            break;
    }
}

async function getMovies(db, res) {
    const movies = await db.collection(COLLECTION_NAME).find({}).limit(LIMIT).toArray();
    res.json({...SUCCESS_RESPONSE, data: movies});
}

async function postMovie(db, movieData, res) {
    const insertResult = await db.collection(COLLECTION_NAME).insertOne(movieData);
    responseBasedOnAcknowledgement(res, insertResult, insertResult.ops[0]);
}

async function putMovie(db, movieData, res) {
    const putResult = await db.collection(COLLECTION_NAME).insertOne(movieData);
    responseBasedOnAcknowledgement(res, putResult, putResult.ops[0]);
}

async function deleteMovie(db, movieData, res) {
    const deleteResult = await db.collection(COLLECTION_NAME).deleteOne(movieData);
    responseBasedOnAcknowledgement(res, deleteResult, deleteResult.ops[0]);
}

async function responseBasedOnAcknowledgement(res, operationResult, successData) {
    if (operationResult.acknowledged !== 1) {
        res.status(500).json(ERROR_RESPONSE);
    } else {
        res.json({...SUCCESS_RESPONSE, data: successData});
    }
}
