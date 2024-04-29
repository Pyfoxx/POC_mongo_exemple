import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

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
 *  put:
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
 **/
export default async function handler(req, res) {
  const idMovie = req.query.id
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  if (req.method.toLowerCase() !== 'get' && req.method.toLowerCase() !== 'del'){
      const movieData = req.body;
  }
  switch (req.method.toLowerCase()) {
    case "get":
      getMovie(db, idMovie, res)
      break;
    case "put":
      putMovie(db, idMovie, movieData, res);
      break;
    case "delete":
      deleteMovie(db, idMovie, res);
      break;
  }

}

/**
 * Retrieves a movie from the database based on the given movie id.
 *
 * @param {Object} db - The database connection.
 * @param {string} idMovie - The ID of the movie to retrieve.
 * @param {Object} res - The response object to send the data.
 *
 * @return {Object} - The response object with the retrieved movie data.
 */
async function getMovie(db, idMovie, res) {
    const dbMovie = await db.collection("movies").findOne({ _id : new ObjectId(idMovie) });
  res.json({ status: 200, data: {movie: dbMovie} });
  //   responseBasedOnAcknowledgement(res, dbMovie);
}

/**
 * Updates a movie in the database.
 *
 * @param {Object} db - The database object.
 * @param {string} idMovie - The ID of the movie to update.
 * @param {Object} movieData - The data to update the movie with.
 * @param {Object} res - The HTTP response object.
 * @return {void}
 */
async function putMovie(db, idMovie, movieData, res) {
    const putResult = await db.collection(COLLECTION_NAME).updateOne({ _id : new ObjectId(idMovie) }, {$set: movieData });
    responseBasedOnAcknowledgement(res, putResult);
}

/**
 * Deletes a movie from the database.
 *
 * @param {Object} db - The database connection object.
 * @param {string} idMovie - The ID of the movie to delete.
 * @param {Object} res - The response object to send the result to.
 * @return {Promise<void>} - A promise that resolves when the movie is deleted.
 */
async function deleteMovie(db, idMovie, res) {
    const deleteResult = await db.collection(COLLECTION_NAME).deleteOne({ _id : new ObjectId(idMovie) });
    responseBasedOnAcknowledgement(res, deleteResult);
}

/**
 * Responds based on the acknowledgment of the operation result.
 * If the operation is not acknowledged, it sends a 500 error response.
 * If the operation is acknowledged, it sends a success response with additional success data.
 *
 * @param {object} res - The response object to send the response.
 * @param {object} operationResult - The result of the operation.
 * @param {object} successData - Additional data to be included in the success response.
 *
 * @return {void}
 */
async function responseBasedOnAcknowledgement(res, operationResult, successData) {
    if (operationResult.acknowledged !== true) {
        res.status(500).json(ERROR_RESPONSE);
    } else {
        res.json({...SUCCESS_RESPONSE, data: successData});
    }
}
