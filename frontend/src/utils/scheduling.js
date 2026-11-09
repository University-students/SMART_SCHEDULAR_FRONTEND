const RESOURCE_FIELDS = ['room', 'lecturer', 'batch'];

function isSameResource(field, left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;

  const first = left.trim().toLowerCase();
  const second = right.trim().toLowerCase();
  if (
    !first ||
    !second ||
    (field === 'lecturer' && (first === 'unassigned lecturer' || second === 'unassigned lecturer'))
  ) return false;

  return first === second;
}

export function findScheduleConflicts(lectures, candidate) {
  return lectures.filter((lecture) => {
    const lectureId = String(lecture.id ?? lecture._id ?? '');
    const candidateId = String(candidate.id ?? candidate._id ?? '');
    if (lectureId && lectureId === candidateId) return false;
    if (lecture.day !== candidate.day || lecture.start >= candidate.end || lecture.end <= candidate.start) {
      return false;
    }

    return RESOURCE_FIELDS.some((field) => isSameResource(field, lecture[field], candidate[field]));
  });
}

export function countScheduleConflicts(lectures) {
  return lectures.reduce(
    (count, lecture, index) => count + findScheduleConflicts(lectures.slice(index + 1), lecture).length,
    0
  );
}
