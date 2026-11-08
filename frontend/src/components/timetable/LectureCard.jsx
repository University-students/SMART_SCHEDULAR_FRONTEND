import React from 'react';
export default function LectureCard({ lecture = {} }) {
  return <article><strong>{lecture.code ?? lecture.title ?? 'Lecture'}</strong>{lecture.title && lecture.code && <p>{lecture.title}</p>}{lecture.lecturer && <small>{lecture.lecturer}</small>}</article>;
}
