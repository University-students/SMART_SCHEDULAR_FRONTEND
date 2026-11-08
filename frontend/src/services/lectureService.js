import { apiRequest } from './api';

export async function getLectures() {
  const { data } = await apiRequest('/classes');
  return data;
}

export async function saveLectures(lectures) {
  const payload = lectures.map(({ id, ...lecture }) => lecture);
  const { data, meta } = await apiRequest('/schedule/replace', {
    method: 'PUT',
    body: JSON.stringify({ lectures: payload }),
  });
  return { lectures: data, meta };
}
