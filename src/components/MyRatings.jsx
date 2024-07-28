import "../styles/MyAccount.css";
import "../styles/MyRatings.css";

export default function MyRatings() {
  return (
    <div className="my-account">
      <h2>My Ratings & Reviews</h2>

      <div className="my-ratings">
        <p>
          <b>You haven't rated anything yet</b>
        </p>
        <p>Your ratings and reviews will be saved here.</p>
      </div>
    </div>
  );
}
