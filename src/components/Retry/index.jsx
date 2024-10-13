const FailureView = ({ onRetry }) => (
  <div className="failure-container loader-height">
    <div>
      <img
        className="alert-icon"
        src="https://res.cloudinary.com/davv8r8v4/image/upload/v1725555794/spoyifyRemix/nlujog8xruvrsqbq7rgv.png"
      />
      <p>Something went wrong. Please try again</p>
      <button className="try-again-button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  </div>
);

export default FailureView;
