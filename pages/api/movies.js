// export default
import clientPromise from "../../lib/mongodb";

const DB_NAME = "sample_mflix";
const COLLECTION_NAME = "movies";
const LIMIT = 10;

const ERROR_RESPONSE = {
    status: 500,
    /**
     * Function to perform movie data operation.
     *
     * @param {string} movieTitle - The title of the movie.
     * @returns {void}
     * @throws {Error} When movie data operation fails.
     */
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
 * Retrieves a list of movies from the database and sends the response with the movies' data.
 *
 * @param {Object} db - The database instance.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the response is sent.
 */
async function getMovies(db, res) {
    const movies = await db.collection(COLLECTION_NAME).find({}).limit(LIMIT).toArray();
    res.json({...SUCCESS_RESPONSE, data: movies});
}

/**
     * Inserts a movie data into the specified collection in the database.
     *
     * @async
     * @function insertResult
     * @param {Object} movieData - The movie data to be inserted as an object.
     * @returns {Promise<Object>} - A promise that resolves to the result of the insert operation.
     * @throws {Error} - If an error occurs while inserting the data.
*/
async function postMovie(db, idMovie, movieData, res) {
    const insertResult = await db.collection(COLLECTION_NAME).insertOne(movieData);
    console.log(insertResult)
    responseBasedOnAcknowledgement(res, insertResult);
}


/**
 * Generates response based on acknowledgement of operation result.
 * If operation result is acknowledged, success response with data will be sent.
 * If operation result is not acknowledged, error response will be sent.
 *
 * @param {Object} res - The response object of the HTTP request.
 * @param {Object} operationResult - The result of the operation to be acknowledged.
 * @param {Object} successData - The data to be included in the success response.
 *
 * @return {Promise} - A promise that will be resolved with the response sent.
 */
async function responseBasedOnAcknowledgement(res, operationResult, successData) {
    if (operationResult.acknowledged !== true) {
        res.status(500).json(ERROR_RESPONSE);
    } else {
        res.json({...SUCCESS_RESPONSE, data: successData});
    }
}
