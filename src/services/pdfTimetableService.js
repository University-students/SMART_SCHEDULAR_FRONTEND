import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const COLORS = ['violet', 'blue', 'orange', 'mint', 'pink'];
const KNOWN_COURSES = {
  'SWT 22012': 'Internet Application Development',
  'CIS 22012': 'Distributed and Cloud Computing',
  'CIS 22022': 'Information Assurance and Forensics',
  'CIS 22032': 'E-commerce Strategies and Architecture',
  'UCT 22011': 'Microcontroller System Programming',
  'CMS 22012': 'Leadership & Communication Skills',
  'SWT 22022': 'Practical for Internet Application Development',
  'CIS 22042': 'Practical for Distributed and Cloud Computing',
  'UCT 22022': 'Practical for Microcontroller System Programming',
};

function groupTextItems(items) {
  const lines = [];
  const sorted = items
    .filter(item => item.str?.trim() && item.transform)
    .map(item => ({
      text: item.str.trim(),
      x: item.transform[4],
      y: item.transform[5],
      width: item.width || 0,
    }))
    .sort((a, b) => b.y - a.y || a.x - b.x);

  sorted.forEach(item => {
    let line = lines.find(candidate => Math.abs(candidate.y - item.y) <= 2.5);
    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }
    line.items.push(item);
  });

  return lines
    .map(line => ({
      y: line.y,
      items: line.items.sort((a, b) => a.x - b.x),
      text: line.items.sort((a, b) => a.x - b.x).map(item => item.text).join(' '),
    }))
    .sort((a, b) => b.y - a.y);
}

function normalizeCode(value) {
  const match = value.match(/\b([A-Z]{2,5})\s*(\d{4,5})\b/i);
  return match ? `${match[1].toUpperCase()} ${match[2]}` : null;
}

function parseTime(value) {
  const match = value.match(/(\d{1,2})[.:](\d{2})/);
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour >= 1 && hour <= 5) hour += 12;
  if (![0, 30].includes(minute)) return null;
  return hour + minute / 60;
}

function getTimeRange(value) {
  const match = value.match(/(\d{1,2}[.:]\d{2})\s*[-–]\s*(\d{1,2}[.:]\d{2})/);
  if (!match) return null;
  const start = parseTime(match[1]);
  let end = parseTime(match[2]);
  if (start === null || end === null) return null;
  if (end <= start) end += 12;
  return { start, end };
}

function getColumnText(line, columnCenters) {
  const columns = columnCenters.map(() => []);
  line.items.forEach(item => {
    const center = item.x + item.width / 2;
    let closest = 0;
    columnCenters.forEach((column, index) => {
      if (Math.abs(center - column) < Math.abs(center - columnCenters[closest])) closest = index;
    });
    columns[closest].push(item);
  });
  return columns.map(column => column.sort((a, b) => a.x - b.x).map(item => item.text).join(' '));
}

function buildLecturerMap(lines) {
  const lecturers = new Map();
  lines.forEach(({ text }) => {
    const match = text.match(/^\s*\d+\s+([A-Z]{2,5})\s*(\d{4,5})\s+(.+?)\s*$/i);
    if (!match) return;
    const code = `${match[1].toUpperCase()} ${match[2]}`;
    const name = match[3].replace(/\s+/g, ' ').trim();
    if (name && !/^(?:CODE|LECTURER|IN-CHARGE)/i.test(name)) lecturers.set(code, name);
  });
  return lecturers;
}

function extractSchedule(lines, lecturers) {
  const header = lines.find(line => {
    const text = line.text.toLowerCase();
    return text.includes('time') && DAYS.every(day => text.includes(day.toLowerCase()));
  });
  if (!header) {
    throw new Error('Could not find a timetable header with Time and Monday-to-Friday columns.');
  }

  const headerCenters = [];
  const timeItem = header.items.find(item => /^time$/i.test(item.text));
  if (!timeItem) throw new Error('Could not identify the timetable time column.');
  headerCenters.push(timeItem.x + timeItem.width / 2);

  DAYS.forEach(day => {
    const dayItem = header.items.find(item => item.text.toLowerCase() === day.toLowerCase());
    if (!dayItem) throw new Error(`Could not identify the ${day} column in the timetable.`);
    headerCenters.push(dayItem.x + dayItem.width / 2);
  });

  const schedule = [];
  const allItems = lines.flatMap(line => line.items);
  const timeRows = allItems
    .filter(item => item.y < header.y && getTimeRange(item.text))
    .map(timeItem => ({
      range: getTimeRange(timeItem.text),
      cells: getColumnText({
        items: allItems.filter(item => Math.abs(item.y - timeItem.y) <= 30),
      }, headerCenters),
    }));

  timeRows.forEach(({ range, cells }) => {
    DAYS.forEach((day, dayIndex) => {
      const cell = cells[dayIndex + 1];
      const code = normalizeCode(cell);
      if (!code) return;
      const lecturer = lecturers.get(code);
      if (!lecturer) {
        throw new Error(`No lecturer was found for ${code}. The PDF must include a code-to-lecturer list.`);
      }
      const room = cell.match(/\(([^)]+)\)/)?.[1]?.trim() || 'Unassigned room';
      schedule.push({
        day: dayIndex,
        start: range.start,
        end: range.end,
        code,
        title: KNOWN_COURSES[code] || code,
        lecturer,
        room,
        batch: 'ICT 22',
        color: COLORS[schedule.length % COLORS.length],
      });
    });
  });

  if (!schedule.length) {
    throw new Error('No scheduled course cells were found. Check that the PDF contains a text-based weekday timetable.');
  }

  return schedule;
}

function mergeConsecutiveLectures(lectures) {
  return lectures
    .sort((a, b) => a.day - b.day || a.start - b.start)
    .reduce((merged, lecture) => {
      const previous = merged.at(-1);
      if (
        previous &&
        previous.day === lecture.day &&
        previous.end === lecture.start &&
        previous.code === lecture.code &&
        previous.lecturer === lecture.lecturer &&
        previous.room === lecture.room
      ) {
        previous.end = lecture.end;
      } else {
        merged.push({ ...lecture, id: `${lecture.day}-${lecture.start}-${lecture.code}-${merged.length}` });
      }
      return merged;
    }, []);
}

export async function parseLecturerTimetablePdf(file) {
  if (!file || !/\.pdf$/i.test(file.name)) {
    throw new Error('Choose a PDF file to import.');
  }
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('The PDF is larger than 15 MB. Choose a smaller file.');
  }

  const data = new Uint8Array(await file.arrayBuffer());
  if (new TextDecoder().decode(data.subarray(0, 5)) !== '%PDF-') {
    throw new Error('This file is not a valid PDF.');
  }

  const loadingTask = pdfjsLib.getDocument({ data });
  let pdf;
  try {
    pdf = await loadingTask.promise;
    if (pdf.numPages > 30) throw new Error('The PDF has more than 30 pages. Please upload a smaller timetable document.');

    const lines = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      lines.push(...groupTextItems(content.items));
    }

    const lecturers = buildLecturerMap(lines);
    if (!lecturers.size) {
      throw new Error('Could not find a lecturer list keyed by course code in this PDF.');
    }
    return mergeConsecutiveLectures(extractSchedule(lines, lecturers));
  } finally {
    if (pdf) await pdf.destroy();
    else await loadingTask.destroy();
  }
}
