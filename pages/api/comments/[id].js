import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

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
 * Retrieves a movie from the database.
 *
 * @param {Object} db - The database object.
 * @param {string} idMovie - The ID of the movie to retrieve.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves without any value.
 */
async function getMovie(db, idMovie, res) {
    const dbMovie = await db.collection(COLLECTION_NAME).findOne({ _id : new ObjectId(idMovie) });
  res.json({ status: 200, data: {movie: dbMovie} });
  //   responseBasedOnAcknowledgement(res, dbMovie);
}

/**
 * Updates a movie in the database.
 *
 * @param {Object} db - The database object.
 * @param {string} idMovie - The ID of the movie to update.
 * @param {Object} movieData - The updated movie data.
 * @param {Object} res - The response object.
 * @returns {undefined}
 */
async function putMovie(db, idMovie, movieData, res) {
    const putResult = await db.collection(COLLECTION_NAME).updateOne({ _id : new ObjectId(idMovie) }, {$set: movieData });
    responseBasedOnAcknowledgement(res, putResult);
}

/**
 * Deletes a movie from the specified MongoDB collection.
 *
 * @param {MongoClient} db - The MongoDB client to use for database operations.
 * @param {string} idMovie - The ID of the movie to delete.
 * @param {object} res - The response object to send the result to.
 * @return {Promise<void>} - A promise that resolves when the movie is successfully deleted.
 */
async function deleteMovie(db, idMovie, res) {
    const deleteResult = await db.collection(COLLECTION_NAME).deleteOne({ _id : new ObjectId(idMovie) });
    responseBasedOnAcknowledgement(res, deleteResult);
}

/**
 * Generates the response based on the acknowledgement result.
 * @param {object} res - The response object.
 * @param {object} operationResult - The result of the operation.
 * @param {object} successData - The success data to be included in the response.
 * @return {Promise} - A Promise that resolves with the response.
 */
async function responseBasedOnAcknowledgement(res, operationResult, successData) {
    if (operationResult.acknowledged !== true) {
        res.status(500).json(ERROR_RESPONSE);
    } else {
        res.json({...SUCCESS_RESPONSE, data: successData});
    }
}
