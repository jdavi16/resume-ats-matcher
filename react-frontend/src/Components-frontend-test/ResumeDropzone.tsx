import { useRef, useState } from 'react';
import { IconCloudUpload, IconX } from '@tabler/icons-react';
import * as pdfjslib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjslib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
interface ResumeDropzoneProps {
  onTextExtracted: (text: string) => void;
}

export function ResumeDropzone({ onTextExtracted }: ResumeDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const parsePdfText = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are accepted');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setErrorMsg('File size must be less than 30MB');
      return;
    }

    setErrorMsg(null);
    setFileName(file.name);
    setParsing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjslib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      // Clean text for Java
      const cleanText = fullText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
      onTextExtracted(cleanText);
    } catch (err) {
      console.error('Failed to parse text vectors from uploaded PDF:', err);
    } finally {
      setParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parsePdfText(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto px-4 relative '>
      <label
        htmlFor='resume-file-input'
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full min-h-55 pb-12.5 pt-8 px-4 flex flex-col bg-base-200 hover:bg-base-300 cursor-pointer items-center justify-center border-2 border-gray-700 rounded-xl transition-all duration-200 select-none
          ${parsing ? 'opacity-60 pointer-events-none' : ''}
          ${errorMsg ? 'border-error bg-error/5 text-error' : ''}
          ${isDragging && !errorMsg ? 'border-primary bg-primary/5 text-primary scale-[0.99]' : 'border-base-300 bg-base-100 text-base-content'}
        `}>
        <input id='resume-file-input' type='file' ref={fileInputRef} onChange={(e) => e.target.files?.[0] && parsePdfText(e.target.files[0])} accept='.pdf' className='hidden' />
        {/* State Icon Indicator Display */}
        <div className='flex justify-center mb-4'>
          {parsing ? (
            <span className='loading loading-spinner loading-lg text-primary'></span>
          ) : errorMsg ? (
            <IconX size={50} className='text-error' stroke={1.5} />
          ) : (
            <IconCloudUpload size={50} className={isDragging ? 'text-primary' : 'text-base-content/60'} stroke={1.5} />
          )}
        </div>

        {/* Dynamic Context Header Status Strings */}
        <h3 className='text-lg font-bold text-center mb-2'>
          {parsing ? 'Parsing Resume...' : errorMsg ? errorMsg : isDragging ? 'Drop file here' : fileName ? <span className='text-success'>Active File: {fileName}</span> : 'Upload Resume'}
        </h3>
        <p className='text-sm text-center text-base-content/60 max-w-sm'>
          Drag &apos;n&apos; drop files here to upload. We can accept only <i className='font-semibold text-base-content'>.pdf</i> files that are less than 30MB in size.
        </p>
      </label>

      <button
        type='button'
        disabled={parsing}
        onClick={() => fileInputRef.current?.click()}
        className='btn btn-primary rounded-full absolute w-62.5 left-1/2 -translate-x-1/2 -bottom-5 shadow-lg z-10'>
        {fileName ? 'Change Resume File' : 'Select Files'}
      </button>
    </div>
  );
}
