interface CommentModel {
  _id: { $oid: string };
  name: string;
  email: string;
  movie_id: { $oid: string };
  text: string;
  date: { $date: { $numberLong: string } };
}

export default CommentModel;