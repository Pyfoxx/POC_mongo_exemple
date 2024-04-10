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

async function getMovie(db, idMovie, res) {
    const dbMovie = await db.collection(COLLECTION_NAME).findOne({ _id : new ObjectId(idMovie) });
  res.json({ status: 200, data: {movie: dbMovie} });
  //   responseBasedOnAcknowledgement(res, dbMovie);
}

async function putMovie(db, idMovie, movieData, res) {
    const putResult = await db.collection(COLLECTION_NAME).updateOne({ _id : new ObjectId(idMovie) }, {$set: movieData });
    responseBasedOnAcknowledgement(res, putResult);
}

async function deleteMovie(db, idMovie, res) {
    const deleteResult = await db.collection(COLLECTION_NAME).deleteOne({ _id : new ObjectId(idMovie) });
    responseBasedOnAcknowledgement(res, deleteResult);
}

async function responseBasedOnAcknowledgement(res, operationResult, successData) {
    if (operationResult.acknowledged !== true) {
        res.status(500).json(ERROR_RESPONSE);
    } else {
        res.json({...SUCCESS_RESPONSE, data: successData});
    }
}
