import ReactPlayer from "react-player";

export default function MoviePreview({ className, playerClassName, selectedMovie }) {
  return (
    <div className={className}>
      <ReactPlayer
        url={selectedMovie?.trailers?.[0]}
        controls={true}
        width="100%"
        height="100%"
        className={playerClassName}
      />
    </div>
  );
}
