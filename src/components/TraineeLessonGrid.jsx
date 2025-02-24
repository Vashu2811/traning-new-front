import React from 'react';
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import ProgressBar from "components/ProgressBar";

const TraineeLessonGrid = ({
  lessons,
  courseId,
  moduleId,
  isLoading,
  lessonType,
  containerClassName = "grid gap-6 overflow-x-auto 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1"
}) => {
  const renderVideoFrame = (url) => {
    if (!url) {
      return (
        <div
          className="loading-spinner flex items-center justify-center"
          style={{
            width: "100%",
            height: "170px",
            backgroundColor: "#000000",
            animation: "loading 2s infinite linear",
          }}
        >
          <TailSpin color="#c5c6c7" height={40} width={40} />
        </div>
      );
    }

    const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
    const videoUrl = isYoutube
      ? `https://www.youtube.com/embed/${url.split("v=")[1]?.split("&")[0] || url.split("/").pop()}`
      : url;

    return (
      <div className="">
        <iframe
          title={isYoutube ? "YouTube Video" : "Video"}
          width="100%"
          height="170"
          src={videoUrl}
          frameBorder="0"
          allow={isYoutube ? "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" : "fullscreen"}
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="mx-12 mt-4 text-center">
        <TailSpin
          color="#FFFFFF"
          height={20}
          width={20}
          style={{ margin: "10px 10px" }}
        />
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return <div className="text-white">No Lessons available</div>;
  }

  return (
    <div className={containerClassName}>
      {lessons
        .sort((a, b) => a.lesson_number - b.lesson_number)
        .map((lesson) => (
          <div
            key={lesson.id}
            className="bg-[#242728] border border-[#303234] overflow-hidden rounded-md gap-3"
          >
            <Link
              to={`/training/courses/${courseId}/module/${moduleId}/lesson/${lesson.id}`}
              state={{type: lessonType?.type || ''}}
              style={{ textDecoration: "none" }}
            >
              {renderVideoFrame(lesson.url)}
              {lessonType?.type !== 'shorts' &&
                <div className="my-2.5 p-2">
                  <ProgressBar percentage={lesson.progress || 0} />
                </div>
              }
              <h2 className="flex align-middle justify-start my-2.5 text-lg font-normal px-4 text-white">
                {lesson.title}
              </h2>
              <p className="px-4 opacity-50 my-2.5 text-white line-clamp-2">
                {lesson.lesson_description}
              </p>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default TraineeLessonGrid;