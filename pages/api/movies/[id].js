import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const idMovie = req.query.id
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  const dbMovie = await db.collection("movies").findOne({ _id : new ObjectId(idMovie) });
  res.json({ status: 200, data: {movie: dbMovie} });
}