import clientPromise from "../../../../lib/mongodb";
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

export default async function handler(req, res) {
  const idMovie = req.query.id
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  switch (req.method.toLowerCase()) {
    case "get":
      getComment(db, idMovie, res)
          break;
  }

}

/**
 * Retrieves and returns the comments for a specific movie.
 *
 * @param {Object} db - The database connection object.
 * @param {string} idMovie - The movie id for which comments are requested.
 * @param {Object} res - The response object to send the comments data.
 * @return {Object} - The response object with status and comments data.
 */
async function getComment(db, idMovie, res) {
    console.log(idMovie)
    const dbMovie = await db.collection(COLLECTION_NAME).find({ movie_id: new ObjectId(idMovie) }).limit(20).toArray();
  res.json({ status: 200, data: {comments: dbMovie} });
    // responseBasedOnAcknowledgement(res, dbMovie);
}

/**
 * Async function to post a comment in the database.
 * @param {Object} db - The database object.
 * @param {string} idMovie - The id of the movie.
 * @param {Object} CommentData - The comment data to be inserted.
 * @param {Object} res - The response object.
 * @return {void}
 */
async function postComment(db, idMovie, CommentData, res) {
    const insertResult = await db.collection(COLLECTION_NAME).insertOne(CommentData);
    console.log(insertResult)
    responseBasedOnAcknowledgement(res, insertResult);
}

/**
 * Updates a comment in the database.
 *
 * @param {Db} db - The database object.
 * @param {string} idMovie - The ID of the movie associated with the comment.
 * @param {object} CommentData - The updated comment data.
 * @param {Response} res - The response object to send back to the client.
 *
 * @return {Promise<void>} - A Promise that resolves when the comment is updated successfully.
 */
async function putComment(db, idMovie, CommentData, res) {
    const putResult = await db.collection(COLLECTION_NAME).updateOne(CommentData);
    responseBasedOnAcknowledgement(res, putResult);
}

/**
 * Deletes a comment from the database.
 *
 * @param {Object} db - The database connection object.
 * @param {string} idMovie - The ID of the movie to delete the comment from.
 * @param {Object} res - The response object to send the acknowledgement to.
 *
 * @return {Promise} - A promise that resolves with the acknowledgement.
 */
async function deleteComment(db, idMovie, res) {
    const deleteResult = await db.collection(COLLECTION_NAME).deleteOne(idMovie);
    responseBasedOnAcknowledgement(res, deleteResult);
}