function normalizeResource(value) {
  return String(value || '').trim().toLowerCase();
}

export function hasScheduleConflict(lectures, candidate) {
  return lectures.some(lecture => {
    if (
      String(lecture._id || lecture.id || '') === String(candidate._id || candidate.id || '') ||
      lecture.day !== candidate.day ||
      lecture.start >= candidate.end ||
      lecture.end <= candidate.start
    ) return false;

    const sameRoom = normalizeResource(lecture.room) && normalizeResource(lecture.room) === normalizeResource(candidate.room);
    const sameBatch = normalizeResource(lecture.batch) && normalizeResource(lecture.batch) === normalizeResource(candidate.batch);
    const lecturer = normalizeResource(lecture.lecturer);
    const sameLecturer = lecturer && lecturer !== 'unassigned lecturer' && lecturer === normalizeResource(candidate.lecturer);
    return sameRoom || sameBatch || sameLecturer;
  });
}
