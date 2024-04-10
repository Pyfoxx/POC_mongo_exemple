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

async function getComment(db, idMovie, res) {
    console.log(idMovie)
    const dbMovie = await db.collection(COLLECTION_NAME).find({ movie_id: new ObjectId(idMovie) }).limit(20).toArray();
  res.json({ status: 200, data: {comments: dbMovie} });
    // responseBasedOnAcknowledgement(res, dbMovie);
}

async function postComment(db, idMovie, CommentData, res) {
    const insertResult = await db.collection(COLLECTION_NAME).insertOne(CommentData);
    console.log(insertResult)
    responseBasedOnAcknowledgement(res, insertResult);
}

async function putComment(db, idMovie, CommentData, res) {
    const putResult = await db.collection(COLLECTION_NAME).updateOne(CommentData);
    responseBasedOnAcknowledgement(res, putResult);
}

async function deleteComment(db, idMovie, res) {
    const deleteResult = await db.collection(COLLECTION_NAME).deleteOne(idMovie);
    responseBasedOnAcknowledgement(res, deleteResult);
}