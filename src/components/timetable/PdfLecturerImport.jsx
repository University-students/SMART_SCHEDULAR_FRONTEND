import React, { useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileUp, Loader2, X } from 'lucide-react';
import { days, fmt } from '../../data';
import { parseLecturerTimetablePdf } from '../../services/pdfTimetableService';
import './pdfTimetableImport.css';

export function PdfLecturerImport({ onImport }) {
  const inputRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [isReading, setIsReading] = useState(false);

  const chooseFile = () => {
    setError('');
    inputRef.current?.click();
  };

  const readFile = async event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setFileName(file.name);
    setPreview([]);
    setError('');
    setIsReading(true);
    try {
      setPreview(await parseLecturerTimetablePdf(file));
      setExpanded(true);
    } catch (readError) {
      setError(readError.message || 'The timetable could not be read from this PDF.');
      setExpanded(true);
    } finally {
      setIsReading(false);
    }
  };

  const finishImport = replace => {
    try {
      onImport(preview, replace);
      setExpanded(false);
      setPreview([]);
      setFileName('');
      setError('');
    } catch (importError) {
      setError(importError.message || 'The timetable could not be imported.');
    }
  };

  return (
    <section className="panel pdf-import-panel">
      <div className="pdf-import-heading">
        <div>
          <span className="eyebrow"><FileUp size={14} /> PDF TIMETABLE IMPORT</span>
          <h2>Build lecturer schedules from a PDF</h2>
          <p>Upload a weekday timetable with course codes and a lecturer-by-code list. Files are processed in this browser.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={chooseFile} disabled={isReading}>
          {isReading ? <Loader2 className="pdf-spinner" size={16}/> : <FileUp size={16}/>}
          {isReading ? 'Reading PDF…' : 'Choose PDF'}
        </button>
      </div>
      <input ref={inputRef} className="pdf-file-input" type="file" accept=".pdf,application/pdf" onChange={readFile}/>
      {error && <div className="pdf-import-error" role="alert"><AlertTriangle size={16}/><span>{error}</span></div>}
      {expanded && preview.length > 0 && (
        <div className="pdf-import-preview">
          <div className="pdf-preview-heading">
            <div><CheckCircle2 size={17}/><b>{preview.length} lecture sessions found</b><span>{fileName}</span></div>
            <button type="button" className="icon-btn" aria-label="Close preview" onClick={() => { setExpanded(false); setError(''); }}><X size={17}/></button>
          </div>
          <div className="pdf-preview-table-wrap">
            <table className="pdf-preview-table">
              <thead><tr><th>DAY</th><th>TIME</th><th>COURSE</th><th>LECTURER</th><th>ROOM</th></tr></thead>
              <tbody>{preview.slice(0, 8).map(item => (
                <tr key={item.id}>
                  <td>{days[item.day]}</td>
                  <td>{fmt(item.start)}–{fmt(item.end)}</td>
                  <td><b>{item.code}</b><small>{item.title}</small></td>
                  <td>{item.lecturer}</td>
                  <td>{item.room}</td>
                </tr>
              ))}</tbody>
            </table>
            {preview.length > 8 && <small className="pdf-preview-more">Showing 8 of {preview.length} sessions.</small>}
          </div>
          <p className="pdf-replace-note">Choose whether to replace your current timetable or add these sessions to it.</p>
          <div className="pdf-import-actions">
            <button type="button" className="btn btn-secondary" onClick={() => finishImport(false)}>Add to current timetable</button>
            <button type="button" className="btn btn-primary" onClick={() => finishImport(true)}>Replace current timetable</button>
          </div>
        </div>
      )}
    </section>
  );
}
